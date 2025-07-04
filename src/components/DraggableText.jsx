import Draggable from "react-draggable";

function DraggableSignature({ signatureURL, onStop }) {
  return (
    <Draggable defaultPosition={{ x: 100, y: 100 }} onStop={(e, data) => onStop(data)}>
      <img
        src={signatureURL}
        alt="Signature"
        className="w-32 border-2 border-blue-400 rounded shadow-lg cursor-move z-50"
      />
    </Draggable>
  );
}

export default DraggableSignature;