import { useState } from 'react';
import { ShipmentData, ValidationError } from './types/shipment';
import { templateSampleData, multiSHUSampleData, createEmptyShipmentData } from './utils/sampleData';
import { validateShipment } from './utils/validation';
import { downloadShipmentPDF, getPdfFilename } from './services/pdfGenerator';
import { downloadShipmentExcel } from './services/excelGenerator';
import { calculateDocumentDensity, calculateTotalSHURows } from './utils/calculator';
import { Navbar } from './components/Navbar';
import { ShipmentForm } from './components/ShipmentForm';
import { ShipmentPreview } from './components/ShipmentPreview';
import { ShipmentTable } from './components/ShipmentTable';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { ResetModal } from './components/ResetModal';
import { FileEdit, Eye, Check } from 'lucide-react';

export function App() {
  const [shipmentData, setShipmentData] = useState<ShipmentData>(templateSampleData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetSuccessAlert, setResetSuccessAlert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const totalSHURows = calculateTotalSHURows(shipmentData.dos);
  const { density } = calculateDocumentDensity(totalSHURows);

  // Load Presets
  const handleLoadTemplateSample = () => {
    setShipmentData(templateSampleData);
    setErrors([]);
  };

  const handleLoadMultiSHUSample = () => {
    setShipmentData(multiSHUSampleData);
    setErrors([]);
  };

  // Open reset modal
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  // Confirm reset
  const handleConfirmReset = () => {
    setShipmentData(createEmptyShipmentData());
    setErrors([]);
    setIsResetModalOpen(false);

    // Toast notification
    setResetSuccessAlert(true);
    setTimeout(() => {
      setResetSuccessAlert(false);
    }, 3500);
  };

  // Preview Action
  const handlePreview = () => {
    const validation = validateShipment(shipmentData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    setIsPreviewModalOpen(true);
  };

  // Generate PDF Action
  const handleGeneratePdf = () => {
    const validation = validateShipment(shipmentData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    downloadShipmentPDF(shipmentData);
  };

  // Download Excel Action
  const handleDownloadExcel = async () => {
    const validation = validateShipment(shipmentData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    try {
      await downloadShipmentExcel(shipmentData);
    } catch (err) {
      console.error('Error generating Excel file:', err);
      alert('Gagal menghasilkan file Excel. Silakan coba kembali.');
    }
  };

  // Print Action
  const handlePrint = () => {
    const validation = validateShipment(shipmentData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    const originalTitle = document.title;
    const printFilename = getPdfFilename(shipmentData).replace('.pdf', '');
    document.title = printFilename;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      {/* 1. TOP NAVBAR */}
      <div className="no-print">
        <Navbar
          onLoadTemplateSample={handleLoadTemplateSample}
          onLoadMultiSHUSample={handleLoadMultiSHUSample}
          onReset={handleOpenResetModal}
          onDownloadPdf={handleGeneratePdf}
          onDownloadExcel={handleDownloadExcel}
          onPrint={handlePrint}
        />
      </div>

      {/* 2. MOBILE / TABLET VIEW TOGGLE */}
      <div className="no-print xl:hidden px-4 pt-3 pb-1">
        <div className="flex bg-zinc-200/70 p-0.5 rounded-lg text-xs w-full sm:w-auto max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 rounded-md font-medium transition ${
              activeTab === 'form'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Form Input</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 rounded-md font-medium transition ${
              activeTab === 'preview'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview A4</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Large Screen: 2-Column Split Workspace (Form on Left, Live A4 on Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form */}
          <div
            className={`xl:col-span-6 ${
              activeTab === 'form' ? 'block' : 'hidden xl:block'
            }`}
          >
            <ShipmentForm
              data={shipmentData}
              errors={errors}
              onChange={(updated) => {
                setShipmentData(updated);
                if (errors.length > 0) {
                  setErrors([]);
                }
              }}
              onPreview={handlePreview}
              onGeneratePdf={handleGeneratePdf}
              onDownloadExcel={handleDownloadExcel}
              onPrint={handlePrint}
              onReset={handleOpenResetModal}
            />
          </div>

          {/* Right Column: Live A4 Interactive Preview */}
          <div
            className={`xl:col-span-6 sticky top-18 ${
              activeTab === 'preview' ? 'block' : 'hidden xl:block'
            }`}
          >
            <div className="h-[calc(100vh-6rem)]">
              <ShipmentPreview
                data={shipmentData}
                onPrint={handlePrint}
                onDownloadPdf={handleGeneratePdf}
                onDownloadExcel={handleDownloadExcel}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 4. MODAL PREVIEW PDF */}
      <PdfPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        data={shipmentData}
        density={density}
        onPrint={handlePrint}
        onDownloadPdf={handleGeneratePdf}
        onDownloadExcel={handleDownloadExcel}
      />

      {/* 5. MODAL RESET CONFIRMATION */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* 6. MINIMALIST TOAST NOTIFICATION */}
      {resetSuccessAlert && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="bg-zinc-900 text-white px-3.5 py-2.5 rounded-lg shadow-lg flex items-center space-x-2.5 border border-zinc-800 text-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium text-zinc-200">Formulir berhasil dikosongkan</span>
            <button
              type="button"
              onClick={() => setResetSuccessAlert(false)}
              className="text-zinc-500 hover:text-zinc-300 ml-2 text-sm leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 7. NATIVE BROWSER PRINT DEDICATED ROOT (PRINT ONLY) */}
      <div id="print-root">
        <ShipmentTable data={shipmentData} density={density} isPrintView={true} />
      </div>
    </div>
  );
}

export default App;
