// Accessing the globally loaded pdfjsLib from the CDN script in index.html
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js library not loaded");
  }

  // Set worker source to CDN to ensure it works without complex build steps
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
};