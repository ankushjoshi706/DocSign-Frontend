import SignaturePad from "react-signature-canvas";
import { useRef } from "react";

function SignatureCanvas({ onSave }) {
  const sigRef = useRef(null);

  const clear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
  };

  const save = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("✍️ Please draw your signature first.");
      return;
    }

    const canvas = sigRef.current.getTrimmedCanvas?.();
    if (!canvas) {
      alert("⚠️ Unable to trim canvas. Please retry.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Draw your signature</h3>

      <SignaturePad
        ref={sigRef}
        canvasProps={{
          width: 400,
          height: 150,
          className: "border rounded bg-gray-50",
        }}
      />

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Clear
        </button>
        <button
          onClick={save}
          className="px-4 py-2 bg-red-700 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default SignatureCanvas;
