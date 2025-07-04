import Draggable from "react-draggable";

function DraggableSignature({ src, x, y, onStop }) {
  return (
    <Draggable defaultPosition={{ x, y }} onStop={(e, data) => onStop(data)}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 100,
          cursor: "move",
        }}
      >
        <img
          src={src}
          alt="Signature"
          style={{ width: "160px", pointerEvents: "none" }} // ⬅️ Important
        />
      </div>
    </Draggable>
  );
}

export default DraggableSignature;
