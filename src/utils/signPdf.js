import { PDFDocument } from 'pdf-lib';

export const embedSignatureOnPDF = async ({
  pdfUrl,
  signatureDataUrl,
  x,
  y,
  page = 0,
  width = 150,
  height = 50
}) => {
  console.log('🔧 embedSignatureOnPDF called with:', JSON.stringify({
    pdfUrl,
    signatureDataUrl: signatureDataUrl.substring(0, 50) + '...',
    x,
    y,
    page,
    width,
    height
  }, null, 2));

  try {
    // Fetch the PDF
    console.log('📥 Fetching PDF...');
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    const pdfArrayBuffer = await response.arrayBuffer();

    // Load the PDF document
    console.log('📄 Loading PDF document...');
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    // Load the signature image
    console.log('🖼️ Embedding signature image...');
    const signatureImage = await pdfDoc.embedPng(signatureDataUrl);

    console.log('📐 Signature dimensions:', {
      width,
      height
    });

    // Get the page
    const pages = pdfDoc.getPages();
    const targetPage = pages[page];
    const { width: pageWidth, height: pageHeight } = targetPage.getSize();

    console.log('📏 Page dimensions:', {
      width: pageWidth,
      height: pageHeight
    });

    // Use coordinates as-is since they're already transformed in React
    const finalX = Math.max(0, Math.min(x, pageWidth - width));
    const finalY = Math.max(0, Math.min(y, pageHeight - height));

    console.log('🎯 Final position:', {
      originalX: x,
      originalY: y,
      clampedX: finalX,
      clampedY: finalY,
      pageWidth,
      pageHeight
    });

    // Draw the signature on the PDF
    console.log('🖊️ Drawing signature on PDF...');
    targetPage.drawImage(signatureImage, {
      x: finalX,
      y: finalY,
      width,
      height,
    });

    // Save the PDF
    console.log('💾 Saving PDF...');
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    console.log('✅ PDF processing complete');
    return blobUrl;

  } catch (error) {
    console.error('❌ Error in embedSignatureOnPDF:', error);
    throw error;
  }
};