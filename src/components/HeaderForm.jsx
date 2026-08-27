import React, { useRef } from 'react';
import { Building2, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

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

export default function HeaderForm({ company, setCompany, visibility, toggleVisibility, quotationMode }) {
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCompany(prev => ({ ...prev, logoType: 'custom', logoUrl: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-card">
      <div className="section-title">
        <div className="section-title-left">
          <Building2 size={20} />
          <span>1. Company Header & Branding</span>
        </div>
      </div>

      {/* Logo Upload Row */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <div className="vis-field-row">
          <label className="form-label">Company Logo (Top Center)</label>
          <VisToggle isOn={visibility.logo} onToggle={() => toggleVisibility('logo')} label="Logo" />
        </div>

        <div 
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            background: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '0.5rem',
            opacity: visibility.logo ? 1 : 0.45,
            transition: 'opacity 0.2s'
          }}
        >
          {company.logoType === 'custom' && company.logoUrl ? (
            <img src={company.logoUrl} alt="Company Logo Preview" style={{ maxHeight: '120px', maxWidth: '320px', objectFit: 'contain' }} />
          ) : company.logoType === 'preset' && company.logoSvg ? (
            <div style={{ maxHeight: '120px', width: '300px' }} dangerouslySetInnerHTML={{ __html: company.logoSvg }} />
          ) : (
            <div style={{ color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <ImageIcon size={32} />
              <span style={{ fontSize: '0.85rem' }}>Upload a logo image</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" style={{ display: 'none' }} />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Upload Logo Image
            </button>
          </div>
        </div>

      </div>

      <div className="form-grid">
        {quotationMode !== 'wedding' && (
          <div className="form-group form-grid-full">
            <div className="vis-field-row">
              <label className="form-label">Company Name *</label>
              <VisToggle isOn={visibility.companyName} onToggle={() => toggleVisibility('companyName')} label="Company name" />
            </div>
            <input 
              type="text" className="form-input" 
              placeholder="e.g. Acme Global Events & Media Ltd." 
              value={company.name} 
              onChange={(e) => handleInputChange('name', e.target.value)} 
              style={{ opacity: visibility.companyName ? 1 : 0.45, transition: 'opacity 0.2s' }}
            />
          </div>
        )}

        {/* Phone */}
        <div className="form-group">
          <div className="vis-field-row">
            <label className="form-label">Contact Number *</label>
            <VisToggle isOn={visibility.companyPhone} onToggle={() => toggleVisibility('companyPhone')} label="Phone" />
          </div>
          <input 
            type="text" className="form-input" 
            placeholder="e.g. +1 (555) 234-5678" 
            value={company.phone} 
            onChange={(e) => handleInputChange('phone', e.target.value)} 
            style={{ opacity: visibility.companyPhone ? 1 : 0.45, transition: 'opacity 0.2s' }}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <div className="vis-field-row">
            <label className="form-label">Email Address *</label>
            <VisToggle isOn={visibility.companyEmail} onToggle={() => toggleVisibility('companyEmail')} label="Email" />
          </div>
          <input 
            type="email" className="form-input" 
            placeholder="e.g. contact@acmeevents.com" 
            value={company.email} 
            onChange={(e) => handleInputChange('email', e.target.value)} 
            style={{ opacity: visibility.companyEmail ? 1 : 0.45, transition: 'opacity 0.2s' }}
          />
        </div>

        {/* Address */}
        <div className="form-group form-grid-full">
          <div className="vis-field-row">
            <label className="form-label">Corporate Address</label>
            <VisToggle isOn={visibility.companyAddress} onToggle={() => toggleVisibility('companyAddress')} label="Address" />
          </div>
          <input 
            type="text" className="form-input" 
            placeholder="e.g. 100 Corporate Boulevard, Suite 500, New York, NY" 
            value={company.address} 
            onChange={(e) => handleInputChange('address', e.target.value)} 
            style={{ opacity: visibility.companyAddress ? 1 : 0.45, transition: 'opacity 0.2s' }}
          />
        </div>
      </div>

      {quotationMode === 'proforma' && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tax & Bank Details</h4>
          <div className="form-grid">
            <div className="form-group form-grid-full">
              <label className="form-label">Company GSTIN</label>
              <input 
                type="text" className="form-input" 
                placeholder="e.g. 27ABCDE1234F1Z5" 
                value={company.gstNo || ''} 
                onChange={(e) => handleInputChange('gstNo', e.target.value)} 
              />
            </div>
            
            <div className="form-group form-grid-full" style={{ marginBottom: '0.5rem' }}>
              <div className="vis-field-row">
                <label className="form-label">Bank Name</label>
                <VisToggle isOn={visibility.bankDetails} onToggle={() => toggleVisibility('bankDetails')} label="Show Bank Details" />
              </div>
              <input 
                type="text" className="form-input" 
                placeholder="e.g. State Bank of India" 
                value={company.bankName || ''} 
                onChange={(e) => handleInputChange('bankName', e.target.value)} 
                style={{ opacity: visibility.bankDetails ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input 
                type="text" className="form-input" 
                placeholder="e.g. 1234567890" 
                value={company.accountNo || ''} 
                onChange={(e) => handleInputChange('accountNo', e.target.value)} 
                style={{ opacity: visibility.bankDetails ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Branch</label>
              <input 
                type="text" className="form-input" 
                placeholder="e.g. Main Branch" 
                value={company.branch || ''} 
                onChange={(e) => handleInputChange('branch', e.target.value)} 
                style={{ opacity: visibility.bankDetails ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input 
                type="text" className="form-input" 
                placeholder="e.g. SBIN0001234" 
                value={company.ifsc || ''} 
                onChange={(e) => handleInputChange('ifsc', e.target.value)} 
                style={{ opacity: visibility.bankDetails ? 1 : 0.45, transition: 'opacity 0.2s' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
