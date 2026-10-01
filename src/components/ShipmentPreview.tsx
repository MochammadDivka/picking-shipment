import React, { useState } from 'react';
import { ShipmentData } from '../types/shipment';
import { ShipmentTable } from './ShipmentTable';
import { calculateDocumentDensity, calculateTotalSHURows } from '../utils/calculator';
import { Printer, Download, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface ShipmentPreviewProps {
  data: ShipmentData;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onDownloadExcel: () => void;
}

export const ShipmentPreview: React.FC<ShipmentPreviewProps> = ({
  data,
  onPrint,
  onDownloadPdf,
  onDownloadExcel,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.88);
  const totalSHURows = calculateTotalSHURows(data.dos);
  const densityInfo = calculateDocumentDensity(totalSHURows);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoomLevel(0.88);
  const handleFitPage = () => setZoomLevel(0.78);

  return (
    <div className="flex flex-col h-full bg-zinc-100/70 rounded-xl border border-zinc-200/90 overflow-hidden shadow-2xs">
      {/* Top Preview Control Bar */}
      <div className="bg-white/95 backdrop-blur-xs px-4 py-2 border-b border-zinc-200/80 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Document Status */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200/70">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>A4 1 Halaman</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            ({totalSHURows} baris aktif)
          </span>
        </div>

        {/* Action Controls & Zoom */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/70 text-zinc-600">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:bg-white rounded transition text-xs"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-0.5 hover:bg-white rounded transition text-[11px] font-mono font-medium text-zinc-700"
              title="Reset Zoom (88%)"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:bg-white rounded transition text-xs"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitPage}
              className="px-1.5 py-0.5 hover:bg-white rounded transition text-[10px] font-mono font-medium text-zinc-500 hidden md:inline"
              title="Sesuaikan Layar"
            >
              Fit
            </button>
          </div>

          <div className="h-3.5 w-px bg-zinc-200" />

          {/* Quick Actions */}
          <button
            type="button"
            onClick={onPrint}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
            title="Cetak Dokumen"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDownloadExcel}
            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 shadow-2xs transition"
            title="Unduh Spreadsheet Excel"
          >
            <Download className="w-3 h-3 text-zinc-400" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg shadow-2xs transition"
            title="Unduh Dokumen PDF 1 Halaman A4"
          >
            <Download className="w-3 h-3 text-zinc-300" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Scrollable A4 Paper Workspace */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start">
        {/* A4 Sheet Representation (210mm x 297mm) */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
          className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200/90 rounded-xs relative flex flex-col justify-between transition-transform duration-150 mb-12"
        >
          {/* Printable Page Content */}
          <div className="w-full">
            <ShipmentTable data={data} density={densityInfo.density} />
          </div>

          {/* Minimal Technical A4 Stamp */}
          <div className="absolute bottom-1 right-2 pointer-events-none text-[8pt] font-mono text-zinc-300 select-none">
            RDC STANDAR • A4 PORTRAIT
          </div>
        </div>
      </div>
    </div>
  );
};
