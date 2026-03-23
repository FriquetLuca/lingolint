import Modal from './Modal';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      title={title}
      type="danger"
    >
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
            if (onClose) {
              onClose();
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-900/20"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
