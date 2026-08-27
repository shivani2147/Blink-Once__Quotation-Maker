import React, { useState } from 'react';
import HeaderForm from './components/HeaderForm';
import QuotationDetailsForm from './components/QuotationDetailsForm';
import ServicesForm from './components/ServicesForm';
import TeamForm from './components/TeamForm';
import QuotationPreview from './components/QuotationPreview';
import WeddingQuotationPreview from './components/WeddingQuotationPreview';
import ProformaInvoicePreview from './components/ProformaInvoicePreview';
import { downloadQuotationPDF } from './utils/pdfExport';
import defaultLogo from '../Image/_Logo_.png';
import proformaLogo from '../Image/Only logo.png';
import {
  Building2,
  CheckCircle2,
  Download,
  Edit3,
  FileText,
  Archive,
  Trash2,
  Printer,
  RotateCcw,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

const QUOTATION_YEAR = new Date().getFullYear();
const FIRST_QUOTATION_NUMBER = 201;

const getNextQuotationRef = () => {
  const nextNumber = Number(localStorage.getItem('quotationNextNumber')) || FIRST_QUOTATION_NUMBER;
  return `QT-${QUOTATION_YEAR}-${nextNumber}`;
};

const FIRST_PROFORMA_NUMBER = 501;
const getNextProformaRef = () => {
  const storedNumber = Number(localStorage.getItem('proformaNextNumber')) || FIRST_PROFORMA_NUMBER;
  const nextNumber = Math.max(storedNumber, FIRST_PROFORMA_NUMBER);
  const paddedNum = String(nextNumber).padStart(3, '0');
  return `PI-${QUOTATION_YEAR}-${paddedNum}`;
};

const updateQuotationSequence = (quoteId) => {
  const match = String(quoteId).match(/^(QT|PI)-\d+-(\d+)$/);
  if (!match) return;
  const isProforma = match[1] === 'PI';
  const currentNumber = Number(match[2]);
  const storageKey = isProforma ? 'proformaNextNumber' : 'quotationNextNumber';
  const firstNumber = isProforma ? FIRST_PROFORMA_NUMBER : FIRST_QUOTATION_NUMBER;
  const nextNumber = Math.max(Number(localStorage.getItem(storageKey)) || firstNumber, firstNumber);
  if (currentNumber >= nextNumber) {
    localStorage.setItem(storageKey, String(currentNumber + 1));
  }
};

const getPdfFilename = (quotationMode, details) => {
  const clientName = details.clientName?.trim() || 'Client';
  const formattedClientName = clientName.replace(/\b\w/g, character => character.toUpperCase());

  if (quotationMode === 'proforma') {
    const invoiceNumber = String(details.quoteId || '').match(/(\d{3})$/)?.[1] || '000';
    return `${invoiceNumber} ${formattedClientName} Invoice`;
  }

  const quotationName = quotationMode === 'wedding' ? 'Booking Receipt' : (details.quoteTitle?.trim() || 'Quotation');
  return `${clientName} ${quotationName}`;
};

export default function App() {
  const getRouteState = () => {
    const path = window.location.pathname;
    if (path.startsWith('/corporate')) {
      return { mode: 'corporate', view: path.endsWith('/saved') ? 'saved' : 'maker' };
    }
    if (path.startsWith('/wedding')) {
      return { mode: 'wedding', view: path.endsWith('/saved') ? 'saved' : 'maker' };
    }
    if (path.startsWith('/proforma')) {
      return { mode: 'proforma', view: path.endsWith('/saved') ? 'saved' : 'maker' };
    }
    return { mode: null, view: 'maker' };
  };

  const initialRoute = getRouteState();
  const getInitialCompany = (mode) => ({
    logoType: 'custom',
    logoPresetId: '',
    logoSvg: '',
    logoUrl: mode === 'proforma' ? proformaLogo : defaultLogo,
    name: 'Blink Once Solutions',
    phone: '+91 79777 05652',
    email: 'blinkoncedigital@gmail.com',
    address: 'Omkar Indrapuri, Kanyapada, Gokuldham, Goregaon (E), Mumbai - 400063',
    gstNo: '27DCYPS0516J1ZY',
    bankName: 'Union Bank of India',
    accountNo: '721801010050216',
    branch: 'Malad East, Mumbai 400097',
    ifsc: 'UBIN0572187'
  });

  const getInitialDetails = (mode) => ({
    quoteTitle: mode === 'proforma' ? 'Proforma Invoice' : 'Booking Receipt',
    paymentTerms: 'Advance Paid',
    quotationRef: 'Special August Offer',
    clientName: '',
    contact: '',
    date: new Date().toISOString().split('T')[0],
    eventName: '',
    eventTiming: '',
    venue: '',
    quoteId: mode === 'proforma' ? getNextProformaRef() : getNextQuotationRef(),
    clientGstNo: '',
    clientState: '',
    clientZipCode: '',
    globalTaxType: 'cgst_sgst'
  });

  // 1. Header (Company Logo, Name, Phone, Email)
  const [company, setCompany] = useState(() => getInitialCompany(initialRoute.mode));

  // 2. Input Fields
  const [details, setDetails] = useState(() => getInitialDetails(initialRoute.mode));

  const getInitialServices = (mode) => [
    { id: 1, name: '', description: mode === 'wedding' ? 'Photo, Video, Candid & Cinimatic' : '', quantity: '', rate: 0, tax: 0, discount: 0, date: '', timing: '', team: mode === 'wedding' ? '6 Professionals' : '' }
  ];

  // 3. Services Table — starts with one blank row
  const [services, setServices] = useState(() => getInitialServices(initialRoute.mode));

  // 4. Team Members — starts with one blank member
  const [team, setTeam] = useState([
    { id: 1, name: '', role: '' }
  ]);

  const [servicesMode, setServicesMode] = useState('simple'); // 'detailed' | 'simple'

  // 5. Visibility toggles — each key controls a section/field in the document
  const [visibility, setVisibility] = useState({
    logo: true,
    companyName: true,
    companyPhone: true,
    companyEmail: true,
    companyAddress: true,
    clientEventSection: true,   // Entire Client & Event block
    contact: true,
    invoiceDate: true,
    quoteTitle: true,
    clientName: true,
    clientEmail: true,
    clientAddress: true,
    clientState: true,
    clientZipCode: true,
    clientGstNo: true,
    quoteId: true,
    eventName: true,
    eventTiming: true,
    venue: true,
    taxRow: true,
    teamSection: true,
    termsSection: true,
    bankDetails: true,
    priceCol: true,
    colDate: true,
    colEvent: true,
    colTiming: false,
    colServices: true,
    colTeam: true,
  });

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Additional settings
  const [currency, setCurrency] = useState('₹');
  const [theme, setTheme] = useState('navy');
  const [paidAmount, setPaidAmount] = useState('');
  const [packageTotal, setPackageTotal] = useState('');

  const [isDone, setIsDone] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeView, setActiveView] = useState(initialRoute.view);
  const [quotationMode, setQuotationMode] = useState(initialRoute.mode);
  const savedStorageKey = quotationMode === 'wedding' ? 'savedWeddingQuotations' : (quotationMode === 'proforma' ? 'savedProformaQuotations' : 'savedCorporateQuotations');
  const [savedQuotations, setSavedQuotations] = useState(() => {
    try {
      return [];
    } catch {
      return [];
    }
  });
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    const route = getRouteState();
    if (route.mode !== quotationMode && route.mode) {
      handleResetForm(true, route.mode);
    }
    setQuotationMode(route.mode);
    setActiveView(route.view);
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const route = getRouteState();
      setQuotationMode(route.mode);
      setActiveView(route.view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    if (!quotationMode) return;
    try {
      const legacyCorporate = quotationMode === 'corporate' ? localStorage.getItem('savedQuotations') : null;
      const storedQuotations = localStorage.getItem(savedStorageKey) || legacyCorporate || '[]';
      setSavedQuotations(JSON.parse(storedQuotations));
    } catch {
      setSavedQuotations([]);
    }
    setSelectedQuotationId(null);
  }, [quotationMode, savedStorageKey]);

  const saveQuotation = () => {
    const quotation = {
      id: details.quoteId || `QT-${Date.now()}`,
      savedAt: new Date().toISOString(),
      company, details, services, team, currency, theme, visibility, servicesMode, paidAmount, packageTotal
      , quotationMode
    };
    updateQuotationSequence(quotation.id);
    const nextQuotations = [quotation, ...savedQuotations.filter(item => item.id !== quotation.id)];
    setSavedQuotations(nextQuotations);
    localStorage.setItem(savedStorageKey, JSON.stringify(nextQuotations));
    setSelectedQuotationId(quotation.id);
  };

  const loadQuotation = (quotation) => {
    setCompany(quotation.company);
    setDetails({ quoteTitle: 'Booking Receipt', paymentTerms: 'Advance Paid', quotationRef: 'Special August Offer', ...quotation.details });
    setServices(quotation.services);
    setTeam(quotation.team);
    setCurrency(quotation.currency);
    setTheme(quotation.theme);
    setPaidAmount(Number(quotation.paidAmount) > 0 ? Number(quotation.paidAmount) : '');
    setPackageTotal(Number(quotation.packageTotal) > 0 ? Number(quotation.packageTotal) : '');
    setVisibility({ quoteTitle: true, ...quotation.visibility });
    setServicesMode(quotation.servicesMode);
    setQuotationMode(quotation.quotationMode || 'corporate');
    setSelectedQuotationId(quotation.id);
    setIsDone(false);
    navigate(`/${quotation.quotationMode || quotationMode}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPreview = (quotation = null) => {
    const previewProps = quotation || { company, details, services, team, currency, theme, visibility, servicesMode, paidAmount, packageTotal };
    if ((quotation?.quotationMode || quotationMode) === 'wedding') return <WeddingQuotationPreview {...previewProps} />;
    if ((quotation?.quotationMode || quotationMode) === 'proforma') return <ProformaInvoicePreview {...previewProps} />;
    return <QuotationPreview {...previewProps} setTheme={quotation ? () => { } : setTheme} />;
  };

  const deleteQuotation = (quotationId) => {
    if (window.confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) {
      const nextQuotations = savedQuotations.filter(item => item.id !== quotationId);
      setSavedQuotations(nextQuotations);
      localStorage.setItem(savedStorageKey, JSON.stringify(nextQuotations));
      if (selectedQuotationId === quotationId) setSelectedQuotationId(null);
    }
  };

  const handleDoneClick = () => {
    saveQuotation();
    setIsDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = () => setIsDone(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const filename = getPdfFilename(quotationMode, details)
      .replace(/[<>:"/\\|?*]+/g, '')
      .replace(/\s+/g, ' ')
      .trim() + '.pdf';
    await downloadQuotationPDF('quotation-document', filename);
    setIsDownloading(false);
  };

  const handleResetForm = (skipPrompt = false, targetMode = quotationMode) => {
    if (skipPrompt === true || window.confirm('Clear all fields and start fresh?')) {
      setCompany(getInitialCompany(targetMode));
      setDetails(getInitialDetails(targetMode));
      setServices(getInitialServices(targetMode).map(s => ({ ...s, id: Date.now() })));
      setTeam([{ id: Date.now(), name: '', role: '' }]);
      setCurrency('₹');
      setPaidAmount('');
      setPackageTotal('');
      setServicesMode('detailed');
      setVisibility({
        logo: true, companyName: true, companyPhone: true, companyEmail: true, companyAddress: true,
        clientEventSection: true,
        contact: true, invoiceDate: true,
        quoteTitle: true, clientName: true, clientEmail: true, clientAddress: true, clientState: true, clientZipCode: true, clientGstNo: true, quoteId: true, eventName: true, eventTiming: true,
        venue: true, taxRow: true, teamSection: true,
        termsSection: true, bankDetails: true, priceCol: true,
        colDate: true, colEvent: true, colTiming: false, colServices: true, colTeam: true
      });
      setIsDone(false);
      return true;
    }
    return false;
  };

  if (!quotationMode) {
    return (
      <main className="mode-landing">
        <div className="mode-landing-brand">
          <div className="brand-icon"><Building2 size={26} /></div>
          <div>
            <div className="brand-title">Blink Once Quotation Studio</div>
            <div className="brand-subtitle">Choose a document maker to get started</div>
          </div>
        </div>
        <div className="mode-landing-copy">
          <div className="eyebrow">BLINK ONCE DOCUMENT STUDIO</div>
          <h1>What are you creating today?</h1>
          <p>Choose a workspace built for the kind of work you are quoting.</p>
        </div>
        <div className="mode-options">
          <button className="mode-option mode-option-corporate" onClick={() => navigate('/corporate')}>
            <span className="mode-option-icon"><Building2 size={28} /></span>
            <span className="mode-option-content"><strong>Corporate Quotation Maker</strong><small>Executive proposals, services and client quotations</small></span>
            <span className="mode-option-arrow">→</span>
          </button>
          <button className="mode-option mode-option-proforma" onClick={() => navigate('/proforma')}>
            <span className="mode-option-icon"><FileText size={28} /></span>
            <span className="mode-option-content"><strong>Proforma Bill Maker</strong><small>GST-ready bills for products, services and advance payments</small></span>
            <span className="mode-option-arrow">→</span>
          </button>
          <button className="mode-option mode-option-wedding" onClick={() => navigate('/wedding')}>
            <span className="mode-option-icon"><span>♡</span></span>
            <span className="mode-option-content"><strong>Wedding Quotation Receipt Maker</strong><small>Elegant wedding invoices, events and payment receipts</small></span>
            <span className="mode-option-arrow">→</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Application Header */}
      <header className="app-header">
        <div className="brand-container">
          <div className="brand-icon">
            <Building2 size={20} />
          </div>
          <div>
            <div className="brand-title">Blink Once</div>
            <div className="brand-subtitle">Quotation Maker</div>
          </div>
        </div>

        <nav className="app-nav" aria-label="Application navigation">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => {
              if (handleResetForm(true)) {
                setIsDone(false);
                setSelectedQuotationId(null);
                navigate(`/${quotationMode}`);
              }
            }}
          >
            <FileText size={15} /> {quotationMode === 'proforma' ? 'New Invoice' : 'New Quotation'}
          </button>
          <button className={`btn btn-sm ${activeView === 'saved' ? 'btn-primary' : 'btn-outline'}`} onClick={() => navigate(`/${quotationMode}/saved`)}>
            <Archive size={15} /> {quotationMode === 'proforma' ? 'Saved Invoices' : 'Saved Quotations'}
            {savedQuotations.length > 0 && <span className="nav-count">{savedQuotations.length}</span>}
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {activeView === 'maker' && (isDone ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline btn-sm" onClick={handleEditClick}>
                <Edit3 size={15} /> Edit Details
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Printer size={15} /> Print
              </button>
              <button
                className="btn btn-success"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
              >
                <Download size={18} />
                {isDownloading ? 'Generating PDF...' : 'Download Quotation (PDF)'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={handleResetForm} title="Reset to demo data">
                <RotateCcw size={14} /> Reset
              </button>
              <button className="btn btn-primary" onClick={handleDoneClick}>
                <CheckCircle2 size={18} /> Done & Generate
              </button>
            </div>
          ))}
        </div>
      </header>

      {/* Main Workspace Layout */}
      {activeView === 'saved' ? (
        <main className="saved-workspace">
          <div className="saved-heading">
            <div>
              <div className="eyebrow"><Archive size={14} /> QUOTATION LIBRARY</div>
              <h1>Saved Quotations</h1>
              <p>Open a quotation to review it or continue editing its details.</p>
            </div>
          </div>
          {savedQuotations.length === 0 ? (
            <div className="glass-card empty-state"><Archive size={34} /><h2>No saved quotations yet</h2><p>Finalize a quotation to keep it here for later editing.</p></div>
          ) : (
            <div className="saved-layout">
              <div className="saved-list">
                {savedQuotations.map(quotation => (
                  <div className={`saved-item ${selectedQuotationId === quotation.id ? 'active' : ''}`} key={quotation.id}>
                    <button className="saved-item-main" onClick={() => setSelectedQuotationId(quotation.id)}>
                      <span className="saved-item-icon"><FileText size={18} /></span>
                      <span><strong>{quotation.details.clientName || 'Unnamed client'}</strong><small>{quotation.id} · {quotation.details.eventName || 'No event name'}</small></span>
                    </button>
                    <div className="saved-item-actions">
                      <button className="icon-btn" title="Download PDF" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuotationId(quotation.id);
                        setTimeout(async () => {
                          setIsDownloading(true);
                          const qMode = quotation.quotationMode || quotationMode;
                          const filename = getPdfFilename(qMode, quotation.details).replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, ' ').trim() + '.pdf';
                          await downloadQuotationPDF('quotation-document', filename);
                          setIsDownloading(false);
                        }, 100);
                      }}><Download size={15} /></button>
                      <button className="icon-btn" title="Edit quotation" onClick={() => loadQuotation(quotation)}><Edit3 size={15} /></button>
                      <button className="icon-btn danger" title="Delete quotation" onClick={() => deleteQuotation(quotation.id)}><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="saved-preview">
                {(() => {
                  const quotation = savedQuotations.find(item => item.id === selectedQuotationId) || savedQuotations[0];
                  return quotation ? renderPreview(quotation) : null;
                })()}
              </div>
            </div>
          )}
        </main>
      ) : <main className="main-wrapper">

        {/* Left Column: Form Editor */}
        {!isDone && (
          <div className="editor-section">
            <HeaderForm
              company={company}
              setCompany={setCompany}
              visibility={visibility}
              toggleVisibility={toggleVisibility}
              quotationMode={quotationMode}
              paidAmount={paidAmount}
            />
            <QuotationDetailsForm
              details={details}
              setDetails={setDetails}
              visibility={visibility}
              toggleVisibility={toggleVisibility}
              quotationMode={quotationMode}
            />
            <ServicesForm
              details={details}
              setDetails={setDetails}
              services={services}
              setServices={setServices}
              currency={currency}
              setCurrency={setCurrency}
              visibility={visibility}
              toggleVisibility={toggleVisibility}
              servicesMode={servicesMode}
              setServicesMode={setServicesMode}
              quotationMode={quotationMode}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              packageTotal={packageTotal}
              setPackageTotal={setPackageTotal}
            />
            {quotationMode === 'wedding' ? (
              <div className="glass-card">
                <div className="section-title">
                  <div className="section-title-left">
                    <ShieldCheck size={20} />
                    <span>4. Payment Details</span>
                  </div>
                </div>
                <div className="payment-details-grid">
                  <div>
                    <label className="form-label" htmlFor="wedding-package-total">Package Total ({currency})</label>
                    <div className="payment-input-wrap">
                      <span>{currency}</span>
                      <input
                        id="wedding-package-total"
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-input"
                        value={packageTotal}
                        onChange={(e) => setPackageTotal(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="wedding-advance-paid">Advance Paid ({currency})</label>
                    <div className="payment-input-wrap">
                      <span>{currency}</span>
                      <input
                        id="wedding-advance-paid"
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-input"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : quotationMode === 'corporate' ? (
              <TeamForm
                team={team}
                setTeam={setTeam}
                visibility={visibility}
                toggleVisibility={toggleVisibility}
              />
            ) : null}

            {/* Document Options: Terms & Signature — not needed for Proforma */}
            {quotationMode !== 'proforma' && (<div className="glass-card">
              <div className="section-title">
                <div className="section-title-left">
                  <ShieldCheck size={20} />
                  <span>5. Document Options</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {[
                  { key: 'termsSection', label: 'Terms & Conditions', desc: 'Show payment terms on document' },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    style={{
                      flex: '1 1 200px',
                      background: 'var(--bg-input)',
                      border: `1px solid ${visibility[key] ? 'rgba(16,185,129,0.35)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                    <button
                      type="button"
                      className={`vis-toggle-btn ${visibility[key] ? 'visible' : 'hidden'}`}
                      onClick={() => toggleVisibility(key)}
                    >
                      {visibility[key] ? <Eye size={13} /> : <EyeOff size={13} />}
                      {visibility[key] ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Done Action Button */}
            <div className="glass-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <ShieldCheck size={20} color="var(--accent-emerald)" style={{ display: 'inline', marginRight: '6px' }} />
                Review your client name, date, event timing, services, and team details above.
              </div>
              <button
                type="button"
                className="btn btn-success btn-lg"
                style={{ width: '100%', maxWidth: '400px' }}
                onClick={handleDoneClick}
              >
                <CheckCircle2 size={22} /> Done — Finalize & Generate PDF
              </button>
            </div>
          </div>
        )}

        {/* Right Column: Live Document Preview */}
        <div
          className="preview-section"
          style={{
            gridColumn: isDone ? '1 / -1' : 'auto',
            maxWidth: isDone ? '900px' : '100%',
            margin: isDone ? '0 auto' : '0'
          }}
        >
          {isDone && (
            <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={24} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>Quotation Finalized & Ready</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click Download to save a clean PDF copy for your client.</div>
                </div>
              </div>
              <button className="btn btn-success btn-lg" onClick={handleDownloadPDF} disabled={isDownloading}>
                <Download size={20} /> {isDownloading ? 'Downloading...' : 'Download Quotation (PDF)'}
              </button>
            </div>
          )}

          {renderPreview()}
        </div>

      </main>}
    </div>
  );
}
