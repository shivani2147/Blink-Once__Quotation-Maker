import html2pdf from 'html2pdf.js';

export const downloadQuotationPDF = async (elementId, filename = 'Corporate_Quotation.pdf', category = 'corporate') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  // Get the exact height of the element to make a single continuous page
  // We add a 20px buffer to ensure no content accidentally spills over into a blank 2nd page
  const width = 794;
  const baseHeight = element.scrollHeight || element.offsetHeight;
  const height = baseHeight + 20;

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
      windowWidth:     width,
    },
    jsPDF: {
      unit:        'px',
      format:      [width, height],
      orientation: 'portrait',
      hotfixes:    ['px_scaling'],
    }
  };

  try {
    // Generate the PDF and get it as a Blob for the backup
    const pdf = await html2pdf().set(opt).from(element).toPdf().get('pdf');
    const pdfBlob = pdf.output('blob');

    // 1. Asynchronously send a backup copy to the Vite backend folder
    fetch('/api/save-pdf', {
      method: 'POST',
      body: pdfBlob,
      headers: {
        'x-category': encodeURIComponent(category),
        'x-filename': encodeURIComponent(filename)
      }
    }).then(res => {
      if (res.ok) console.log('Backup PDF saved successfully to project folder');
      else console.error('Failed to save backup to backend');
    }).catch(err => console.error('Backend save error:', err));

    

    return true;
  } catch (err) {
    console.error('PDF generation error, falling back to window.print()', err);
    window.print();
    return false;
  }
};
