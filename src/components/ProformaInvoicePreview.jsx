import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';

export default function ProformaInvoicePreview({ company, details, services, currency, visibility }) {
  // Calculate totals
  const subTotal = services.reduce((acc, curr) =>
    acc + (parseFloat(curr.amount) || 0), 0);

  const cgstAmount = details.globalTaxType === 'cgst_sgst' ? subTotal * 0.09 : 0;
  const sgstAmount = details.globalTaxType === 'cgst_sgst' ? subTotal * 0.09 : 0;
  const igstAmount = details.globalTaxType === 'igst' ? subTotal * 0.18 : 0;
  const taxAmountGst = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = subTotal + taxAmountGst;

  const fmt = (n) => n > 0 ? `${currency}${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';

  // Pad services to at least 10 rows for empty-line appearance
  const minRows = 8;
  const paddedServices = [
    ...services,
    ...Array(Math.max(0, minRows - services.length)).fill(null),
  ];

  return (
    <div id="quotation-document" className="pi-doc">

      {/* ── HEADER ── */}
      <div className="pi-header">
        <div className="pi-header-left">
          {visibility.logo && company.logoUrl && (
            <img src={company.logoUrl} alt="Logo" className="pi-logo" />
          )}
          <div className="pi-company-block">
            {company.gstNo && (
              <div className="pi-gst-label">GST No. {company.gstNo}</div>
            )}
            {visibility.companyName && (
              <div className="pi-company-name">{company.name}</div>
            )}
            {(visibility.companyPhone || visibility.companyEmail) && (
              <div className="pi-company-contact">
                {visibility.companyPhone && company.phone && (
                  <span><Phone size={11} /> {company.phone}</span>
                )}
                {visibility.companyPhone && visibility.companyEmail && company.phone && company.email && <span>•</span>}
                {visibility.companyEmail && company.email && (
                  <span><Mail size={11} /> {company.email}</span>
                )}
              </div>
            )}
            <div className="pi-company-addr">
              {visibility.companyAddress && company.address}
            </div>
          </div>
        </div>
        <div className="pi-header-right">
          <div className="pi-invoice-title">{details.quoteTitle || 'PROFORMA INVOICE'}</div>
          <div className="pi-invoice-no">Invoice No.: <strong>{details.quoteId}</strong></div>
        </div>
      </div>

      {/* ── BILLED TO ── */}
      <div className="pi-billed-bar" />

      {/* ── CLIENT SECTION ── */}
      <div className="pi-client-section">
        <div className="pi-client-label-row">
          <strong>BILLED TO</strong>
          <strong>DATE</strong>
        </div>

        {/* Date Row */}
        {visibility.invoiceDate !== false && (
          <div className="pi-client-date-row">
            <span className="pi-field-value">{details.date}</span>
          </div>
        )}
        
        {/* Client Info Columns */}
        <div className="pi-client-info-columns">
          {/* Left: Client Info */}
          <div className="pi-client-left">
            {visibility.clientName !== false && <div className="pi-field-row">
              <span className="pi-field-label">NAME</span>
              <span className="pi-field-value">{details.clientName}</span>
            </div>}
            {visibility.contact !== false && <div className="pi-field-row">
              <span className="pi-field-label">PHONE</span>
              <span className="pi-field-value">{details.contact}</span>
            </div>}
            {visibility.clientEmail !== false && <div className="pi-field-row">
              <span className="pi-field-label">MAIL</span>
              <span className="pi-field-value">{details.eventName}</span>
            </div>}
          </div>

          {/* Right: Client Info (Address) */}
          <div className="pi-client-right">
            {visibility.clientAddress !== false && <div className="pi-field-row">
              <span className="pi-field-label">ADDRESS</span>
              <span className="pi-field-value">{details.venue}</span>
            </div>}
            {visibility.clientState !== false && <div className="pi-field-row">
              <span className="pi-field-label">STATE</span>
              <span className="pi-field-value">{details.clientState}</span>
            </div>}
            {visibility.clientZipCode !== false && <div className="pi-field-row">
              <span className="pi-field-label">ZIP CODE</span>
              <span className="pi-field-value">{details.clientZipCode}</span>
            </div>}
            {visibility.clientGstNo !== false && <div className="pi-field-row">
              <span className="pi-field-label">GST NO.</span>
              <span className="pi-field-value">{details.clientGstNo}</span>
            </div>}
          </div>
        </div>
      </div>

      {/* ── SERVICES TABLE ── */}
      <table className="pi-table">
        <thead>
          <tr>
            <th className="pi-th pi-col-product" style={{ width: visibility.priceCol ? '50%' : '70%' }}>SERVICE NAME / DESCRIPTION</th>
            <th className="pi-th pi-col-qty" style={{ width: '10%' }}>QTY</th>
            {visibility.priceCol && <th className="pi-th pi-col-price" style={{ width: '20%' }}>PRICE ({currency})</th>}
            <th className="pi-th pi-col-total" style={{ width: '20%' }}>TOTAL ({currency})</th>
          </tr>
        </thead>
        <tbody>
          {paddedServices.map((service, index) => {
            if (!service) {
              return (
                <tr key={`empty-${index}`} className="pi-tr">
                  <td className="pi-td pi-col-product"></td>
                  <td className="pi-td pi-col-qty"></td>
                  {visibility.priceCol && <td className="pi-td pi-col-price"></td>}
                  <td className="pi-td pi-col-total"></td>
                </tr>
              );
            }
            const rate = parseFloat(service.rate) || 0;
            const itemTotal = parseFloat(service.amount) || 0;
            return (
              <tr key={service.id || index} className="pi-tr">
                <td className="pi-td pi-col-product">
                  {service.name && <div style={{ fontWeight: 'bold' }}>{service.name}</div>}
                  {service.description && <div>{service.description}</div>}
                </td>
                <td className="pi-td pi-col-qty">{service.quantity || ''}</td>
                {visibility.priceCol && <td className="pi-td pi-col-price">{rate ? `${currency}${rate.toLocaleString('en-IN')}` : ''}</td>}
                <td className="pi-td pi-col-total">{itemTotal ? `${currency}${itemTotal.toLocaleString('en-IN')}` : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── BOTTOM SECTION ── */}
      <div className="pi-bottom">
        {/* Left: Words + Bank */}
        <div className="pi-bottom-left">
          <div className="pi-words-box">
            <div className="pi-words-label">Total amount in Words</div>
            <div className="pi-words-value">{numberToWords(Math.round(grandTotal))}</div>
          </div>
          {visibility.bankDetails && (
            <div className="pi-bank-box">
              <div className="pi-bank-title">Bank Details</div>
              <div className="pi-bank-row"><strong>Bank Name :</strong> {company.bankName}</div>
              <div className="pi-bank-row"><strong>A/c :</strong> {company.accountNo}</div>
              <div className="pi-bank-row"><strong>Branch :</strong> {company.branch}</div>
              <div className="pi-bank-row"><strong>IFSC :</strong> {company.ifsc}</div>
            </div>
          )}
        </div>

        {/* Right: Totals */}
        <div className="pi-totals-box">
          <div className="pi-total-row pi-total-header">
            <span>TOTAL AMOUNT</span>
            <span>{fmt(subTotal)}</span>
          </div>
          {details.globalTaxType === 'cgst_sgst' && (
            <>
              <div className="pi-total-row">
                <span>CGST (9%)</span>
                <span>{fmt(cgstAmount)}</span>
              </div>
              <div className="pi-total-row">
                <span>SGST (9%)</span>
                <span>{fmt(sgstAmount)}</span>
              </div>
            </>
          )}
          {details.globalTaxType === 'igst' && (
            <div className="pi-total-row">
              <span>IGST (18%)</span>
              <span>{fmt(igstAmount)}</span>
            </div>
          )}
          {details.globalTaxType === 'none' && (
            <>
              <div className="pi-total-row">
                <span>CGST</span>
                <span>-</span>
              </div>
              <div className="pi-total-row">
                <span>SGST</span>
                <span>-</span>
              </div>
              <div className="pi-total-row">
                <span>IGST</span>
                <span>-</span>
              </div>
            </>
          )}
          <div className="pi-total-row">
            <span>TAX AMOUNT GST</span>
            <span>{fmt(taxAmountGst)}</span>
          </div>
          <div className="pi-total-row pi-grand-total-row">
            <span>GRAND TOTAL</span>
            <span>{`${currency}${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="pi-footer">
        This is a computer generated digital bill, hence no signature is required.
      </div>
    </div>
  );
}
