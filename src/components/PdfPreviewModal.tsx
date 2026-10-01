import React, { useEffect, useState } from 'react';
import { ShipmentData, DocumentDensity } from '../types/shipment';
import { ShipmentTable } from './ShipmentTable';
import { getShipmentPdfBlobUrl, getPdfFilename } from '../services/pdfGenerator';
import { calculateTotalSHURows } from '../utils/calculator';
import { X, Download, Printer, ExternalLink, ZoomIn, ZoomOut, Check, FileText } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShipmentData;
  density?: DocumentDensity;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onDownloadExcel: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  density,
  onPrint,
  onDownloadPdf,
  onDownloadExcel,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'document' | 'pdf'>('document');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);

  const totalSHURows = calculateTotalSHURows(data.dos);
  const filename = getPdfFilename(data);

  useEffect(() => {
    if (isOpen) {
      try {
        const url = getShipmentPdfBlobUrl(data);
        setBlobUrl(url);
      } catch (err) {
        console.error('Error generating PDF preview URL:', err);
      }
    } else {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoomLevel(0.85);
  const handleFitPage = () => setZoomLevel(0.72);

  return (
    <div
      className="no-print fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-2.5 bg-white flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-zinc-900 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-zinc-950 truncate">
                Preview Dokumen Surat Jalan
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono truncate">
                {filename} • Standar 1 Halaman A4
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/70 text-xs mr-1">
              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`px-2.5 py-1 rounded-md font-medium transition text-xs ${
                  viewMode === 'document'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                A4 Presisi
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`px-2.5 py-1 rounded-md font-medium transition text-xs ${
                  viewMode === 'pdf'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Raw PDF
              </button>
            </div>

            {/* Cetak Button */}
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 transition"
              title="Cetak Dokumen (Sesuai Halaman Utama)"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Cetak</span>
            </button>

            {/* Excel Button */}
            <button
              type="button"
              onClick={onDownloadExcel}
              className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium rounded-lg border border-zinc-200 transition"
              title="Unduh format spreadsheet Excel"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Excel</span>
            </button>

            {/* Unduh PDF Button */}
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg shadow-xs transition"
              title="Unduh dokumen PDF 1 Halaman A4"
            >
              <Download className="w-3.5 h-3.5 text-zinc-300" />
              <span>Unduh PDF</span>
            </button>

            {/* Open in new tab link */}
            {blobUrl && (
              <a
                href={blobUrl}
                target="_blank"
                rel="noreferrer"
                download={filename}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition"
                title={`Buka atau unduh ${filename}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Close modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition ml-1"
              title="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-bar Zoom Controls for Document View */}
        {viewMode === 'document' && (
          <div className="bg-zinc-50/80 px-4 py-1.5 border-b border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200/80">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>1 Halaman A4 Portrait</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                ({totalSHURows} baris aktif)
              </span>
            </div>

            <div className="flex items-center bg-white p-0.5 rounded-lg border border-zinc-200/70 text-zinc-600">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 hover:bg-zinc-100 rounded transition text-xs"
                title="Perkecil"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-0.5 hover:bg-zinc-100 rounded transition text-[11px] font-mono font-medium text-zinc-700"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 hover:bg-zinc-100 rounded transition text-xs"
                title="Perbesar"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleFitPage}
                className="px-1.5 py-0.5 hover:bg-zinc-100 rounded transition text-[10px] font-mono font-medium text-zinc-500 hidden sm:inline"
                title="Sesuaikan Layar"
              >
                Fit
              </button>
            </div>
          </div>
        )}

        {/* Modal Body: Document View or Raw PDF */}
        <div className="flex-1 bg-zinc-100/80 overflow-auto p-4 flex justify-center items-start">
          {viewMode === 'document' ? (
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                width: '210mm',
                minHeight: '297mm',
                boxSizing: 'border-box',
              }}
              className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] border border-zinc-200/90 rounded-xs relative flex flex-col justify-between transition-transform duration-150 mb-12"
            >
              <div className="w-full">
                <ShipmentTable data={data} density={density} />
              </div>
              <div className="absolute bottom-1 right-2 pointer-events-none text-[8pt] font-mono text-zinc-300 select-none">
                RDC STANDAR • A4 PORTRAIT
              </div>
            </div>
          ) : blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=0&navpanes=0`}
              title="PDF Raw View"
              className="w-full h-full border-none rounded bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-2">
              <FileText className="w-8 h-8 text-zinc-300" />
              <p className="text-xs">Memuat dokumen PDF...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
