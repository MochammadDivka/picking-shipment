import { DeliveryOrder, FlattenedShipmentRow, DocumentDensity } from '../types/shipment';

/**
 * Menghitung total seluruh Qoly dari semua SHU pada semua DO.
 * Sesuai aturan: Total = SUM(Qoly seluruh baris).
 * Jangan menghitung jumlah DO atau jumlah SHU.
 */
export function calculateTotalQoly(dos: DeliveryOrder[]): number {
  return dos.reduce((totalDO, currentDO) => {
    const doQolySum = currentDO.shuItems.reduce((totalSHU, item) => {
      const q = typeof item.qoly === 'number' ? item.qoly : parseFloat(String(item.qoly)) || 0;
      return totalSHU + (isNaN(q) || q < 0 ? 0 : q);
    }, 0);
    return totalDO + doQolySum;
  }, 0);
}

/**
 * Menghitung total baris SHU yang ada
 */
export function calculateTotalSHURows(dos: DeliveryOrder[]): number {
  return dos.reduce((sum, d) => sum + (d.shuItems.length > 0 ? d.shuItems.length : 1), 0);
}

/**
 * Meratakan struktur DO & SHU menjadi baris tabel siap render dengan informasi multi-SHU rowspan
 */
export function flattenShipmentRows(dos: DeliveryOrder[]): FlattenedShipmentRow[] {
  const rows: FlattenedShipmentRow[] = [];

  dos.forEach((deliveryOrder, doIdx) => {
    const shuList = deliveryOrder.shuItems.length > 0
      ? deliveryOrder.shuItems
      : [{ id: 'empty', shu: '', qoly: '' }];

    shuList.forEach((shuItem, shuIdx) => {
      rows.push({
        rowId: `${deliveryOrder.id}-${shuItem.id}`,
        doIndex: doIdx + 1,
        doId: deliveryOrder.id,
        doNumber: deliveryOrder.doNumber,
        partnerName: deliveryOrder.partnerName,
        shuId: shuItem.id,
        shu: shuItem.shu,
        qoly: shuItem.qoly,
        isFirstSHUOfDO: shuIdx === 0,
        shuCountInDO: shuList.length,
      });
    });
  });

  return rows;
}

/**
 * Analisis kepadatan dokumen A4 untuk penyesuaian font/padding otomatis
 * Standar 1 halaman A4 Portrait muat dengan nyaman:
 * - 1-14 baris: Spacious (padding lega, font 11-12pt)
 * - 15-24 baris: Normal (padding sedang, font 10pt)
 * - 25-34 baris: Compact (padding rapat, font 9pt)
 * - 35-44 baris: Ultra-Compact (padding minimal, font 8pt)
 * - >44 baris: Exceeded (Peringatan melebihi batas wajar 1 halaman)
 */
export function calculateDocumentDensity(totalSHURows: number): {
  density: DocumentDensity;
  capacityPercentage: number;
  label: string;
  badgeClass: string;
  warning?: string;
} {
  const maxSafeRows = 40;
  const percentage = Math.min(Math.round((totalSHURows / maxSafeRows) * 100), 150);

  if (totalSHURows <= 14) {
    return {
      density: 'spacious',
      capacityPercentage: percentage,
      label: 'Kapasitas Lega (~1 Halaman A4)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  if (totalSHURows <= 24) {
    return {
      density: 'normal',
      capacityPercentage: percentage,
      label: 'Kapasitas Normal (1 Halaman A4)',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    };
  }

  if (totalSHURows <= 34) {
    return {
      density: 'compact',
      capacityPercentage: percentage,
      label: 'Mode Kompak Otomatis (1 Halaman A4)',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }

  if (totalSHURows <= 44) {
    return {
      density: 'ultra-compact',
      capacityPercentage: percentage,
      label: 'Mode Ultra-Kompak (Mendekati Batas A4)',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      warning: 'Jumlah baris mendekati kapasitas maksimal 1 lembar A4. Layout akan dikompresi maksimal.',
    };
  }

  return {
    density: 'exceeded',
    capacityPercentage: percentage,
    label: 'Melebihi Kapasitas Ideal A4 (>44 Baris)',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'Data terlalu banyak untuk dicetak dengan nyaman dalam satu halaman A4. Disarankan membagi shipment atau mengurangi jumlah data.',
  };
}

/**
 * Format tanggal YYYY-MM-DD menjadi DD/MM/YYYY
 */
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  // Check if already in DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Format number dengan pemisah ribuan
 */
export function formatNumber(num: number | string | '' | null | undefined): string {
  if (num === '' || num === undefined || num === null) return '0';
  const parsed = typeof num === 'number' ? num : parseFloat(String(num));
  if (isNaN(parsed)) return '0';
  return parsed.toLocaleString('id-ID');
}
