import React from 'react';
import { ShipmentData } from '../types/shipment';
import { calculateTotalQoly, calculateTotalSHURows, formatNumber } from '../utils/calculator';

interface ShipmentMetricsProps {
  data: ShipmentData;
}

export const ShipmentMetrics: React.FC<ShipmentMetricsProps> = ({ data }) => {
  const totalQoly = calculateTotalQoly(data.dos);
  const totalSHURows = calculateTotalSHURows(data.dos);
  const totalDO = data.dos.length;
  const jumlahPallet = data.header.jumlahPallet || '0';

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
        {/* Metric 1: Total Qoly */}
        <div className="p-3.5 sm:px-4 flex flex-col justify-between">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Total Qoly
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-900 tabular-nums">
              {formatNumber(totalQoly)}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">koli</span>
          </div>
        </div>

        {/* Metric 2: Total DO */}
        <div className="p-3.5 sm:px-4 flex flex-col justify-between">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Delivery Orders
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-900 tabular-nums">
              {totalDO}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">dokumen</span>
          </div>
        </div>

        {/* Metric 3: Total SHU Rows */}
        <div className="p-3.5 sm:px-4 flex flex-col justify-between">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Baris SHU
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-900 tabular-nums">
              {totalSHURows}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">baris</span>
          </div>
        </div>

        {/* Metric 4: Jumlah Pallet */}
        <div className="p-3.5 sm:px-4 flex flex-col justify-between">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Pallet
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-900 tabular-nums">
              {jumlahPallet}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">pallet</span>
          </div>
        </div>
      </div>

      {/* Sub-strip status */}
      <div className="bg-zinc-50/70 px-4 py-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[11px] font-medium text-zinc-700">Format Presisi A4 Portrait</span>
          <span className="text-zinc-300">•</span>
          <span className="text-[11px] text-zinc-500">Pas 1 Halaman Penuh</span>
        </div>
        <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
          Standar Logistik RDC
        </div>
      </div>
    </div>
  );
};
