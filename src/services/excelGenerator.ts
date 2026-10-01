import ExcelJS from 'exceljs';
import { ShipmentData } from '../types/shipment';
import { calculateTotalQoly, formatDateIndo } from '../utils/calculator';
import { getPdfFilename } from './pdfGenerator';

/**
 * Menghasilkan dan mendownload file Excel (.xlsx) resmi Picking Shipment
 * 100% presisi sesuai struktur 65 baris template surat jalan.xlsx
 */
export async function downloadShipmentExcel(data: ShipmentData): Promise<void> {
  const formattedDate = formatDateIndo(data.header.date);
  const totalQoly = calculateTotalQoly(data.dos);

  let workbook = new ExcelJS.Workbook();
  let loadedFromTemplate = false;

  // 1. Coba muat dari template asli jika tersedia di web server / public
  try {
    const res = await fetch('/template_surat_jalan.xlsx');
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
      loadedFromTemplate = true;
    }
  } catch {
    // Lanjutkan ke pembuatan manual yang presisi jika fetch tidak tersedia
    loadedFromTemplate = false;
  }

  if (loadedFromTemplate && workbook.worksheets.length > 0) {
    const ws = workbook.worksheets[0];

    // Header Values
    ws.getCell('C2').value = data.header.uniqueCode || '';
    ws.getCell('C3').value = formattedDate || '';
    ws.getCell('C4').value = data.header.truckNumber || '';
    ws.getCell('C5').value = data.header.dcPengiriman || '';
    ws.getCell('C6').value = data.header.dcTujuan || '';

    // Bersihkan baris data 8 sampai 57 terlebih dahulu
    for (let r = 8; r <= 57; r++) {
      ws.getCell(`A${r}`).value = null;
      ws.getCell(`B${r}`).value = null;
      ws.getCell(`C${r}`).value = null;
      ws.getCell(`D${r}`).value = null;
      ws.getCell(`E${r}`).value = null;
    }

    // Isi baris data riil
    let currentRow = 8;
    data.dos.forEach((deliveryOrder, doIdx) => {
      const shuList = deliveryOrder.shuItems.length > 0
        ? deliveryOrder.shuItems
        : [{ id: 'empty', shu: '', qoly: '' }];
      const shuCount = shuList.length;
      const startRowForDO = currentRow;

      shuList.forEach((shuItem, shuIdx) => {
        if (currentRow > 57) return;

        ws.getCell(`C${currentRow}`).value = String(shuItem.shu || '');
        ws.getCell(`D${currentRow}`).value = String(deliveryOrder.partnerName || '');
        ws.getCell(`E${currentRow}`).value = shuItem.qoly !== '' && shuItem.qoly !== undefined ? Number(shuItem.qoly) : '';

        if (shuIdx === 0) {
          ws.getCell(`A${currentRow}`).value = doIdx + 1;
          ws.getCell(`B${currentRow}`).value = String(deliveryOrder.doNumber || '');
        }

        currentRow++;
      });

      if (shuCount > 1 && currentRow - 1 <= 57) {
        const endRowForDO = currentRow - 1;
        try {
          ws.mergeCells(`A${startRowForDO}:A${endRowForDO}`);
          ws.mergeCells(`B${startRowForDO}:B${endRowForDO}`);
        } catch {}
      }
    });

    // Row 58: Total Formula & Nilai
    ws.getCell('E58').value = { formula: 'SUM(E8:E57)', result: totalQoly };

    // Row 59: Jumlah Pallet
    ws.getCell('E59').value = data.header.jumlahPallet || '';

    // Row 65: Petugas Tanda Tangan
    ws.getCell('A65').value = data.header.driverName
      ? `( ${data.header.driverName} )`
      : '( ......................................... )';
    ws.getCell('C65').value = data.header.securityName
      ? `( ${data.header.securityName} )`
      : '( ......................................... )';
    ws.getCell('D65').value = data.header.penerimaName
      ? `( ${data.header.penerimaName} )`
      : '( ......................................... )';
  } else {
    // Buat Workbook Baru 100% presisi sesuai template
    workbook = new ExcelJS.Workbook();
    workbook.creator = 'Picking Shipment Generator';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Sheet1', {
      pageSetup: {
        paperSize: 9, // A4
        orientation: 'portrait',
        margins: {
          left: 0.3,
          right: 0.3,
          top: 0.5,
          bottom: 0.5,
          header: 0.2,
          footer: 0.2,
        },
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
      },
    });

    worksheet.columns = [
      { key: 'colA', width: 6.14 },   // No
      { key: 'colB', width: 21.0 },   // Nomer DO / Label
      { key: 'colC', width: 35.14 },  // SHU / Value
      { key: 'colD', width: 45.0 },   // Partner/Name
      { key: 'colE', width: 37.28 },  // Qoly
    ];

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };

    const applyBorderToRow = (rowNum: number, startCol = 1, endCol = 5) => {
      for (let c = startCol; c <= endCol; c++) {
        worksheet.getCell(rowNum, c).border = thinBorder;
      }
    };

    // ROW 1: Judul "Picking Shipment" (A1:E1)
    worksheet.mergeCells('A1:E1');
    const r1 = worksheet.getCell('A1');
    r1.value = 'Picking Shipment';
    r1.alignment = { horizontal: 'center', vertical: 'middle' };
    r1.font = { name: 'Calibri', size: 11, bold: false };
    applyBorderToRow(1);
    worksheet.getRow(1).height = 21.6;

    // ROW 2: Unique Code
    worksheet.getCell('B2').value = 'Unique Code';
    worksheet.getCell('B2').font = { name: 'Arial', size: 13 };
    worksheet.getCell('B2').alignment = { vertical: 'middle' };
    const c2 = worksheet.getCell('C2');
    c2.value = data.header.uniqueCode || '';
    c2.font = { name: 'Arial', size: 20, bold: true };
    c2.alignment = { horizontal: 'center', vertical: 'middle' };
    applyBorderToRow(2);
    worksheet.getRow(2).height = 23;

    // ROW 3: Date
    worksheet.getCell('B3').value = 'Date';
    worksheet.getCell('B3').font = { name: 'Arial', size: 13 };
    worksheet.getCell('B3').alignment = { vertical: 'middle' };
    worksheet.getCell('C3').value = formattedDate || '';
    worksheet.getCell('C3').font = { name: 'Arial', size: 14 };
    worksheet.getCell('C3').alignment = { horizontal: 'left', vertical: 'middle' };
    applyBorderToRow(3);
    worksheet.getRow(3).height = 17;

    // ROW 4: No.Pol Truck
    worksheet.getCell('B4').value = 'No.Pol Truck';
    worksheet.getCell('B4').font = { name: 'Arial', size: 13 };
    worksheet.getCell('B4').alignment = { vertical: 'middle' };
    worksheet.getCell('C4').value = data.header.truckNumber || '';
    worksheet.getCell('C4').font = { name: 'Times New Roman', size: 14 };
    worksheet.getCell('C4').alignment = { horizontal: 'left', vertical: 'middle' };
    applyBorderToRow(4);
    worksheet.getRow(4).height = 18.5;

    // ROW 5: DC Pengiriman
    worksheet.getCell('B5').value = 'DC Pengiriman';
    worksheet.getCell('B5').font = { name: 'Arial', size: 13 };
    worksheet.getCell('B5').alignment = { vertical: 'middle' };
    worksheet.getCell('C5').value = data.header.dcPengiriman || '';
    worksheet.getCell('C5').font = { name: 'Arial', size: 14, bold: false };
    worksheet.getCell('C5').alignment = { horizontal: 'left', vertical: 'middle' };
    applyBorderToRow(5);
    worksheet.getRow(5).height = 17.5;

    // ROW 6: DC Tujuan
    worksheet.getCell('B6').value = 'DC Tujuan';
    worksheet.getCell('B6').font = { name: 'Arial', size: 13 };
    worksheet.getCell('B6').alignment = { vertical: 'middle' };
    worksheet.getCell('C6').value = data.header.dcTujuan || '';
    worksheet.getCell('C6').font = { name: 'Arial', size: 14, bold: false };
    worksheet.getCell('C6').alignment = { horizontal: 'left', vertical: 'middle' };
    applyBorderToRow(6);
    worksheet.getRow(6).height = 17.5;

    // ROW 7: Table Header
    const headers = ['No', 'Nomer DO', 'SHU', 'Partner/Name', 'Qoly'];
    headers.forEach((h, idx) => {
      const cell = worksheet.getCell(7, idx + 1);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 11, bold: false };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    applyBorderToRow(7);
    worksheet.getRow(7).height = 16.5;

    // ROWS 8..57: Data Rows
    let currentRow = 8;
    data.dos.forEach((deliveryOrder, doIdx) => {
      const shuList = deliveryOrder.shuItems.length > 0
        ? deliveryOrder.shuItems
        : [{ id: 'empty', shu: '', qoly: '' }];
      const shuCount = shuList.length;
      const startRowForDO = currentRow;

      shuList.forEach((shuItem, shuIdx) => {
        const rowNum = currentRow;
        worksheet.getRow(rowNum).height = 15.2;

        const shuCell = worksheet.getCell(rowNum, 3);
        shuCell.value = String(shuItem.shu || '');
        shuCell.font = { name: 'Calibri', size: 12 };
        shuCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const qolyCell = worksheet.getCell(rowNum, 5);
        const qVal = shuItem.qoly !== '' && shuItem.qoly !== undefined ? Number(shuItem.qoly) : '';
        qolyCell.value = qVal;
        qolyCell.font = { name: 'Arial', size: 12 };
        qolyCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const partnerCell = worksheet.getCell(rowNum, 4);
        partnerCell.value = String(deliveryOrder.partnerName || '');
        partnerCell.font = { name: 'Calibri', size: 12 };
        partnerCell.alignment = { horizontal: 'center', vertical: 'middle' };

        if (shuIdx === 0) {
          const noCell = worksheet.getCell(rowNum, 1);
          noCell.value = doIdx + 1;
          noCell.font = { name: 'Arial', size: 12 };
          noCell.alignment = { horizontal: 'center', vertical: 'middle' };

          const doCell = worksheet.getCell(rowNum, 2);
          doCell.value = String(deliveryOrder.doNumber || '');
          doCell.font = { name: 'Arial', size: 12 };
          doCell.alignment = { horizontal: 'center', vertical: 'middle' };
        }

        applyBorderToRow(rowNum);
        currentRow++;
      });

      if (shuCount > 1) {
        const endRowForDO = currentRow - 1;
        worksheet.mergeCells(`A${startRowForDO}:A${endRowForDO}`);
        worksheet.mergeCells(`B${startRowForDO}:B${endRowForDO}`);
      }
    });

    // Baris kosong hingga baris 57 (total 50 baris data)
    while (currentRow <= 57) {
      worksheet.getRow(currentRow).height = 15.2;
      applyBorderToRow(currentRow);
      currentRow++;
    }

    // ROW 58: TOTAL
    worksheet.mergeCells('A58:D58');
    const totalLabel = worksheet.getCell('A58');
    totalLabel.value = 'TOTAL';
    totalLabel.font = { name: 'Arial', size: 13, bold: false };
    totalLabel.alignment = { horizontal: 'center', vertical: 'middle' };
    const totalValCell = worksheet.getCell('E58');
    totalValCell.value = { formula: 'SUM(E8:E57)', result: totalQoly };
    totalValCell.font = { name: 'Arial', size: 13, bold: false };
    totalValCell.alignment = { horizontal: 'center', vertical: 'middle' };
    applyBorderToRow(58);
    worksheet.getRow(58).height = 16;

    // ROW 59: Jumlah Pallet
    worksheet.mergeCells('A59:D59');
    const palletLabel = worksheet.getCell('A59');
    palletLabel.value = 'Jumlah Pallet';
    palletLabel.font = { name: 'Arial', size: 12 };
    palletLabel.alignment = { horizontal: 'left', vertical: 'middle' };
    const palletValCell = worksheet.getCell('E59');
    palletValCell.value = data.header.jumlahPallet || '';
    palletValCell.font = { name: 'Arial', size: 12 };
    palletValCell.alignment = { horizontal: 'center', vertical: 'middle' };
    applyBorderToRow(59);
    worksheet.getRow(59).height = 16;

    // ROW 60: Empty separator row
    applyBorderToRow(60);
    worksheet.getRow(60).height = 8;

    // ROW 61: Judul Tanda Tangan (Driver, Security RDC, Penerima)
    worksheet.mergeCells('A61:B61');
    const driverH = worksheet.getCell('A61');
    driverH.value = 'Driver';
    driverH.font = { name: 'Arial', size: 14 };
    driverH.alignment = { horizontal: 'center', vertical: 'middle' };

    const secH = worksheet.getCell('C61');
    secH.value = 'Security RDC';
    secH.font = { name: 'Arial', size: 14 };
    secH.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('D61:E61');
    const penerimaH = worksheet.getCell('D61');
    penerimaH.value = 'Penerima';
    penerimaH.font = { name: 'Arial', size: 14 };
    penerimaH.alignment = { horizontal: 'center', vertical: 'middle' };
    applyBorderToRow(61);
    worksheet.getRow(61).height = 22;

    // ROW 62-64: Ruang Tanda Tangan
    for (let r = 62; r <= 64; r++) {
      applyBorderToRow(r);
      worksheet.getRow(r).height = 18;
    }

    // ROW 65: Slot Nama & Garis Tanda Tangan
    worksheet.mergeCells('A65:B65');
    const driverNameCell = worksheet.getCell('A65');
    driverNameCell.value = data.header.driverName
      ? `( ${data.header.driverName} )`
      : '( ......................................... )';
    driverNameCell.font = { name: 'Arial', size: 10 };
    driverNameCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const secNameCell = worksheet.getCell('C65');
    secNameCell.value = data.header.securityName
      ? `( ${data.header.securityName} )`
      : '( ......................................... )';
    secNameCell.font = { name: 'Arial', size: 10 };
    secNameCell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('D65:E65');
    const penerimaNameCell = worksheet.getCell('D65');
    penerimaNameCell.value = data.header.penerimaName
      ? `( ${data.header.penerimaName} )`
      : '( ......................................... )';
    penerimaNameCell.font = { name: 'Arial', size: 10 };
    penerimaNameCell.alignment = { horizontal: 'center', vertical: 'middle' };
    applyBorderToRow(65);
    worksheet.getRow(65).height = 20;
  }

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const pdfName = getPdfFilename(data);
  let excelName = pdfName.replace(/\.pdf$/i, '.xlsx');
  if (!excelName.toLowerCase().endsWith('.xlsx')) {
    excelName += '.xlsx';
  }

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', excelName);
  link.download = excelName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}
