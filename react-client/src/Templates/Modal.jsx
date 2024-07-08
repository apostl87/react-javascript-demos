import React from "react";

export function ModalTemplate({ isShown, children, onClose }) {
  if (isShown) {
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
  } else {
    return;
  }
}

export function ModalCreateProductTemplate({ isShown, children }) {
  if (isShown) {
    return (
      <div style={styles.overlay} className='z-40 overflow-y-scroll'>
        <div style={styles.modalCreateProduct}>
          {children}
        </div>
      </div>
    );
  } else {
    return;
  }
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
    width: "600px",
    maxWidth: "100%",
  },
  modalCreateProduct: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    position: "relative",
    width: "80vw",
    maxWidth: "800px",
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
