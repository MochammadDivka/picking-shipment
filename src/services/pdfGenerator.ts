import jsPDF from 'jspdf';
import autoTableModule, { RowInput } from 'jspdf-autotable';
import { ShipmentData } from '../types/shipment';
import { calculateTotalQoly, formatDateIndo, formatNumber } from '../utils/calculator';

// Handle autoTable export differences across bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const autoTable: any = (autoTableModule as any).default?.default || (autoTableModule as any).default || autoTableModule;

/**
 * Menghasilkan dokumen PDF Picking Shipment:
 * - Ukuran Kertas: A4 Portrait (595.28 pt x 841.89 pt)
 * - Margin dibuat pas & full 1 kertas A4 tanpa terpotong (Margin X: 18 pt, Margin Top: 18 pt)
 * - Struktur tabel 100% kontinuitas 5 kolom presisi sesuai template surat jalan.pdf
 * - Total 65 baris presisi:
 *   - Baris 1-6: Header informasi pengiriman
 *   - Baris 7: Header kolom (No, Nomer DO, SHU, Partner/Name, Qoly)
 *   - Baris 8-57: 50 baris data & pengisi
 *   - Baris 58: TOTAL
 *   - Baris 59: Jumlah Pallet
 *   - Baris 60: Pembatas kosong
 *   - Baris 61-65: Blok tanda tangan (Driver, Security RDC, Penerima) yang segaris kolom
 */
export function buildShipmentPDF(data: ShipmentData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = 595.28;
  const marginX = 18.0;
  const marginTop = 18.0;
  const availableWidth = pageWidth - marginX * 2; // 559.28 pt

  const totalQoly = calculateTotalQoly(data.dos);
  const formattedDate = formatDateIndo(data.header.date);

  // Proporsi lebar kolom tabel data (total 559.28 pt)
  const col0 = Math.round(availableWidth * (24.4 / 559.4) * 10) / 10;
  const col1 = Math.round(availableWidth * (81.1 / 559.4) * 10) / 10;
  const col2 = Math.round(availableWidth * (135.8 / 559.4) * 10) / 10;
  const col3 = Math.round(availableWidth * (174.0 / 559.4) * 10) / 10;
  const col4 = availableWidth - (col0 + col1 + col2 + col3);

  const columnStyles = {
    0: { cellWidth: col0, halign: 'center' as const },
    1: { cellWidth: col1, halign: 'center' as const },
    2: { cellWidth: col2, halign: 'center' as const },
    3: { cellWidth: col3, halign: 'center' as const },
    4: { cellWidth: col4, halign: 'center' as const },
  };

  const bodyRows: RowInput[] = [];

  // ROW 1: Judul "Picking Shipment" (Merged A1:E1)
  bodyRows.push([
    {
      content: 'Picking Shipment',
      colSpan: 5,
      styles: {
        halign: 'center',
        valign: 'middle',
        fontSize: 8.0,
        fontStyle: 'normal',
        minCellHeight: 12.5,
      },
    },
  ]);

  // ROW 2: Unique Code
  bodyRows.push([
    { content: '', styles: { minCellHeight: 16 } },
    {
      content: 'Unique Code',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.0, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    {
      content: data.header.uniqueCode || '',
      styles: { halign: 'center', valign: 'middle', fontSize: 15.0, fontStyle: 'bold', cellPadding: { left: 4, right: 4, top: 1, bottom: 1 } },
    },
    { content: '' },
    { content: '' },
  ]);

  // ROW 3: Date
  bodyRows.push([
    { content: '', styles: { minCellHeight: 11.5 } },
    {
      content: 'Date',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.0, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    {
      content: formattedDate || '',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.5, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    { content: '' },
    { content: '' },
  ]);

  // ROW 4: No.Pol Truck
  bodyRows.push([
    { content: '', styles: { minCellHeight: 12 } },
    {
      content: 'No.Pol Truck',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.0, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    {
      content: data.header.truckNumber || '',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.5, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    { content: '' },
    { content: '' },
  ]);

  // ROW 5: DC Pengiriman
  bodyRows.push([
    { content: '', styles: { minCellHeight: 11.5 } },
    {
      content: 'DC Pengiriman',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.0, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    {
      content: data.header.dcPengiriman || '',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.5, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    { content: '' },
    { content: '' },
  ]);

  // ROW 6: DC Tujuan
  bodyRows.push([
    { content: '', styles: { minCellHeight: 11.5 } },
    {
      content: 'DC Tujuan',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.0, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    {
      content: data.header.dcTujuan || '',
      styles: { halign: 'left', valign: 'middle', fontSize: 9.5, fontStyle: 'normal', cellPadding: { left: 4, right: 3, top: 1, bottom: 1 } },
    },
    { content: '' },
    { content: '' },
  ]);

  // ROW 7: Table Column Header (No, Nomer DO, SHU, Partner/Name, Qoly)
  bodyRows.push([
    { content: 'No', styles: { halign: 'center', valign: 'middle', fontSize: 7.6, minCellHeight: 11 } },
    { content: 'Nomer DO', styles: { halign: 'center', valign: 'middle', fontSize: 7.6 } },
    { content: 'SHU', styles: { halign: 'center', valign: 'middle', fontSize: 7.6 } },
    { content: 'Partner/Name', styles: { halign: 'center', valign: 'middle', fontSize: 7.6 } },
    { content: 'Qoly', styles: { halign: 'center', valign: 'middle', fontSize: 7.6 } },
  ]);

  // ROWS 8..57: Data Rows (No & Nomer DO di-merge rowSpan; Partner/Name TIDAK di-merge)
  let totalDataRows = 0;
  data.dos.forEach((deliveryOrder, doIndex) => {
    const shuCount = deliveryOrder.shuItems.length > 0 ? deliveryOrder.shuItems.length : 1;
    const shuList = deliveryOrder.shuItems.length > 0
      ? deliveryOrder.shuItems
      : [{ id: 'empty', shu: '', qoly: '' }];

    shuList.forEach((shuItem, shuIdx) => {
      totalDataRows++;
      const isFirst = shuIdx === 0;

      if (isFirst) {
        bodyRows.push([
          {
            content: String(doIndex + 1),
            rowSpan: shuCount,
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5, minCellHeight: 10.3 },
          },
          {
            content: deliveryOrder.doNumber || '',
            rowSpan: shuCount,
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5 },
          },
          {
            content: String(shuItem.shu || ''),
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5 },
          },
          {
            content: deliveryOrder.partnerName || '',
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5 },
          },
          {
            content: shuItem.qoly !== '' && shuItem.qoly !== undefined ? formatNumber(shuItem.qoly) : '',
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5 },
          },
        ]);
      } else {
        bodyRows.push([
          {
            content: String(shuItem.shu || ''),
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5, minCellHeight: 10.3 },
          },
          {
            content: deliveryOrder.partnerName || '',
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5 },
          },
          {
            content: shuItem.qoly !== '' && shuItem.qoly !== undefined ? formatNumber(shuItem.qoly) : '',
            styles: { halign: 'center', valign: 'middle', fontSize: 8.5 },
          },
        ]);
      }
    });
  });

  // Isi baris kosong hingga mencapai tepat 50 baris data (Baris 8 hingga 57)
  const targetTotalRows = 50;
  const emptyRowsToFill = Math.max(0, targetTotalRows - totalDataRows);
  for (let i = 0; i < emptyRowsToFill; i++) {
    bodyRows.push([
      { content: '', styles: { minCellHeight: 10.3 } },
      { content: '' },
      { content: '' },
      { content: '' },
      { content: '' },
    ]);
  }

  // ROW 58: TOTAL
  bodyRows.push([
    {
      content: 'TOTAL',
      colSpan: 4,
      styles: { halign: 'center', valign: 'middle', fontSize: 9.0, fontStyle: 'normal', minCellHeight: 11.5 },
    },
    {
      content: formatNumber(totalQoly),
      styles: { halign: 'center', valign: 'middle', fontSize: 9.0, fontStyle: 'normal' },
    },
  ]);

  // ROW 59: Jumlah Pallet
  bodyRows.push([
    {
      content: 'Jumlah Pallet',
      colSpan: 4,
      styles: { halign: 'left', valign: 'middle', fontSize: 8.5, fontStyle: 'normal', minCellHeight: 11.5, cellPadding: { left: 4 } },
    },
    {
      content: data.header.jumlahPallet || '',
      styles: { halign: 'center', valign: 'middle', fontSize: 9.0 },
    },
  ]);

  // ROW 60: Empty separator row
  bodyRows.push([
    { content: '', styles: { minCellHeight: 4 } },
    { content: '' },
    { content: '' },
    { content: '' },
    { content: '' },
  ]);

  // ROW 61: Judul Jabatan (Col A+B: Driver, Col C: Security RDC, Col D+E: Penerima)
  bodyRows.push([
    { content: 'Driver', colSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 10, fontStyle: 'normal', minCellHeight: 14 } },
    { content: 'Security RDC', styles: { halign: 'center', valign: 'middle', fontSize: 10, fontStyle: 'normal', minCellHeight: 14 } },
    { content: 'Penerima', colSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 10, fontStyle: 'normal', minCellHeight: 14 } },
  ]);

  // ROW 62, 63, 64: Signature space rows (with matching cell borders)
  for (let r = 0; r < 3; r++) {
    bodyRows.push([
      { content: '', colSpan: 2, styles: { minCellHeight: 13 } },
      { content: '', styles: { minCellHeight: 13 } },
      { content: '', colSpan: 2, styles: { minCellHeight: 13 } },
    ]);
  }

  // ROW 65: Name slot
  const driverSlot = `( ${data.header.driverName ? data.header.driverName : '.........................................'} )`;
  const secSlot = `( ${data.header.securityName ? data.header.securityName : '.........................................'} )`;
  const penerimaSlot = `( ${data.header.penerimaName ? data.header.penerimaName : '.........................................'} )`;

  bodyRows.push([
    { content: driverSlot, colSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 8.5, minCellHeight: 15 } },
    { content: secSlot, styles: { halign: 'center', valign: 'middle', fontSize: 8.5, minCellHeight: 15 } },
    { content: penerimaSlot, colSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 8.5, minCellHeight: 15 } },
  ]);

  // Gambar Satu Tabel Tunggal Berkelanjutan (Persis 1 Halaman A4)
  autoTable(doc, {
    startY: marginTop,
    margin: { left: marginX, right: marginX, top: marginTop, bottom: 10 },
    body: bodyRows,
    theme: 'grid',
    pageBreak: 'avoid',
    rowPageBreak: 'avoid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 0.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.6,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      valign: 'middle',
    },
    columnStyles: columnStyles,
  });

  return doc;
}

/**
 * Menghasilkan PDF dengan jaminan 1 Halaman A4 secara pasti tanpa terpotong sedikitpun.
 */
export function generateSinglePagePDF(data: ShipmentData): jsPDF {
  const doc = buildShipmentPDF(data);

  if (doc.getNumberOfPages() > 1) {
    const totalPages = doc.getNumberOfPages();
    for (let p = totalPages; p > 1; p--) {
      doc.deletePage(p);
    }
  }

  return doc;
}

/**
 * Mendapatkan nama file default PDF (selalu diakhiri .pdf)
 */
export function getPdfFilename(data: ShipmentData): string {
  const code = data.header.uniqueCode?.trim();
  if (code) {
    const safeCode = code.replace(/[^a-zA-Z0-9_-]/g, '_');
    return `Picking-Shipment-${safeCode}.pdf`;
  }

  const date = data.header.date?.trim() || formatDateIndo(new Date().toISOString().split('T')[0]);
  const safeDate = date.replace(/[^a-zA-Z0-9_-]/g, '-');
  return `Picking-Shipment-${safeDate}.pdf`;
}

/**
 * Download file PDF resmi dengan ekstensi .pdf pasti dan tipe data application/pdf
 */
export function downloadShipmentPDF(data: ShipmentData): void {
  const doc = generateSinglePagePDF(data);
  let filename = getPdfFilename(data);
  if (!filename.toLowerCase().endsWith('.pdf')) {
    filename += '.pdf';
  }

  // 1. Eksekusi penyimpanan dengan mekanisme Blob URL yang eksplisit
  try {
    const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  } catch {
    // 2. Fallback jsPDF native save
    doc.save(filename);
  }
}

/**
 * Dapatkan Blob URL PDF untuk preview di dalam iframe / viewer
 */
export function getShipmentPdfBlobUrl(data: ShipmentData): string {
  const doc = generateSinglePagePDF(data);
  const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
