import { ShipmentData, ValidationError } from '../types/shipment';

/**
 * Validasi form Picking Shipment sebelum Preview & Generate PDF
 */
export function validateShipment(data: ShipmentData): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // 1. Validasi Header Dokumen
  if (!data.header.uniqueCode?.trim()) {
    errors.push({ field: 'uniqueCode', message: 'Unique Code wajib diisi.' });
  }

  if (!data.header.date?.trim()) {
    errors.push({ field: 'date', message: 'Date (Tanggal) wajib dipilih.' });
  }

  if (!data.header.truckNumber?.trim()) {
    errors.push({ field: 'truckNumber', message: 'No.Pol Truck wajib diisi.' });
  }

  if (!data.header.dcPengiriman?.trim()) {
    errors.push({ field: 'dcPengiriman', message: 'DC Pengiriman wajib diisi.' });
  }

  if (!data.header.dcTujuan?.trim()) {
    errors.push({ field: 'dcTujuan', message: 'DC Tujuan wajib diisi.' });
  }

  // 2. Validasi Daftar DO
  if (!data.dos || data.dos.length === 0) {
    errors.push({ field: 'dos', message: 'Minimal harus ada 1 Delivery Order (DO).' });
    return { isValid: false, errors };
  }

  data.dos.forEach((deliveryOrder, doIndex) => {
    const doLabel = `DO #${doIndex + 1}`;

    if (!deliveryOrder.doNumber?.trim()) {
      errors.push({
        field: `do-${deliveryOrder.id}-doNumber`,
        message: `Nomer DO pada ${doLabel} belum diisi.`,
      });
    }

    if (!deliveryOrder.partnerName?.trim()) {
      errors.push({
        field: `do-${deliveryOrder.id}-partnerName`,
        message: `Partner/Name pada ${doLabel} belum diisi.`,
      });
    }

    if (!deliveryOrder.shuItems || deliveryOrder.shuItems.length === 0) {
      errors.push({
        field: `do-${deliveryOrder.id}-shuItems`,
        message: `${doLabel} minimal harus memiliki 1 SHU.`,
      });
    } else {
      deliveryOrder.shuItems.forEach((shuItem, shuIndex) => {
        const shuLabel = `SHU #${shuIndex + 1} (${doLabel})`;

        if (!shuItem.shu || !String(shuItem.shu).trim()) {
          errors.push({
            field: `shu-${shuItem.id}-shu`,
            message: `Nomor SHU pada ${shuLabel} belum diisi.`,
          });
        }

        // Qoly boleh dikosongi sesuai instruksi operasional
        if (shuItem.qoly !== '' && shuItem.qoly !== null && shuItem.qoly !== undefined) {
          const numQoly = Number(shuItem.qoly);
          if (isNaN(numQoly)) {
            errors.push({
              field: `shu-${shuItem.id}-qoly`,
              message: `Qoly pada ${shuLabel} harus berupa angka valid jika diisi.`,
            });
          } else if (numQoly < 0) {
            errors.push({
              field: `shu-${shuItem.id}-qoly`,
              message: `Qoly pada ${shuLabel} tidak boleh bernilai negatif.`,
            });
          }
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
