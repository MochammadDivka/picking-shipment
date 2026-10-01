import React from 'react';
import { DeliveryOrder, SHUItem, ValidationError } from '../types/shipment';
import { Plus, Trash2, Copy } from 'lucide-react';
import { formatNumber } from '../utils/calculator';

interface DOFormProps {
  deliveryOrder: DeliveryOrder;
  index: number;
  canDeleteDO: boolean;
  errors: ValidationError[];
  onChange: (updatedDO: DeliveryOrder) => void;
  onDeleteDO: () => void;
  onDuplicateDO?: () => void;
}

export const DOForm: React.FC<DOFormProps> = ({
  deliveryOrder,
  index,
  canDeleteDO,
  errors,
  onChange,
  onDeleteDO,
  onDuplicateDO,
}) => {
  const doNumberError = errors.find((e) => e.field === `do-${deliveryOrder.id}-doNumber`)?.message;
  const partnerNameError = errors.find((e) => e.field === `do-${deliveryOrder.id}-partnerName`)?.message;

  // Hitung subtotal qoly DO ini
  const doSubtotalQoly = deliveryOrder.shuItems.reduce((acc, curr) => {
    const val = typeof curr.qoly === 'number' ? curr.qoly : parseInt(String(curr.qoly), 10);
    return acc + (isNaN(val) || val < 0 ? 0 : val);
  }, 0);

  const handleFieldChange = (field: 'doNumber' | 'partnerName', value: string) => {
    onChange({
      ...deliveryOrder,
      [field]: field === 'doNumber' ? value.toUpperCase().trim() : value.toUpperCase(),
    });
  };

  const handleAddSHU = () => {
    const newShuItem: SHUItem = {
      id: `shu-${Date.now()}-${deliveryOrder.shuItems.length + 1}`,
      shu: '',
      qoly: '',
    };
    onChange({
      ...deliveryOrder,
      shuItems: [...deliveryOrder.shuItems, newShuItem],
    });
  };

  const handleUpdateSHU = (shuIdx: number, updatedItem: SHUItem) => {
    const updatedList = [...deliveryOrder.shuItems];
    updatedList[shuIdx] = updatedItem;
    onChange({
      ...deliveryOrder,
      shuItems: updatedList,
    });
  };

  const handleDeleteSHU = (shuIdx: number) => {
    if (deliveryOrder.shuItems.length <= 1) return;
    const updatedList = deliveryOrder.shuItems.filter((_, idx) => idx !== shuIdx);
    onChange({
      ...deliveryOrder,
      shuItems: updatedList,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden transition-colors hover:border-zinc-300">
      {/* DO Card Header Bar */}
      <div className="bg-zinc-50/70 px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="font-mono text-xs font-semibold text-zinc-700 bg-white border border-zinc-200/80 px-2 py-0.5 rounded shadow-2xs">
            DO #{index + 1}
          </span>
          <span className="text-xs text-zinc-500 truncate">
            {deliveryOrder.partnerName || 'Partner belum diisi'}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="text-xs text-zinc-600 font-mono">
            <span className="font-semibold text-zinc-900">{formatNumber(doSubtotalQoly)}</span> koli
          </div>

          <div className="h-3.5 w-px bg-zinc-200" />

          {/* Duplicate DO button */}
          {onDuplicateDO && (
            <button
              type="button"
              onClick={onDuplicateDO}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition"
              title="Duplikasi DO ini"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete DO button */}
          <button
            type="button"
            onClick={onDeleteDO}
            disabled={!canDeleteDO}
            className={`p-1.5 rounded-md transition ${
              canDeleteDO
                ? 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'
                : 'text-zinc-200 cursor-not-allowed'
            }`}
            title={canDeleteDO ? 'Hapus Delivery Order' : 'Minimal 1 DO'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* DO Header Inputs (Nomer DO & Partner) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Nomer DO */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              Nomor DO <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={deliveryOrder.doNumber}
              onChange={(e) => handleFieldChange('doNumber', e.target.value)}
              placeholder="Misal: PM58136676"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-mono uppercase rounded-lg border bg-white transition focus:outline-none ${
                doNumberError
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
              }`}
            />
            {doNumberError && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">{doNumberError}</p>
            )}
          </div>

          {/* Partner / Nama */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              Partner / Nama Tujuan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={deliveryOrder.partnerName}
              onChange={(e) => handleFieldChange('partnerName', e.target.value)}
              placeholder="Misal: YOGYA GRAND CIREBON"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase rounded-lg border bg-white transition focus:outline-none ${
                partnerNameError
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
              }`}
            />
            {partnerNameError && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">{partnerNameError}</p>
            )}
          </div>
        </div>

        {/* Tabular Grid untuk Baris SHU & Qoly */}
        <div className="border border-zinc-200/90 rounded-lg overflow-hidden">
          <div className="bg-zinc-50/90 px-3 py-2 border-b border-zinc-200/70 grid grid-cols-12 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            <div className="col-span-1 text-center font-mono">#</div>
            <div className="col-span-7 sm:col-span-8">Nomor SHU</div>
            <div className="col-span-3 sm:col-span-2 text-right">Qoly (Koli)</div>
            <div className="col-span-1 text-center"></div>
          </div>

          <div className="divide-y divide-zinc-100 bg-white">
            {deliveryOrder.shuItems.map((shuItem, shuIdx) => {
              const shuError = errors.find((e) => e.field === `shu-${shuItem.id}-shu`)?.message;
              const qolyError = errors.find((e) => e.field === `shu-${shuItem.id}-qoly`)?.message;

              return (
                <div
                  key={shuItem.id}
                  className="px-3 py-1.5 grid grid-cols-12 items-center gap-2 hover:bg-zinc-50/50 transition-colors"
                >
                  {/* # Index */}
                  <div className="col-span-1 text-center font-mono text-xs text-zinc-400">
                    {shuIdx + 1}
                  </div>

                  {/* SHU input */}
                  <div className="col-span-7 sm:col-span-8">
                    <input
                      type="text"
                      value={shuItem.shu}
                      onChange={(e) =>
                        handleUpdateSHU(shuIdx, { ...shuItem, shu: e.target.value.trim() })
                      }
                      placeholder="Nomor SHU (Misal: 204500000078006)"
                      className={`w-full px-2.5 py-1 text-xs font-mono rounded-md border bg-white transition focus:outline-none ${
                        shuError
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-1 focus:ring-rose-400'
                          : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                      }`}
                    />
                    {shuError && <p className="text-[10px] text-rose-500 mt-0.5">{shuError}</p>}
                  </div>

                  {/* Qoly input */}
                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={shuItem.qoly}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10));
                        handleUpdateSHU(shuIdx, {
                          ...shuItem,
                          qoly: isNaN(val as number) ? '' : val,
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSHU();
                        }
                      }}
                      placeholder="0"
                      className={`w-full px-2.5 py-1 text-xs font-mono text-right rounded-md border bg-white transition focus:outline-none ${
                        qolyError
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-1 focus:ring-rose-400'
                          : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                      }`}
                    />
                    {qolyError && <p className="text-[10px] text-rose-500 text-right mt-0.5">{qolyError}</p>}
                  </div>

                  {/* Delete SHU */}
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteSHU(shuIdx)}
                      disabled={deliveryOrder.shuItems.length <= 1}
                      className={`p-1 rounded transition ${
                        deliveryOrder.shuItems.length > 1
                          ? 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'
                          : 'text-zinc-200 cursor-not-allowed'
                      }`}
                      title={deliveryOrder.shuItems.length > 1 ? 'Hapus baris' : 'Minimal 1 baris'}
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add SHU button row */}
          <div className="bg-zinc-50/50 px-3 py-2 border-t border-zinc-200/60 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddSHU}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tambah Baris SHU</span>
            </button>
            <span className="text-[10px] text-zinc-400 hidden sm:inline font-mono">
              Enter di Qoly untuk baris baru
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
