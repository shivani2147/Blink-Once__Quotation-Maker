import React from 'react';
import { Layers, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

function VisToggle({ isOn, onToggle, label }) {
  return (
    <button
      type="button"
      className={`vis-toggle-btn ${isOn ? 'visible' : 'hidden'}`}
      onClick={onToggle}
      title={isOn ? `Hide "${label}" on document` : `Show "${label}" on document`}
    >
      {isOn ? <Eye size={13} /> : <EyeOff size={13} />}
      {isOn ? 'Tax Visible' : 'Tax Hidden'}
    </button>
  );
}

export default function ServicesForm({ details, setDetails, services, setServices, currency, setCurrency, visibility, toggleVisibility, servicesMode, setServicesMode, paidAmount, setPaidAmount, quotationMode }) {
  const isWedding = quotationMode === 'wedding';
  const effectiveServicesMode = quotationMode === 'proforma' ? 'detailed' : servicesMode;
  const addServiceRow = () => {
    setServices(prev => [
      ...prev,
      { id: Date.now(), name: '', description: isWedding ? 'Photo, Video, Candid & Cinimatic' : '', quantity: 1, rate: 0, tax: 0, discount: 0, date: '', timing: '', team: isWedding ? '6 Professionals' : '', amount: 0 }
    ]);
  };

  const removeServiceRow = (id) => {
    if (services.length <= 1) return;
    setServices(prev => prev.filter(item => item.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setServices(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        [field]: ['quantity', 'rate', 'tax', 'discount', 'amount'].includes(field)
          ? (field === 'quantity' ? value : (value === '' ? '' : (parseFloat(value) || 0)))
          : value
      };
    }));
  };

  const calculateItemAmount = (item) => {
    const base = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
    const afterDisc = base - base * ((Number(item.discount) || 0) / 100);
    return afterDisc + afterDisc * ((Number(item.tax) || 0) / 100);
  };

  const handleSimpleAmountChange = (id, value) => {
    setServices(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        rate: value === '' ? '' : (parseFloat(value) || 0),
        quantity: 1,
        tax: 0
      };
    }));
  };

  return (
    <div className="glass-card">
      <div className="section-title">
        <div className="section-title-left">
          <Layers size={20} />
          <span>{isWedding ? '3. Events & Services' : '3. Services & Deliverables'}</span>
        </div>

        {!isWedding && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Mode Toggle */}
          {quotationMode !== 'proforma' && (
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button 
                type="button" 
                onClick={() => setServicesMode('detailed')}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, background: effectiveServicesMode === 'detailed' ? 'var(--primary)' : 'transparent', color: effectiveServicesMode === 'detailed' ? '#fff' : 'var(--text-muted)' }}
              >
                Detailed
              </button>
              <button 
                type="button" 
                onClick={() => setServicesMode('simple')}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, background: effectiveServicesMode === 'simple' ? 'var(--primary)' : 'transparent', color: effectiveServicesMode === 'simple' ? '#fff' : 'var(--text-muted)' }}
              >
                Simple
              </button>
            </div>
          )}

          {/* Tax Row Toggle */}
          {effectiveServicesMode === 'detailed' && quotationMode !== 'proforma' && (
            <VisToggle isOn={visibility.taxRow} onToggle={() => toggleVisibility('taxRow')} label="Tax Row" />
          )}
          {quotationMode === 'proforma' && (
            <VisToggle isOn={visibility.priceCol} onToggle={() => toggleVisibility('priceCol')} label="Price Col" />
          )}

          {/* Currency Selector */}
          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₹">INR (₹)</option>
            <option value="AED">AED</option>
            <option value="C$">CAD (C$)</option>
            <option value="A$">AUD (A$)</option>
          </select>
        </div>}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="items-table">
          <thead>
            <tr>
              {isWedding ? (
                <>
                  <th style={{ opacity: visibility.colDate !== false ? 1 : 0.5, width: '12%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                      Date
                      <button type="button" onClick={() => toggleVisibility('colDate')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }} title={visibility.colDate !== false ? 'Hide column' : 'Show column'}>
                        {visibility.colDate !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </th>
                  <th style={{ opacity: visibility.colEvent !== false ? 1 : 0.5, width: '27%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                      Event
                      <button type="button" onClick={() => toggleVisibility('colEvent')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }} title={visibility.colEvent !== false ? 'Hide column' : 'Show column'}>
                        {visibility.colEvent !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </th>
                  <th style={{ opacity: visibility.colTiming !== false ? 1 : 0.5, width: '15%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                      Timing
                      <button type="button" onClick={() => toggleVisibility('colTiming')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }} title={visibility.colTiming !== false ? 'Hide column' : 'Show column'}>
                        {visibility.colTiming !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </th>
                  <th style={{ opacity: visibility.colServices !== false ? 1 : 0.5, width: '27%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                      Services
                      <button type="button" onClick={() => toggleVisibility('colServices')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }} title={visibility.colServices !== false ? 'Hide column' : 'Show column'}>
                        {visibility.colServices !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </th>
                  <th style={{ opacity: visibility.colTeam !== false ? 1 : 0.5, width: '12%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                      Team
                      <button type="button" onClick={() => toggleVisibility('colTeam')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }} title={visibility.colTeam !== false ? 'Hide column' : 'Show column'}>
                        {visibility.colTeam !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </th>
                </>
              ) : <th style={{ width: effectiveServicesMode === 'simple' ? '70%' : '30%' }}>Service Name / Description</th>}
              {!isWedding && <>
                {effectiveServicesMode === 'detailed' && <th style={{ width: '12%' }}>Qty / Hrs</th>}
                {effectiveServicesMode === 'detailed' && (quotationMode !== 'proforma' || visibility.priceCol) && <th style={{ width: '18%' }}>{quotationMode === 'proforma' ? 'Price' : 'Rate'} ({currency})</th>}
                {effectiveServicesMode === 'detailed' && visibility.taxRow && quotationMode !== 'proforma' && <th style={{ width: '12%' }}>Tax (%)</th>}
                <th style={{ width: effectiveServicesMode === 'simple' ? '23%' : '18%', textAlign: 'right' }}>{quotationMode === 'proforma' ? 'Total' : 'Amount'} ({currency})</th>
              </>}
              <th style={{ width: '7%', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
              {services.map((item) => {
              const rowAmount = calculateItemAmount(item);
              return (
                <tr key={item.id}>
                  {isWedding ? (
                    <>
                      <td style={{ opacity: visibility.colDate !== false ? 1 : 0.3 }}><input type="text" className="form-input" placeholder="Date" value={item.date || ''} onChange={(e) => handleRowChange(item.id, 'date', e.target.value)} /></td>
                      <td style={{ opacity: visibility.colEvent !== false ? 1 : 0.3 }}><input type="text" className="form-input" placeholder="Event" value={item.name} onChange={(e) => handleRowChange(item.id, 'name', e.target.value)} /></td>
                      <td style={{ opacity: visibility.colTiming !== false ? 1 : 0.3 }}><input type="text" className="form-input" placeholder="Timing" value={item.timing || ''} onChange={(e) => handleRowChange(item.id, 'timing', e.target.value)} /></td>
                      <td style={{ opacity: visibility.colServices !== false ? 1 : 0.3 }}>
                        <input type="text" className="form-input" placeholder="Services" value={item.description} onChange={(e) => handleRowChange(item.id, 'description', e.target.value)} />
                      </td>
                      <td style={{ opacity: visibility.colTeam !== false ? 1 : 0.3 }}><input type="text" className="form-input" placeholder="Team" value={item.team || ''} onChange={(e) => handleRowChange(item.id, 'team', e.target.value)} /></td>
                    </>
                  ) : (
                  <>
                  <td>
                    <input 
                      type="text" className="form-input" 
                      placeholder="e.g. Stage Lighting & AV Setup" 
                      value={item.name} 
                      onChange={(e) => handleRowChange(item.id, 'name', e.target.value)} 
                      style={{ marginBottom: '0.35rem' }}
                    />
                    <input 
                      type="text" className="form-input" 
                      placeholder="Line item details or specs..." 
                      value={item.description} 
                      onChange={(e) => handleRowChange(item.id, 'description', e.target.value)} 
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                    />
                  </td>
                  {effectiveServicesMode === 'detailed' ? (
                    <>
                      <td>
                        <input type="text" className="form-input" value={item.quantity ?? ''} 
                          onChange={(e) => handleRowChange(item.id, 'quantity', e.target.value)} />
                      </td>
                      {(quotationMode !== 'proforma' || visibility.priceCol) && (
                        <td>
                          <input type="number" min="0" step={quotationMode === 'proforma' ? "1" : "0.01"} className="form-input" value={Number(item.rate) > 0 ? (quotationMode === 'proforma' ? item.rate : Number(item.rate).toFixed(2)) : ''} 
                            onChange={(e) => handleRowChange(item.id, 'rate', e.target.value)} />
                        </td>
                      )}
                      {visibility.taxRow && quotationMode !== 'proforma' && (
                        <td>
                          <input type="number" min="0" max="100" step="0.5" className="form-input" placeholder="0" value={item.tax} 
                            onChange={(e) => handleRowChange(item.id, 'tax', e.target.value)} />
                        </td>
                      )}
                      <td style={{ textAlign: 'right', fontWeight: '700', verticalAlign: 'middle', paddingRight: '0.5rem' }}>
                        {quotationMode === 'proforma' ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                            <span>{currency}</span>
                            <input 
                              type="number" min="0" step="1" className="form-input" 
                              style={{ textAlign: 'right', fontWeight: '600', padding: '0.2rem', width: '80px' }} 
                              value={item.amount || ''} 
                              onChange={(e) => handleRowChange(item.id, 'amount', e.target.value)} 
                            />
                          </div>
                        ) : (
                          <>{currency}{rowAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                        )}
                      </td>
                    </>
                  ) : (
                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                      <input 
                        type="number" min="0" step="0.01" className="form-input" 
                        style={{ textAlign: 'right', fontWeight: '600' }} 
                        value={Number(item.rate) > 0 ? Number(item.rate).toFixed(2) : ''} 
                        onChange={(e) => handleSimpleAmountChange(item.id, e.target.value)} 
                        placeholder=""
                      />
                    </td>
                  )}
                  </>
                  )}
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <button 
                      type="button" 
                      className="btn-danger" 
                      style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}
                      onClick={() => removeServiceRow(item.id)}
                      disabled={services.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" className="btn btn-outline btn-sm" onClick={addServiceRow}>
          <Plus size={14} /> {isWedding ? 'Add' : 'Add Service Item'}
        </button>
      </div>

      {quotationMode === 'proforma' && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div className="section-title">
            <div className="section-title-left">
              <span>Tax Details (Global)</span>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="globalTaxType"
                    value="none"
                    checked={details.globalTaxType === 'none'}
                    onChange={(e) => setDetails(prev => ({ ...prev, globalTaxType: e.target.value }))}
                  />
                  None
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="globalTaxType"
                    value="cgst_sgst"
                    checked={details.globalTaxType === 'cgst_sgst'}
                    onChange={(e) => setDetails(prev => ({ ...prev, globalTaxType: e.target.value }))}
                  />
                  CGST (9%) & SGST (9%)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="globalTaxType"
                    value="igst"
                    checked={details.globalTaxType === 'igst'}
                    onChange={(e) => setDetails(prev => ({ ...prev, globalTaxType: e.target.value }))}
                  />
                  IGST (18%)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isWedding && quotationMode !== 'proforma' && (
        <div className="payment-input-row">
          <label className="form-label" htmlFor="paid-amount">Paid Amount ({currency})</label>
          <div className="payment-input-wrap">
            <span>{currency}</span>
            <input
              id="paid-amount"
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
      )}
    </div>
  );
}
