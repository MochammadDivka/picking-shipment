import { ShipmentData } from '../types/shipment';

export const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Sample Data dari template Excel (template surat jalan.xlsx)
 */
export const templateSampleData: ShipmentData = {
  header: {
    uniqueCode: '25IC36B',
    date: '2026-09-25',
    truckNumber: 'B. 9361 TXZ',
    dcPengiriman: 'JEMBER',
    dcTujuan: 'BALI',
    jumlahPallet: '',
  },
  dos: [
    {
      id: 'do-1',
      doNumber: 'PM58136676',
      partnerName: 'STOCK-PARAMA DC BALI',
      shuItems: [
        { id: 'shu-1-1', shu: '204500000078006', qoly: 850 },
      ],
    },
    {
      id: 'do-2',
      doNumber: 'PM58136679',
      partnerName: 'STOCK-PARAMA DC BALI',
      shuItems: [
        { id: 'shu-2-1', shu: '204500000078095', qoly: 9 },
      ],
    },
    {
      id: 'do-3',
      doNumber: 'PM58136683',
      partnerName: 'STOCK-PARAMA DC BALI',
      shuItems: [
        { id: 'shu-3-1', shu: '204500000078105', qoly: 170 },
      ],
    },
    {
      id: 'do-4',
      doNumber: 'PM58137737',
      partnerName: 'STOCK-PARAMA DC MATARAM',
      shuItems: [
        { id: 'shu-4-1', shu: '204500000078427', qoly: 1200 },
      ],
    },
    {
      id: 'do-5',
      doNumber: 'PM58137741',
      partnerName: 'STOCK-PARAMA DC MATARAM',
      shuItems: [
        { id: 'shu-5-1', shu: '204500000078419', qoly: 402 },
      ],
    },
  ],
};

/**
 * Sample Data khusus menguji Multi-SHU per DO (sesuai Requirement 2 & 8)
 */
export const multiSHUSampleData: ShipmentData = {
  header: {
    uniqueCode: '26EXP01',
    date: '2026-09-27',
    truckNumber: 'DK 8821 FB',
    dcPengiriman: 'SURABAYA',
    dcTujuan: 'BALI',
    jumlahPallet: '12 Pallet',
  },
  dos: [
    {
      id: 'mdo-1',
      doNumber: 'PM58136676',
      partnerName: 'STOCK-PARAMA DC BALI',
      shuItems: [
        { id: 'mshu-1-1', shu: '204500000078006', qoly: 500 },
        { id: 'mshu-1-2', shu: '204500000078007', qoly: 350 },
        { id: 'mshu-1-3', shu: '204500000078008', qoly: 100 },
      ],
    },
    {
      id: 'mdo-2',
      doNumber: 'PM58136680',
      partnerName: 'STOCK-PARAMA DC BALI',
      shuItems: [
        { id: 'mshu-2-1', shu: '204500000078210', qoly: 240 },
        { id: 'mshu-2-2', shu: '204500000078211', qoly: 160 },
      ],
    },
    {
      id: 'mdo-3',
      doNumber: 'PM58137750',
      partnerName: 'STOCK-PARAMA DC MATARAM',
      shuItems: [
        { id: 'mshu-3-1', shu: '204500000078900', qoly: 950 },
      ],
    },
  ],
};

export const createEmptyShipmentData = (): ShipmentData => ({
  header: {
    uniqueCode: '',
    date: '',
    truckNumber: '',
    dcPengiriman: '',
    dcTujuan: '',
    jumlahPallet: '',
    driverName: '',
    securityName: '',
    penerimaName: '',
  },
  dos: [
    {
      id: `do-${Date.now()}`,
      doNumber: '',
      partnerName: '',
      shuItems: [
        { id: `shu-${Date.now()}-1`, shu: '', qoly: '' },
      ],
    },
  ],
});
