import { useState, useRef, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import {
  PencilIcon,
  UploadIcon,
  TypeIcon,
  RefreshCwIcon,
  DownloadIcon,
  CopyIcon,
} from "lucide-react"; // Optional icons if using Lucide or similar

const fonts = [
  { label: "Dancing Script", class: "font-signature" },
  { label: "Pacifico", class: "font-pacifico" },
  { label: "Satisfy", class: "font-satisfy" },
];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "Blue", hex: "#1D4ED8" },
  { name: "Red", hex: "#DC2626" },
  { name: "Green", hex: "#16A34A" },
];

export default function SignaturePanel({ onSave }) {
  const [mode, setMode] = useState("draw");
  const [typedName, setTypedName] = useState("Ankush Sharma");
  const [selectedFont, setSelectedFont] = useState(fonts[0].class);
  const [selectedColor, setSelectedColor] = useState(colors[0].hex);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const sigRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(360);

  useEffect(() => {
    if (canvasWrapperRef.current) {
      setCanvasWidth(canvasWrapperRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (canvasWrapperRef.current) {
        setCanvasWidth(canvasWrapperRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetAll = () => {
    setTypedName("Ankush Sharma");
    setSelectedFont(fonts[0].class);
    setSelectedColor(colors[0].hex);
    setSignaturePreview(null);
    sigRef.current?.clear();
  };

  const saveDrawn = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("Please draw your signature first.");
      return;
    }
    const canvas = sigRef.current.getCanvas();
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setSignaturePreview(dataURL);
    onSave?.(dataURL);
  };

  const saveTyped = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
    ctx.font = `36px ${fonts.find((f) => f.class === selectedFont).label}, cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
    const dataURL = canvas.toDataURL("image/png");
    setSignaturePreview(dataURL);
    onSave?.(dataURL);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSignaturePreview(reader.result);
      onSave?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    if (!signaturePreview) return;
    const link = document.createElement("a");
    link.href = signaturePreview;
    link.download = "signature.png";
    link.click();
  };

  const copyToClipboard = () => {
    if (!signaturePreview) return;
    navigator.clipboard.writeText(signaturePreview);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow bg-white text-gray-800 space-y-6">
      <h2 className="text-xl font-semibold text-center">Signature Creator</h2>

      {/* Mode Tabs */}
      <div className="flex justify-center gap-2">
        {[
          { mode: "draw", icon: <PencilIcon size={16} /> },
          { mode: "type", icon: <TypeIcon size={16} /> },
          { mode: "upload", icon: <UploadIcon size={16} /> },
        ].map(({ mode: m, icon }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm capitalize transition ${
              mode === m
                ? "bg-red-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label={`Select ${m} mode`}
          >
            {icon} {m}
          </button>
        ))}
      </div>

      {/* DRAW MODE */}
      {mode === "draw" && (
        <div className="space-y-4 animate-fadeIn">
          <div ref={canvasWrapperRef} className="border rounded bg-gray-50 p-2">
            <SignaturePad
              ref={sigRef}
              canvasProps={{
                width: canvasWidth - 32,
                height: 100,
                className: "bg-white rounded",
              }}
              penColor={selectedColor}
            />
          </div>

          {/* Color options */}
          <div className="flex justify-center gap-3">
            {colors.map((c) => (
              <button
                key={c.hex}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === c.hex ? "ring-2 ring-red-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
                onClick={() => setSelectedColor(c.hex)}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => sigRef.current.clear()}
              className="flex-1 bg-gray-200 py-1.5 rounded hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              onClick={saveDrawn}
              className="flex-1 bg-red-600 text-white py-1.5 rounded hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* TYPE MODE */}
      {mode === "type" && (
        <div className="space-y-4 animate-fadeIn">
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />

          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {fonts.map((f) => (
              <option key={f.class} value={f.class}>
                {f.label}
              </option>
            ))}
          </select>

          <div className="flex justify-center gap-3">
            {colors.map((c) => (
              <button
                key={c.hex}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === c.hex ? "ring-2 ring-red-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
                onClick={() => setSelectedColor(c.hex)}
              />
            ))}
          </div>

          <div
            className={`text-3xl ${selectedFont} text-center border py-2 rounded bg-gray-50`}
            style={{ color: selectedColor }}
          >
            {typedName}
          </div>

          <button
            onClick={saveTyped}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Save
          </button>
        </div>
      )}

      {/* UPLOAD MODE */}
      {mode === "upload" && (
        <div className="space-y-2 animate-fadeIn">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleUpload}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      )}

      {/* Preview Section */}
      <div className="pt-4 border-t text-center space-y-2">
        <p className="text-sm text-gray-500 font-medium">Signature Preview:</p>

        {signaturePreview ? (
          <img
            src={signaturePreview}
            alt="Signature preview"
            className="max-h-28 mx-auto rounded border shadow"
          />
        ) : (
          <div className="h-28 border-2 border-dashed rounded flex items-center justify-center text-gray-400">
            No signature yet
          </div>
        )}

        {signaturePreview && (
          <div className="flex justify-center gap-2">
            <button
              onClick={download}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              <DownloadIcon size={14} /> Download
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <CopyIcon size={14} /> Copy
            </button>
          </div>
        )}
      </div>

      <button
        onClick={resetAll}
        className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 hover:underline"
      >
        <RefreshCwIcon size={14} /> Reset All
      </button>
    </div>
  );
}
