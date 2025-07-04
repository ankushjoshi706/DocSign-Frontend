
import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "react-hot-toast";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PDFViewer({ fileName, onSize }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [hasSentSize, setHasSentSize] = useState(false);

  const viewerRef = useRef(null);

  useEffect(() => {
    if (fileName) {
      const url = `http://localhost:5000/uploads/${encodeURIComponent(fileName)}`;
      console.log("📄 Loading PDF from:", url);
      setPdfUrl(url);
    }
  }, [fileName]);

  const handleLoadSuccess = async (pdf) => {
    console.log("📚 PDF loaded successfully:", pdf);
    setNumPages(pdf.numPages);

    try {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      console.log("📏 PDF page dimensions (pts):", {
        width: viewport.width,
        height: viewport.height
      });

      if (onSize && !hasSentSize) {
        onSize({ width: viewport.width, height: viewport.height });
        setHasSentSize(true);
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch page dimensions:", err);
    }
  };

  const handlePageRenderSuccess = ({ width, height, pageNumber }) => {
    if (pageNumber !== 1 || hasSentSize) return;

    const canvas = viewerRef.current?.querySelector(".react-pdf__Page__canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      console.log("🖼️ Canvas dimensions (px):", rect);
    }
  };

  return (
    <div
      ref={viewerRef}
      className="overflow-x-auto border rounded bg-white"
      style={{ width: "fit-content", maxWidth: "100%" }}
    >
      {error ? (
        <div className="text-center text-red-600 p-6">
          ⚠️ Failed to load PDF: {error.message}
        </div>
      ) : (
        pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={(err) => {
              console.error("❌ PDF load error:", err);
              setError(err);
              toast.error("Unable to load PDF.");
            }}
          >
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={600} // Fixed render width in px
                onRenderSuccess={handlePageRenderSuccess}
              />
            ))}
          </Document>
        )
      )}
    </div>
  );
}

export default PDFViewer;