import { useState } from "react";
import PDFUploader from "../components/PDFUploader";
import PDFViewer from "../components/PDFViewer";
import SignatureCanvas from "../components/SignatureCanvas";
import DraggableSignature from "../components/DraggableSignature";

function Home() {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [coords, setCoords] = useState(null);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Sign PDF</h1>
      {!file && <PDFUploader onFileSelect={setFile} />}

      {file && (
        <div className="relative">
          <PDFViewer file={file} />
          {signature && (
            <DraggableSignature signatureURL={signature} onStop={(pos) => setCoords(pos)} />
          )}
        </div>
      )}

      {file && !signature && (
        <div className="mt-6">
          <SignatureCanvas onSave={setSignature} />
        </div>
      )}
    </div>
  );
}

export default Home;
