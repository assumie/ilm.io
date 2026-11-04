// Minimal types so the optional pdf-parse import in lib/pdf.ts type-checks
// before the package is installed (Phase 3 adds the real dependency).
declare module 'pdf-parse' {
  const pdfParse: (buffer: Buffer) => Promise<{ text: string; numpages?: number }>;
  export default pdfParse;
}
