import React from 'react';
import { UserCheck, Eye, EyeOff } from 'lucide-react';

function VisToggle({ isOn, onToggle, label }) {
  return (
    <button
      type="button"
      className={`vis-field-toggle ${isOn ? 'on' : 'off'}`}
      onClick={onToggle}
      title={isOn ? `Hide "${label}" on document` : `Show "${label}" on document`}
    >
      {isOn ? <Eye size={11} /> : <EyeOff size={11} />}
      {isOn ? 'Visible' : 'Hidden'}
    </button>
  );
}

export default function QuotationDetailsForm({ details, setDetails, visibility, toggleVisibility, quotationMode }) {
  const isWedding = quotationMode === 'wedding';
  const isProforma = quotationMode === 'proforma';
  const handleChange = (field, value) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`glass-card ${!visibility.clientEventSection ? 'section-hidden' : ''}`}>
      <div className="section-title">
        <div className="section-title-left">
          <UserCheck size={20} />
          <span>
            {isProforma ? '2. Client & Invoice Details' : isWedding ? '2. Client & Invoice Information' : '2. Client & Event Information'}
          </span>
        </div>
      </div>

      <div className={visibility.clientEventSection ? '' : 'field-hidden-wrap'}>

        {/* ── PROFORMA MODE ── */}
        {isProforma && (
          <div className="form-grid">
            <div className="form-group form-grid-full">
              <label className="form-label">Invoice Title</label>
              <input
                type="text" className="form-input"
                placeholder="e.g. PROFORMA INVOICE"
                value={details.quoteTitle}
                onChange={(e) => handleChange('quoteTitle', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Invoice No. *</label>
              <input
                type="text" className="form-input"
                placeholder="e.g. QT-2026-001"
                value={details.quoteId}
                onChange={(e) => handleChange('quoteId', e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Invoice Date *</label>
                <VisToggle isOn={visibility.invoiceDate !== false} onToggle={() => toggleVisibility('invoiceDate')} label="Invoice Date" />
              </div>
              <input
                type="date" className="form-input"
                value={details.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            <div className="form-group form-grid-full" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <label className="form-label" style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>Client Details</label>
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Client Name *</label>
                <VisToggle isOn={visibility.clientName !== false} onToggle={() => toggleVisibility('clientName')} label="Client Name" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Adfactors Advertising LLP"
                value={details.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Client Phone</label>
                <VisToggle isOn={visibility.contact !== false} onToggle={() => toggleVisibility('contact')} label="Client Phone" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={details.contact || ''}
                onChange={(e) => handleChange('contact', e.target.value)}
              />
            </div>

            <div className="form-group form-grid-full">
              <div className="vis-field-row">
                <label className="form-label">Client Email</label>
                <VisToggle isOn={visibility.clientEmail !== false} onToggle={() => toggleVisibility('clientEmail')} label="Client Email" />
              </div>
              <input
                type="email" className="form-input"
                placeholder="e.g. client@company.com"
                value={details.eventName || ''}
                onChange={(e) => handleChange('eventName', e.target.value)}
              />
            </div>

            <div className="form-group form-grid-full">
              <div className="vis-field-row">
                <label className="form-label">Client Address</label>
                <VisToggle isOn={visibility.clientAddress !== false} onToggle={() => toggleVisibility('clientAddress')} label="Client Address" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Peninsula Business Park, B Wing, Unit No. 1101"
                value={details.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">State</label>
                <VisToggle isOn={visibility.clientState !== false} onToggle={() => toggleVisibility('clientState')} label="State" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Maharashtra"
                value={details.clientState || ''}
                onChange={(e) => handleChange('clientState', e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Zip Code</label>
                <VisToggle isOn={visibility.clientZipCode !== false} onToggle={() => toggleVisibility('clientZipCode')} label="Zip Code" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. 400013"
                value={details.clientZipCode || ''}
                onChange={(e) => handleChange('clientZipCode', e.target.value)}
              />
            </div>

            <div className="form-group form-grid-full">
              <div className="vis-field-row">
                <label className="form-label">Client GSTIN</label>
                <VisToggle isOn={visibility.clientGstNo !== false} onToggle={() => toggleVisibility('clientGstNo')} label="Client GSTIN" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. 27AAAFA5020C1ZA"
                value={details.clientGstNo || ''}
                onChange={(e) => handleChange('clientGstNo', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── WEDDING MODE ── */}
        {isWedding && (
          <div className="wedding-details-columns">
            <div className="wedding-details-column">
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Client Name *</label>
                  <VisToggle isOn={visibility.clientName} onToggle={() => toggleVisibility('clientName')} label="Client Name" />
                </div>
                <input type="text" className="form-input" placeholder="e.g. Client Name" value={details.clientName} onChange={(e) => handleChange('clientName', e.target.value)} />
              </div>
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Contact</label>
                  <VisToggle isOn={visibility.contact} onToggle={() => toggleVisibility('contact')} label="Contact" />
                </div>
                <input type="text" className="form-input" placeholder="e.g. +91 98765 43210" value={details.contact || ''} onChange={(e) => handleChange('contact', e.target.value)} />
              </div>
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Venue / Location</label>
                  <VisToggle isOn={visibility.venue} onToggle={() => toggleVisibility('venue')} label="Venue / Location" />
                </div>
                <input type="text" className="form-input" placeholder="e.g. Wedding venue" value={details.venue} onChange={(e) => handleChange('venue', e.target.value)} />
              </div>
            </div>
            <div className="wedding-details-column">
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Invoice Date</label>
                  <VisToggle isOn={visibility.invoiceDate} onToggle={() => toggleVisibility('invoiceDate')} label="Invoice Date" />
                </div>
                <input type="date" className="form-input" value={details.date} onChange={(e) => handleChange('date', e.target.value)} />
              </div>
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Invoice No.</label>
                  <VisToggle isOn={visibility.quoteId} onToggle={() => toggleVisibility('quoteId')} label="Invoice No." />
                </div>
                <input type="text" className="form-input" value={details.quoteId || ''} onChange={(e) => handleChange('quoteId', e.target.value)} />
              </div>
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Quotation Ref.</label>
                  <VisToggle isOn={visibility.quoteId} onToggle={() => toggleVisibility('quoteId')} label="Quotation Ref." />
                </div>
                <input type="text" className="form-input" value={details.quotationRef || 'Special August Offer'} onChange={(e) => handleChange('quotationRef', e.target.value)} />
              </div>
              <div className="form-group">
                <div className="vis-field-row">
                  <label className="form-label">Payment Terms</label>
                  <VisToggle isOn={visibility.termsSection} onToggle={() => toggleVisibility('termsSection')} label="Payment Terms" />
                </div>
                <input
                  type="text" className="form-input"
                  placeholder="Advance Paid"
                  value={details.paymentTerms ?? 'Advance Paid'}
                  onChange={(e) => handleChange('paymentTerms', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── CORPORATE MODE ── */}
        {!isWedding && !isProforma && (
          <div className="form-grid">
            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Client Name *</label>
                <VisToggle isOn={visibility.clientName} onToggle={() => toggleVisibility('clientName')} label="Client Name" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Apex Financial Group / Sarah Jenkins"
                value={details.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                style={{ opacity: visibility.clientName ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Event Name *</label>
                <VisToggle isOn={visibility.eventName} onToggle={() => toggleVisibility('eventName')} label="Event Name" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Annual Leadership Summit & Gala"
                value={details.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
                style={{ opacity: visibility.eventName ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Event Timing *</label>
                <VisToggle isOn={visibility.eventTiming} onToggle={() => toggleVisibility('eventTiming')} label="Event Timing" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Oct 24, 2026 | 09:00 AM - 06:00 PM EST"
                value={details.eventTiming}
                onChange={(e) => handleChange('eventTiming', e.target.value)}
                style={{ opacity: visibility.eventTiming ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Venue / Event Location</label>
                <VisToggle isOn={visibility.venue} onToggle={() => toggleVisibility('venue')} label="Venue" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. Grand Horizon Convention Center, Hall B"
                value={details.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                style={{ opacity: visibility.venue ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>

            <div className="form-group form-grid-full">
              <div className="vis-field-row">
                <label className="form-label">Quotation Name *</label>
                <VisToggle isOn={visibility.quoteTitle} onToggle={() => toggleVisibility('quoteTitle')} label="Quotation name" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. QUOTATION"
                value={details.quoteTitle}
                onChange={(e) => handleChange('quoteTitle', e.target.value)}
                style={{ opacity: visibility.quoteTitle ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quotation Date *</label>
              <input
                type="date" className="form-input"
                value={details.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="vis-field-row">
                <label className="form-label">Quotation Ref #</label>
                <VisToggle isOn={visibility.quoteId} onToggle={() => toggleVisibility('quoteId')} label="Quote Ref #" />
              </div>
              <input
                type="text" className="form-input"
                placeholder="e.g. QT-2026-8092"
                value={details.quoteId}
                onChange={(e) => handleChange('quoteId', e.target.value)}
                style={{ opacity: visibility.quoteId ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

