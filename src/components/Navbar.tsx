import React from 'react';
import { FileSpreadsheet, RotateCcw, Layers, Printer, Download, FileText } from 'lucide-react';

interface NavbarProps {
  onLoadTemplateSample: () => void;
  onLoadMultiSHUSample: () => void;
  onReset: () => void;
  onDownloadPdf?: () => void;
  onDownloadExcel?: () => void;
  onPrint?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadTemplateSample,
  onLoadMultiSHUSample,
  onReset,
  onDownloadPdf,
  onDownloadExcel,
  onPrint,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-medium shadow-sm">
            <FileText className="w-4 h-4 text-zinc-100" />
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              Picking Shipment
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200/70">
              A4 Standard
            </span>
          </div>
        </div>

        {/* Center: Presets & Reset */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/70 text-xs">
            <button
              type="button"
              onClick={onLoadTemplateSample}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white rounded-md transition shadow-none hover:shadow-xs"
              title="Muat data standar template Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Template</span>
            </button>
            <button
              type="button"
              onClick={onLoadMultiSHUSample}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white rounded-md transition shadow-none hover:shadow-xs"
              title="Muat contoh 1 DO dengan banyak SHU"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Multi-SHU</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-md transition"
            title="Kosongkan seluruh data formulir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg transition"
              title="Cetak Dokumen Langsung"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Cetak</span>
            </button>
          )}

          {onDownloadExcel && (
            <button
              type="button"
              onClick={onDownloadExcel}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg transition"
              title="Unduh File Excel Spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Excel</span>
            </button>
          )}

          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
              title="Unduh Dokumen PDF 1 Halaman A4"
            >
              <Download className="w-3.5 h-3.5 text-zinc-300" />
              <span>Unduh PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
