import React from 'react';
import { ShipmentData, DeliveryOrder, ValidationError } from '../types/shipment';
import { ShipmentMetrics } from './ShipmentMetrics';
import { ShipmentHeader } from './ShipmentHeader';
import { DOForm } from './DOForm';
import { Plus, Eye, Download, Printer, AlertCircle, RotateCcw } from 'lucide-react';

interface ShipmentFormProps {
  data: ShipmentData;
  errors: ValidationError[];
  onChange: (updatedData: ShipmentData) => void;
  onPreview: () => void;
  onGeneratePdf: () => void;
  onDownloadExcel: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  data,
  errors,
  onChange,
  onPreview,
  onGeneratePdf,
  onDownloadExcel,
  onPrint,
  onReset,
}) => {
  const handleHeaderChange = (header: ShipmentData['header']) => {
    onChange({
      ...data,
      header,
    });
  };

  const handleAddDO = () => {
    const newDO: DeliveryOrder = {
      id: `do-${Date.now()}`,
      doNumber: '',
      partnerName: '',
      shuItems: [
        { id: `shu-${Date.now()}-1`, shu: '', qoly: '' },
      ],
    };

    onChange({
      ...data,
      dos: [...data.dos, newDO],
    });
  };

  const handleDuplicateDO = (index: number) => {
    const sourceDO = data.dos[index];
    const duplicatedDO: DeliveryOrder = {
      id: `do-${Date.now()}`,
      doNumber: sourceDO.doNumber,
      partnerName: sourceDO.partnerName,
      shuItems: sourceDO.shuItems.map((item, i) => ({
        id: `shu-${Date.now()}-${i + 1}`,
        shu: item.shu,
        qoly: item.qoly,
      })),
    };

    const newDOs = [...data.dos];
    newDOs.splice(index + 1, 0, duplicatedDO);
    onChange({
      ...data,
      dos: newDOs,
    });
  };

  const handleUpdateDO = (index: number, updatedDO: DeliveryOrder) => {
    const newDOs = [...data.dos];
    newDOs[index] = updatedDO;
    onChange({
      ...data,
      dos: newDOs,
    });
  };

  const handleDeleteDO = (index: number) => {
    if (data.dos.length <= 1) return;
    const newDOs = data.dos.filter((_, idx) => idx !== index);
    onChange({
      ...data,
      dos: newDOs,
    });
  };

  return (
    <div className="flex flex-col space-y-4 pb-12">
      {/* 1. OPERATIONAL METRICS STRIP */}
      <ShipmentMetrics data={data} />

      {/* 2. SECTION SHIPMENT HEADER */}
      <ShipmentHeader
        header={data.header}
        onChange={handleHeaderChange}
        errors={errors}
      />

      {/* 3. SECTION DELIVERY ORDER (DO) LIST */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
              Daftar Delivery Order ({data.dos.length})
            </h2>
            <p className="text-[11px] text-zinc-500">
              Rincian nomor DO, nama tujuan partner, dan baris SHU/koli
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDO}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah DO</span>
          </button>
        </div>

        {/* List of DOs */}
        <div className="space-y-3">
          {data.dos.map((deliveryOrder, idx) => (
            <DOForm
              key={deliveryOrder.id}
              deliveryOrder={deliveryOrder}
              index={idx}
              canDeleteDO={data.dos.length > 1}
              errors={errors}
              onChange={(updated) => handleUpdateDO(idx, updated)}
              onDeleteDO={() => handleDeleteDO(idx)}
              onDuplicateDO={() => handleDuplicateDO(idx)}
            />
          ))}
        </div>

        {/* Bottom Add DO Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleAddDO}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-white/60 hover:bg-white text-xs font-medium text-zinc-600 inline-flex items-center justify-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 text-zinc-400" />
            <span>Tambah Delivery Order Baru</span>
          </button>
        </div>
      </div>

      {/* 4. VALIDATION ERRORS BANNER */}
      {errors.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3.5 text-rose-800 text-xs">
          <div className="flex items-center space-x-1.5 font-medium mb-1 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Harap lengkapi kolom berikut sebelum ekspor:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-rose-700 ml-1">
            {errors.slice(0, 4).map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
            {errors.length > 4 && (
              <li className="font-medium italic">...dan {errors.length - 4} kolom lainnya.</li>
            )}
          </ul>
        </div>
      )}

      {/* 5. CLEAN ANCHORED ACTION CONTROLS */}
      <div className="bg-white rounded-xl p-3 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition"
          title="Kosongkan seluruh data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/70 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            onClick={onDownloadExcel}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition"
            title="Unduh File Excel Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={onGeneratePdf}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
            title="Unduh Dokumen PDF 1 Halaman A4"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
