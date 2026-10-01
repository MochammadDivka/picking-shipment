import React from 'react';
import { ShipmentHeaderData, ValidationError } from '../types/shipment';

interface ShipmentHeaderProps {
  header: ShipmentHeaderData;
  onChange: (header: ShipmentHeaderData) => void;
  errors: ValidationError[];
}

export const ShipmentHeader: React.FC<ShipmentHeaderProps> = ({
  header,
  onChange,
  errors,
}) => {
  const getFieldError = (fieldName: string) => {
    return errors.find((e) => e.field === fieldName)?.message;
  };

  const handleFieldChange = (field: keyof ShipmentHeaderData, value: string) => {
    onChange({
      ...header,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
      {/* Header section bar */}
      <div className="px-4 py-3 bg-zinc-50/70 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
            Header Surat Jalan
          </h2>
          <p className="text-[11px] text-zinc-500">
            Rute pengiriman, armada truk, dan tanggal operasional
          </p>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-white border border-zinc-200 px-1.5 py-0.5 rounded">
          * Kolom Wajib
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Row 1: Unique Code, Date, No. Pol */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Unique Code */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              Unique Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={header.uniqueCode}
              onChange={(e) => handleFieldChange('uniqueCode', e.target.value.toUpperCase())}
              placeholder="Misal: 25IC36B"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-mono uppercase rounded-lg border bg-white transition focus:outline-none ${getFieldError('uniqueCode')
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                }`}
            />
            {getFieldError('uniqueCode') && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">
                {getFieldError('uniqueCode')}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              Tanggal Operasional <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={header.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg border bg-white transition focus:outline-none ${getFieldError('date')
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                }`}
            />
            {getFieldError('date') && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">
                {getFieldError('date')}
              </p>
            )}
          </div>

          {/* No.Pol Truck */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              No.Pol Truck <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={header.truckNumber}
              onChange={(e) => handleFieldChange('truckNumber', e.target.value.toUpperCase())}
              placeholder="Misal: B. 9361 TXZ"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-mono uppercase rounded-lg border bg-white transition focus:outline-none ${getFieldError('truckNumber')
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                }`}
            />
            {getFieldError('truckNumber') && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">
                {getFieldError('truckNumber')}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: DC Pengiriman, DC Tujuan, Pallet */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* DC Pengiriman */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              DC Pengiriman (Asal) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={header.dcPengiriman}
              onChange={(e) => handleFieldChange('dcPengiriman', e.target.value.toUpperCase())}
              placeholder="Misal: JEMBER"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase rounded-lg border bg-white transition focus:outline-none ${getFieldError('dcPengiriman')
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                }`}
            />
            {getFieldError('dcPengiriman') && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">
                {getFieldError('dcPengiriman')}
              </p>
            )}
          </div>

          {/* DC Tujuan */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              DC Tujuan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={header.dcTujuan}
              onChange={(e) => handleFieldChange('dcTujuan', e.target.value.toUpperCase())}
              placeholder="Misal: DC BALI"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase rounded-lg border bg-white transition focus:outline-none ${getFieldError('dcTujuan')
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10'
                }`}
            />
            {getFieldError('dcTujuan') && (
              <p className="mt-1 text-[10px] text-rose-500 font-medium">
                {getFieldError('dcTujuan')}
              </p>
            )}
          </div>

          {/* Jumlah Pallet */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              Jumlah Pallet
            </label>
            <input
              type="text"
              value={header.jumlahPallet || ''}
              onChange={(e) => handleFieldChange('jumlahPallet', e.target.value)}
              placeholder="Misal: 3"
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 bg-white transition focus:outline-none"
            />
          </div>
        </div>

        {/* Section: Nama Petugas Tanda Tangan */}
        <div className="pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-zinc-700">
              Petugas Tanda Tangan (Opsional)
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Kosongkan untuk titik manual
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">Driver</label>
              <input
                type="text"
                value={header.driverName || ''}
                onChange={(e) => handleFieldChange('driverName', e.target.value)}
                placeholder="Nama Pengemudi"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 bg-white transition focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">Security RDC</label>
              <input
                type="text"
                value={header.securityName || ''}
                onChange={(e) => handleFieldChange('securityName', e.target.value)}
                placeholder="Nama Petugas Security"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 bg-white transition focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">Penerima (DC Tujuan)</label>
              <input
                type="text"
                value={header.penerimaName || ''}
                onChange={(e) => handleFieldChange('penerimaName', e.target.value)}
                placeholder="Nama Petugas Penerima"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 bg-white transition focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
