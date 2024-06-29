import React from "react";

export function ModalConfirmCancel( {isShown, title, text, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h4>{title}</h4>
      <hr />
      <p>{text}</p>
      <div className="flex justify-between mt-3">
        <button className="button-standard-blue-grey" onClick={onClose}>Cancel</button>
        <button className="button-standard" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {children}
        <button style={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    position: "relative",
    width: "auto",
    // maxWidth: "500px"
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer"
  }
};
