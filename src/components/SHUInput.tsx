import React from 'react';
import { SHUItem, ValidationError } from '../types/shipment';
import { Trash2 } from 'lucide-react';

interface SHUInputProps {
  shuItem: SHUItem;
  index: number;
  canDelete: boolean;
  errors: ValidationError[];
  onChange: (updatedItem: SHUItem) => void;
  onDelete: () => void;
}

export const SHUInput: React.FC<SHUInputProps> = ({
  shuItem,
  index,
  canDelete,
  errors,
  onChange,
  onDelete,
}) => {
  const shuError = errors.find((e) => e.field === `shu-${shuItem.id}-shu`)?.message;
  const qolyError = errors.find((e) => e.field === `shu-${shuItem.id}-qoly`)?.message;

  const handleShuChange = (value: string) => {
    onChange({
      ...shuItem,
      shu: value.trim(),
    });
  };

  const handleQolyChange = (value: string) => {
    if (value === '') {
      onChange({
        ...shuItem,
        qoly: '',
      });
      return;
    }

    const num = parseInt(value, 10);
    onChange({
      ...shuItem,
      qoly: isNaN(num) ? '' : Math.max(0, num),
    });
  };

  return (
    <div className="py-2 px-3 bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors mb-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs font-mono font-medium text-zinc-400 w-6 text-center">
          #{index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={shuItem.shu}
            onChange={(e) => handleShuChange(e.target.value)}
            placeholder="Nomor SHU (Misal: 204500000078006)"
            className={`w-full px-2.5 py-1 text-xs font-mono rounded-md border bg-white transition focus:outline-none ${
              shuError
                ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
            }`}
          />
          {shuError && <p className="text-[10px] text-rose-500 mt-0.5">{shuError}</p>}
        </div>

        <div className="w-24 sm:w-28">
          <input
            type="number"
            min="0"
            step="1"
            value={shuItem.qoly}
            onChange={(e) => handleQolyChange(e.target.value)}
            placeholder="Qoly"
            className={`w-full px-2.5 py-1 text-xs font-mono text-right rounded-md border bg-white transition focus:outline-none ${
              qolyError
                ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
            }`}
          />
          {qolyError && <p className="text-[10px] text-rose-500 mt-0.5 text-right">{qolyError}</p>}
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className={`p-1 rounded-md transition ${
            canDelete
              ? 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'
              : 'text-zinc-200 cursor-not-allowed'
          }`}
          title={canDelete ? 'Hapus SHU' : 'Minimal 1 SHU'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
