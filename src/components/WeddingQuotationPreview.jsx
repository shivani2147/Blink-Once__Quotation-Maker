import React from 'react';
import { CalendarDays, PhoneCall, Phone, Mail, MapPin } from 'lucide-react';

const formatDate = (dateValue) => {
  const date = new Date(`${dateValue || new Date().toISOString().split('T')[0]}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue || '';
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};

export default function WeddingQuotationPreview({ company, details, services, team, currency, paidAmount = 0, packageTotal: enteredPackageTotal = '', visibility = {} }) {
  const calculatedPackageTotal = services.reduce((total, item) => {
    const amount = Number(item.rate) || 0;
    return total + amount;
  }, 0);
  const packageTotal = Number(enteredPackageTotal) > 0 ? Number(enteredPackageTotal) : calculatedPackageTotal;
  const advanceAmount = Number(paidAmount) || 0;
  const balanceAmount = Math.max(0, packageTotal - advanceAmount);
  const teamLabel = `${team.filter(member => member.name || member.role).length || 0} Professionals`;
  const paymentTermsText = details?.paymentTerms?.trim() || 'Advance Paid';
  const quotationRefText = details?.quotationRef?.trim() || 'Special August Offer';
  const leftMeta = [
    { key: 'clientName', visible: visibility.clientName !== false, label: 'Client Name', value: details.clientName || 'Client Name' },
    { key: 'venue', visible: visibility.venue !== false, label: 'Venue / Location', value: details.venue || 'Venue / Location' },
    { key: 'contact', visible: visibility.contact !== false, label: 'Contact', value: details.contact || company.phone || 'Contact Number' }
  ].filter(item => item.visible);
  const rightMeta = [
    { key: 'invoiceDate', visible: visibility.invoiceDate !== false, label: 'Invoice Date', value: formatDate(details.date) },
    { key: 'termsSection', visible: visibility.termsSection !== false, label: 'Payment Terms', value: paymentTermsText },
    { key: 'quoteId', visible: visibility.quoteId !== false, label: 'Quotation Ref.', value: quotationRefText }
  ].filter(item => item.visible);
  const maxRows = Math.max(leftMeta.length, rightMeta.length);
  const metaRows = Array.from({ length: maxRows }, (_, index) => [leftMeta[index], rightMeta[index]]);

  return (
    <div className="wedding-preview-shell">
      <div className="preview-toolbar wedding-toolbar">
        <span>Wedding Quotation Receipt Preview</span>
      </div>
      <div className="wedding-preview-container">
        <div id="quotation-document" className="wedding-paper">
          <header className="wedding-document-header">
            <div className="wedding-brand">
              {company.logoUrl && <img src={company.logoUrl} alt="Logo" />}
            </div>
            <div className="wedding-invoice-title">
              <h1>{details.quoteTitle || 'INVOICE'}</h1>
              <div className="wedding-invoice-ref">Invoice No.:<strong>{details.quoteId || 'BO-INV-2026-201'}</strong></div>
            </div>
          </header>

          <div className="wedding-company-details">
            {company.phone && <span><Phone size={12} /> {company.phone}</span>}
            {company.email && <span><Mail size={12} /> {company.email}</span>}
            {company.address && <span><MapPin size={12} /> {company.address}</span>}
          </div>

          <div className="wedding-divider" />

          <section className="wedding-meta-grid">
            {metaRows.map((row, rowIndex) => (
              <div className="wedding-meta-row" key={`meta-row-${rowIndex}`}>
                {row.map((item, colIndex) =>
                  item ? (
                    <div key={`${item.key}-${rowIndex}-${colIndex}`} className="wedding-meta-item">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ) : (
                    <div key={`empty-${rowIndex}-${colIndex}`} className="wedding-meta-item wedding-meta-empty" aria-hidden="true" />
                  )
                )}
              </div>
            ))}
          </section>

          <section className="wedding-events-section">
            <h2>Events &amp; Services</h2>
            <table className="wedding-events-table">
              <thead>
                <tr>
                  {visibility.colDate !== false && <th style={{ width: '12%' }}>Date</th>}
                  {visibility.colEvent !== false && <th style={{ width: '30.5%' }}>Event</th>}
                  {visibility.colTiming !== false && <th style={{ width: '15%' }}>Timing</th>}
                  {visibility.colServices !== false && <th style={{ width: '30.5%' }}>Services</th>}
                  {visibility.colTeam !== false && <th style={{ width: '12%' }}>Team</th>}
                </tr>
              </thead>
              <tbody>
                {services.map((item, index) => (
                  <tr key={item.id || index}>
                    {visibility.colDate !== false && <td>{item.date ? item.date : formatDate(details.date)}</td>}
                    {visibility.colEvent !== false && <td>{item.name || details.eventName || `Event ${index + 1}`}</td>}
                    {visibility.colTiming !== false && <td>{item.timing || details.eventTiming || 'Evening'}</td>}
                    {visibility.colServices !== false && <td>{item.description || item.name || 'Photography, Videography'}</td>}
                    {visibility.colTeam !== false && <td>{item.team || teamLabel}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="wedding-bottom-content">
            <section className="wedding-payment-summary">
              <h2>Payment Summary</h2>
              <div className="wedding-summary-row"><span>Package Total</span><strong>{currency}{packageTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong></div>
              <div className="wedding-summary-row"><span>Advance Paid</span><strong>{currency}{advanceAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong></div>
              <div className="wedding-summary-row wedding-balance-row"><span>Balance Amount</span><strong>{currency}{balanceAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong></div>
            </section>

            <p className="wedding-thank-you">Thank you for choosing Blink Once to be a part of your special moments.<br /><em>We look forward to capturing your beautiful memories.</em></p>

            <section className="wedding-payment-terms">
              <div className="wedding-payment-icon"><CalendarDays size={26} /></div>
              <div className="wedding-payment-content">
                <h2>Payment Terms &amp; Notes</h2>
                <div><b>01</b> BOOKING AMOUNT - 30%</div>
                <div><b>02</b> SECOND INSTALLMENT - 30% ON OR BEFORE EVENT</div>
                <div><b>03</b> 30% BEFORE THE FINAL DAY OF SHOOTING (IN CASH/G-PAY).</div>
                <div><b>04</b> FINAL PAYMENT - BALANCE 10% ON VIDEOS &amp; PHOTO DELIVERY</div>
                <p><PhoneCall size={12} /> YOU CAN MAKE THE PAYMENT VIA GPAY / PHONE PAY - 9819616209</p>
              </div>
            </section>
          </div>
          <footer className="wedding-footer">T H A N K  Y O U !<span>♡</span></footer>
        </div>
      </div>
    </div>
  );
}
