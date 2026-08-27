import html2pdf from 'html2pdf.js';

export const downloadQuotationPDF = async (elementId, filename = 'Corporate_Quotation.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  // A4 at 96 DPI = 794px wide. We render the element at that exact width
  // and map it to the A4 PDF page with zero margins so nothing gets clipped.
  const opt = {
    margin:   0,
    filename: filename,
    image:    { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale:           2,
      useCORS:         true,
      letterRendering: true,
      scrollX:         0,
      scrollY:         -window.scrollY,
      windowWidth:     794,   // match the .quotation-paper CSS width exactly
    },
    jsPDF: {
      unit:        'px',
      format:      [794, 1123],  // exact A4 px dimensions at 96dpi
      orientation: 'portrait',
      hotfixes:    ['px_scaling'],
    },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.error('PDF generation error, falling back to window.print()', err);
    window.print();
    return false;
  }
};
