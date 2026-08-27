import React from 'react';
import { Phone, Mail, MapPin, Clock, Layers, Users, FileCheck, Eye, EyeOff, CalendarDays, PhoneCall } from 'lucide-react';

const formatIssuedDate = (dateValue) => {
  const date = new Date(`${dateValue || new Date().toISOString().split('T')[0]}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue || '';
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

export default function QuotationPreview({ company, details, services, team, currency, theme, setTheme, visibility, servicesMode, paidAmount = 0 }) {

  // Calculate Totals
  const subtotal = services.reduce((acc, item) => {
    return acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0);
  }, 0);

  const totalTax = visibility.taxRow
    ? services.reduce((acc, item) => {
      const base = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      return acc + base * ((Number(item.tax) || 0) / 100);
    }, 0)
    : 0;

  const grandTotal = subtotal + totalTax;
  const balanceDue = Math.max(0, grandTotal - (Number(paidAmount) || 0));

  const getInitials = (name) => {
    if (!name) return 'TM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const themes = [
    { id: 'navy', label: 'Executive Navy', color: '#0f172a' },
    { id: 'emerald', label: 'Emerald Slate', color: '#064e3b' },
    { id: 'blue', label: 'Royal Blue', color: '#1e3a8a' },
    { id: 'crimson', label: 'Crimson Slate', color: '#881337' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>

      {/* Theme Toolbar */}
      <div
        className="preview-toolbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck size={16} color="var(--accent-gold)" /> Live Document Theme:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem', fontWeight: 600,
                border: theme === t.id ? `2px solid ${t.color}` : '1px solid var(--border-color)',
                background: theme === t.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'var(--text-main)', cursor: 'pointer'
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color }}></span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* A4 Paper */}
      <div className="preview-container">
        <div id="quotation-document" className={`quotation-paper theme-${theme}`}>

          {/* ── HEADER: Logo (top center), Company Name, Phone, Email, Address ── */}
          <div className="doc-header">
            <div className="doc-logo-box">
              {visibility.logo && company.logoType === 'custom' && company.logoUrl ? (
                <img src={company.logoUrl} alt="Logo" className="doc-logo-img" />
              ) : visibility.logo && company.logoType === 'preset' && company.logoSvg ? (
                <div style={{ maxHeight: '75px', width: '220px' }} dangerouslySetInnerHTML={{ __html: company.logoSvg }} />
              ) : !visibility.logo ? null : (
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--doc-primary)' }}>
                  {company.name || 'YOUR COMPANY'}
                </div>
              )}
            </div>

            {visibility.companyName && (
              <div className="doc-company-name">
                {company.name || 'Corporate Company Name'}
              </div>
            )}

            {(visibility.companyPhone || visibility.companyEmail) && (
              <div className="doc-company-details">
                {visibility.companyPhone && company.phone && (
                  <span><Phone size={13} /> {company.phone}</span>
                )}
                {visibility.companyPhone && visibility.companyEmail && company.phone && company.email && <span>•</span>}
                {visibility.companyEmail && company.email && (
                  <span><Mail size={13} /> {company.email}</span>
                )}
              </div>
            )}

            {visibility.companyAddress && company.address && (
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />
                {company.address}
              </div>
            )}
          </div>

          {/* ── QUOTATION META BANNER ── */}
          <div className="doc-meta-banner">
            <div>
              {visibility.quoteTitle && (
                <div className="doc-quote-title">{details.quoteTitle || 'Booking Receipt'}</div>
              )}
              {visibility.quoteId && (
                <div className="doc-quote-number">{details.quoteId || 'QT-2026-001'}</div>
              )}
            </div>
            <div className="doc-meta-grid">
              <div>
                <div className="doc-meta-label">Date Issued</div>
                <div className="doc-meta-value">{formatIssuedDate(details.date)}</div>
              </div>
              <div>
                <div className="doc-meta-label">Status</div>
                <div className="doc-meta-value" style={{ color: 'var(--doc-accent)' }}>OFFICIAL DRAFT</div>
              </div>
            </div>
          </div>

          {/* ── CLIENT & EVENT BLOCKS ── */}
          {visibility.clientEventSection && (
            <div className="doc-info-grid">
              {(visibility.clientName || visibility.eventName) && (
                <div className="doc-info-block">
                  <div className="doc-info-heading">Prepared For (Client)</div>
                  {visibility.clientName && (
                    <div className="doc-info-main">
                      {details.clientName || 'Client Name / Organization'}
                    </div>
                  )}
                  {visibility.eventName && (
                    <div className="doc-info-sub" style={{ marginTop: visibility.clientName ? '0.25rem' : '0' }}>
                      <strong>Event:</strong> {details.eventName || 'Event Title / Project Name'}
                    </div>
                  )}
                </div>
              )}

              {(visibility.eventTiming || visibility.venue) && (
                <div className="doc-info-block">
                  <div className="doc-info-heading">Event Details</div>
                  {visibility.eventTiming && (
                    <div className="doc-info-main" style={{ fontSize: '0.95rem' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      Dates: {details.eventTiming || 'Date & Hours TBD'}
                    </div>
                  )}
                  {visibility.venue && (
                    <div className="doc-info-sub" style={{ marginTop: visibility.eventTiming ? '0.35rem' : '0' }}>
                      <strong>Venue:</strong> {details.venue || 'Event Location TBD'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── SERVICES TABLE ── */}
          <div className="doc-table-section">
            <div className="doc-table-title">
              <Layers size={14} /> Services & Deliverables
            </div>
            <table className="doc-services-table">
              <thead>
                <tr>
                  <th style={{ width: servicesMode === 'simple' ? '75%' : '50%' }}>Service Description</th>
                  {servicesMode !== 'simple' && <th style={{ width: '15%', textAlign: 'center' }}>Qty / Hrs</th>}
                  {servicesMode !== 'simple' && <th style={{ width: '20%', textAlign: 'right' }}>Rate ({currency})</th>}
                  <th style={{ width: servicesMode === 'simple' ? '25%' : '15%', textAlign: 'right' }}>Amount ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item, idx) => {
                  const qty = Number(item.quantity) || 0;
                  const rate = Number(item.rate) || 0;
                  const itemTotal = qty * rate;
                  return (
                    <tr key={item.id || idx}>
                      <td>
                        <div className="doc-item-title">{item.name || `Service Item #${idx + 1}`}</div>
                        {item.description && <div className="doc-item-desc">{item.description}</div>}
                      </td>
                      {servicesMode !== 'simple' && <td style={{ textAlign: 'center' }}>{qty}</td>}
                      {servicesMode !== 'simple' && (
                        <td style={{ textAlign: 'right' }}>
                          {currency}{rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      )}
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {currency}{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── FINANCIAL TOTALS ── */}
          <div className="doc-financials">
            <div className="doc-totals-card">
              {visibility.taxRow && totalTax > 0 && (
                <div className="doc-total-row">
                  <span>Estimated Tax / VAT:</span>
                  <span>{currency}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="doc-total-row grand-total">
                <span>Total Amount:</span>
                <span>{currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="doc-total-row">
                <span>Paid Amount:</span>
                <span>{currency}{Number(paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="doc-total-row balance-due">
                <span>Balance Due:</span>
                <span>{currency}{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* ── TEAM SECTION (conditionally rendered) ── */}
          {visibility.teamSection && team && team.length > 0 && (
            <div className="doc-team-section">
              <div className="doc-table-title" style={{ marginBottom: '0.5rem' }}>
                <Users size={14} /> Assigned Executive Team
              </div>
              <div className="doc-team-grid">
                {team.map((member, idx) => (
                  <div key={member.id || idx} className="doc-team-card">
                    <div>
                      <div className="doc-team-name">{member.name || 'Team Member'}</div>
                      {member.role?.trim() && <div className="doc-team-role">{member.role}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FOOTER: Payment Terms ── */}
          {visibility.termsSection && (
            <div className="doc-payment-terms">
              <div className="doc-payment-icon"><CalendarDays size={25} /></div>
              <div className="doc-payment-content">
                <div className="doc-terms-heading">Payment Terms & Notes</div>
                <div className="doc-payment-list">
                  <div><span>01</span> Booking amount - 30%</div>
                  <div><span>02</span> Second installment - 30% on or before event</div>
                  <div><span>03</span> 30% before final day of shooting (in cash/G-Pay)</div>
                  <div><span>04</span> Final payment - balance 10% on photo & video delivery</div>
                </div>
                <div className="doc-payment-contact"><PhoneCall size={12} /> You can make the payment via GPay / PhonePe - 9819616209</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
