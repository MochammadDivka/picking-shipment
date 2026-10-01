import React from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-zinc-200/90 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close X button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded-md hover:bg-zinc-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
            Kosongkan Seluruh Formulir?
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Seluruh nomor DO, baris SHU, dan parameter header akan dihapus bersih. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
