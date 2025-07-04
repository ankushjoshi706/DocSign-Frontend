import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import PDFViewer from "../components/PDFViewer";
import SignaturePanel from "../components/SignaturePanel";
import { embedSignatureOnPDF } from "../utils/signPdf";
import Draggable from "react-draggable";

function PublicSignPage() {
  const { docId } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [field, setField] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pdfContainerRef = useRef(null);
  const dragNodeRef = useRef(null);

  const SIGNATURE_WIDTH_PT = 150;
  const SIGNATURE_HEIGHT_PT = 50;

  // Load document
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/docs/${docId}`);
        setDoc(res.data);
      } catch {
        toast.error("Failed to load document.");
      } finally {
        setLoading(false);
      }
    };
    if (docId) fetchDoc();
    else {
      toast.error("No document ID provided.");
      setLoading(false);
    }
  }, [docId]);

  // Save signature image and attempt to position
  const handleSignatureSave = useCallback((url) => {
    setSignatureUrl(url);
    if (canvasDimensions && pdfDimensions) {
      createSignatureField(url);
    }
  }, [canvasDimensions, pdfDimensions]);

  // Create signature field
  const createSignatureField = useCallback((url) => {
    const initialX = Math.max(0, (canvasDimensions.width - 150) / 2);
    const initialY = Math.max(0, (canvasDimensions.height - 50) / 2);
    setField({
      id: Date.now(),
      x: initialX,
      y: initialY,
      src: url,
    });
    toast.success("Signature positioned! Drag to adjust placement.");
  }, [canvasDimensions]);

  // Detect PDF canvas size
  const handlePdfSize = useCallback((dimensions) => {
    setPdfDimensions(dimensions);

    let attempts = 0;
    const maxAttempts = 10;

    const detectCanvas = () => {
      const canvas = document.querySelector(".react-pdf__Page__canvas") || document.querySelector(".react-pdf__Page");
      const container = pdfContainerRef.current;

      let dims = null;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        dims = { width: rect.width, height: rect.height };
      } else if (container) {
        const rect = container.getBoundingClientRect();
        dims = { width: rect.width - 20, height: rect.height - 20 };
      }

      if (dims?.width > 0) {
        setCanvasDimensions(dims);
        if (signatureUrl && !field) {
          createSignatureField(signatureUrl);
        }
      } else if (++attempts < maxAttempts) {
        setTimeout(detectCanvas, 300);
      } else {
        setCanvasDimensions({ width: 600, height: 800 });
        if (signatureUrl && !field) {
          createSignatureField(signatureUrl);
        }
      }
    };

    setTimeout(detectCanvas, 200);
  }, [signatureUrl, field, createSignatureField]);

  // Retry placing signature after canvas is available
  useEffect(() => {
    if (signatureUrl && canvasDimensions && !field) {
      createSignatureField(signatureUrl);
    }
  }, [signatureUrl, canvasDimensions, field, createSignatureField]);

  // Convert canvas coords to PDF coords
  const getScaleFactors = () => {
    if (!pdfDimensions || !canvasDimensions) return { scaleX: 1, scaleY: 1 };
    return {
      scaleX: pdfDimensions.width / canvasDimensions.width,
      scaleY: pdfDimensions.height / canvasDimensions.height,
    };
  };

  const canvasToPdfCoords = (canvasX, canvasY) => {
    const { scaleX, scaleY } = getScaleFactors();
    const x = canvasX * scaleX;
    const y = (canvasDimensions.height - canvasY - 50) * scaleY;
    return {
      x: Math.min(x, pdfDimensions.width - SIGNATURE_WIDTH_PT),
      y: Math.min(Math.max(0, y), pdfDimensions.height - SIGNATURE_HEIGHT_PT),
    };
  };

  // Final signing
  const handleFinish = async () => {
    if (!signatureUrl || !doc?.fileName || !field || !pdfDimensions || !canvasDimensions) {
      toast.error("Missing required data.");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfUrl = `http://localhost:5000/uploads/${encodeURIComponent(doc.fileName)}`;
      const { x, y } = canvasToPdfCoords(field.x, field.y);

      const blobUrl = await embedSignatureOnPDF({
        pdfUrl,
        signatureDataUrl: signatureUrl,
        x,
        y,
        page: 0,
        width: SIGNATURE_WIDTH_PT,
        height: SIGNATURE_HEIGHT_PT,
      });

      const blob = await (await fetch(blobUrl)).blob();
      const formData = new FormData();
      formData.append("signedPdf", blob, `signed-${doc.fileName}`);
      formData.append("originalFileName", doc.fileName);
      formData.append("docId", docId);

      const saveRes = await axios.post("/signed-docs/save-signed-document", formData);
      if (!saveRes.data.success) throw new Error("Failed to save to server.");

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `signed-${doc.fileName}`;
      a.click();

      a.addEventListener("click", () => {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      });

      toast.success("Signed PDF saved and downloaded.");
    } catch (err) {
      toast.error("Signing failed. " + (err.message || ""));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.style.userSelect = "none";
  };

  const handleDragStop = (e, data) => {
    setIsDragging(false);
    document.body.style.userSelect = "";
    setField((prev) => ({ ...prev, x: data.x, y: data.y }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!doc) return <div className="h-screen flex items-center justify-center text-red-500">Document not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">✍️ Sign Document</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start max-w-7xl mx-auto">
        {/* PDF Viewer */}
        <div ref={pdfContainerRef} className="flex-1 max-w-3xl relative bg-white border rounded-lg shadow-md">
          <PDFViewer fileName={doc.fileName} onSize={handlePdfSize} />

          {field && canvasDimensions && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
              <Draggable
                nodeRef={dragNodeRef}
                position={{ x: field.x, y: field.y }}
                bounds={{
                  left: 0,
                  top: 0,
                  right: canvasDimensions.width - 150,
                  bottom: canvasDimensions.height - 50,
                }}
                onStart={handleDragStart}
                onStop={handleDragStop}
                disabled={isProcessing}
              >
                <div
                  ref={dragNodeRef}
                  style={{
                    width: 150,
                    height: 50,
                    position: "absolute",
                    cursor: isDragging ? "grabbing" : "grab",
                    pointerEvents: isProcessing ? "none" : "auto",
                    backgroundColor: "rgba(79, 70, 229, 0.1)",
                    border: "2px dashed #4F46E5",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "transform 0.1s ease, box-shadow 0.3s ease"
                  }}
                >
                  <img
                    src={field.src}
                    alt="Signature"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none"
                    }}
                    draggable={false}
                  />
                </div>
              </Draggable>
            </div>
          )}
        </div>

        {/* Signature Panel + Finish Button */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-lg">
          <SignaturePanel onSave={handleSignatureSave} />
          <div className="mt-6">
            {field && (
              <button
                onClick={handleFinish}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {isProcessing ? "Signing..." : "✅ Finish & Download"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicSignPage;
