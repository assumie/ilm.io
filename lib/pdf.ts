/*
 * pdf.ts — PDF text extraction on the server.
 *
 * Uses pdf-parse for text extraction. Falls back to treating
 * the input as plain text if it's not a PDF.
 */

interface PDFParseResult {
  text: string;
  numpages?: number;
}

let pdfParse: ((buffer: Buffer) => Promise<PDFParseResult>) | null = null;

async function loadPdfParse(): Promise<typeof pdfParse> {
  if (pdfParse) return pdfParse;
  try {
    const mod = await import('pdf-parse');
    pdfParse = mod.default as typeof pdfParse;
    return pdfParse;
  } catch {
    return null;
  }
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Check if it's a PDF by magic bytes
  const isPDF = buffer.slice(0, 5).toString('ascii') === '%PDF-';

  if (!isPDF) {
    // Treat as plain text
    return buffer.toString('utf-8');
  }

  const parser = await loadPdfParse();
  if (!parser) {
    throw new Error(
      'PDF parsing library not available. Please install pdf-parse.'
    );
  }

  const result = await parser(buffer);
  return result.text || '';
}
