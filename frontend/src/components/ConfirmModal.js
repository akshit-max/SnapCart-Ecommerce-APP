import { useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger", // "danger" | "primary"
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="custom-modal-backdrop"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        className="card-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "28px 24px",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "#ffffff",
        }}
      >
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: confirmVariant === "danger" ? "#fef2f2" : "var(--brand-primary-light)",
              color: confirmVariant === "danger" ? "#ef4444" : "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            <FiAlertTriangle />
          </div>

          <button
            type="button"
            className="btn btn-link text-muted p-1"
            onClick={onCancel}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <h5 className="fw-bold text-dark mb-2">{title}</h5>
        <p className="text-secondary small mb-4" style={{ lineHeight: "1.6" }}>
          {message}
        </p>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-outline-custom px-4 py-2"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmVariant === "danger" ? "btn-danger" : "btn-brand"} px-4 py-2 fw-semibold`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

