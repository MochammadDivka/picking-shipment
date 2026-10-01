export interface SHUItem {
  id: string;
  shu: string;
  qoly: number | string | '';
}

export interface DeliveryOrder {
  id: string;
  doNumber: string;
  partnerName: string;
  shuItems: SHUItem[];
}

export interface ShipmentHeaderData {
  uniqueCode: string;
  date: string; // YYYY-MM-DD
  truckNumber: string;
  dcPengiriman: string;
  dcTujuan: string;
  jumlahPallet?: string;
  driverName?: string;
  securityName?: string;
  penerimaName?: string;
}

export interface ShipmentData {
  header: ShipmentHeaderData;
  dos: DeliveryOrder[];
}

export interface FlattenedShipmentRow {
  rowId: string;
  doIndex: number;
  doId: string;
  doNumber: string;
  partnerName: string;
  shuId: string;
  shu: string;
  qoly: number | string | '';
  isFirstSHUOfDO: boolean;
  shuCountInDO: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type DocumentDensity = 'spacious' | 'normal' | 'compact' | 'ultra-compact' | 'exceeded';
