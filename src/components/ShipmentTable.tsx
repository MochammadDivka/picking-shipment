import React from 'react';
import { ShipmentData, DocumentDensity } from '../types/shipment';
import { calculateTotalQoly, formatDateIndo, formatNumber } from '../utils/calculator';

interface ShipmentTableProps {
  data: ShipmentData;
  density?: DocumentDensity;
  isPrintView?: boolean;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  data,
  isPrintView = false,
}) => {
  const totalQoly = calculateTotalQoly(data.dos);
  const formattedDate = formatDateIndo(data.header.date);

  // Hitung jumlah baris data riil
  const totalDataRows = data.dos.reduce(
    (sum, d) => sum + (d.shuItems.length > 0 ? d.shuItems.length : 1),
    0
  );

  // Target 50 baris data (Baris 8 hingga 57) agar tabel mengisi 1 lembar A4 penuh secara konsisten
  const targetTotalRows = 50;
  const emptyRowsCount = Math.max(0, targetTotalRows - totalDataRows);

  return (
    <div
      className={`w-full bg-white text-black font-sans leading-none select-text box-border ${
        isPrintView ? 'p-0' : 'pt-[16pt] px-[16pt] pb-[16pt]'
      }`}
      style={{
        fontFamily: 'Arial, Calibri, sans-serif',
      }}
    >
      {/* TABEL TUNGGAL KONTINU PERSIS SESUAI TEMPLATE SURAT JALAN.PDF */}
      <table
        className="w-full border-collapse border border-black text-black"
        style={{
          borderSpacing: 0,
          tableLayout: 'fixed',
          width: '100%',
        }}
      >
        {/* Rasio lebar kolom persis template PDF (24.4, 81.1, 135.8, 174.0, 144.1) */}
        <colgroup>
          <col style={{ width: '4.36%' }} />
          <col style={{ width: '14.50%' }} />
          <col style={{ width: '24.28%' }} />
          <col style={{ width: '31.10%' }} />
          <col style={{ width: '25.76%' }} />
        </colgroup>

        <tbody>
          {/* ROW 1: Judul "Picking Shipment" (Merged A1:E1) */}
          <tr style={{ height: '14pt' }}>
            <td
              colSpan={5}
              className="text-center font-normal text-[8pt] border border-black align-middle"
              style={{ fontFamily: 'Calibri, Arial, sans-serif' }}
            >
              Picking Shipment
            </td>
          </tr>

          {/* ROW 2: Unique Code */}
          <tr style={{ height: '16pt' }}>
            <td className="border border-black"></td>
            <td className="border border-black px-3 py-0.5 text-[9pt] align-middle">
              Unique Code
            </td>
            <td className="border border-black px-3 py-0.5 text-center font-bold text-[15pt] align-middle tracking-wider">
              {data.header.uniqueCode || ''}
            </td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
          </tr>

          {/* ROW 3: Date */}
          <tr style={{ height: '11.5pt' }}>
            <td className="border border-black"></td>
            <td className="border border-black px-3 py-0.5 text-[9pt] align-middle">
              Date
            </td>
            <td className="border border-black px-3 py-0.5 text-[10pt] align-middle">
              {formattedDate || ''}
            </td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
          </tr>

          {/* ROW 4: No.Pol Truck */}
          <tr style={{ height: '12pt' }}>
            <td className="border border-black"></td>
            <td className="border border-black px-3 py-0.5 text-[9pt] align-middle">
              No.Pol Truck
            </td>
            <td className="border border-black px-3 py-0.5 text-[10pt] align-middle" style={{ fontFamily: 'Times New Roman, serif' }}>
              {data.header.truckNumber || ''}
            </td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
          </tr>

          {/* ROW 5: DC Pengiriman (tidak di-bold, padding lega) */}
          <tr style={{ height: '11.5pt' }}>
            <td className="border border-black"></td>
            <td className="border border-black px-3 py-0.5 text-[9pt] align-middle">
              DC Pengiriman
            </td>
            <td className="border border-black px-3 py-0.5 text-[10pt] align-middle font-normal">
              {data.header.dcPengiriman || ''}
            </td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
          </tr>

          {/* ROW 6: DC Tujuan (tidak di-bold, padding lega) */}
          <tr style={{ height: '11.5pt' }}>
            <td className="border border-black"></td>
            <td className="border border-black px-3 py-0.5 text-[9pt] align-middle">
              DC Tujuan
            </td>
            <td className="border border-black px-3 py-0.5 text-[10pt] align-middle font-normal">
              {data.header.dcTujuan || ''}
            </td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
          </tr>

          {/* ROW 7: Table Column Headers (No, Nomer DO, SHU, Partner/Name, Qoly) */}
          <tr style={{ height: '11pt' }}>
            <td className="border border-black text-center text-[7.6pt] font-normal align-middle" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
              No
            </td>
            <td className="border border-black text-center text-[7.6pt] font-normal align-middle" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
              Nomer DO
            </td>
            <td className="border border-black text-center text-[7.6pt] font-normal align-middle" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
              SHU
            </td>
            <td className="border border-black text-center text-[7.6pt] font-normal align-middle" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
              Partner/Name
            </td>
            <td className="border border-black text-center text-[7.6pt] font-normal align-middle" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
              Qoly
            </td>
          </tr>

          {/* ROWS 8..: Data Rows (No & DO di-merge, Partner/Name TIDAK di-merge) */}
          {data.dos.map((deliveryOrder, doIdx) => {
            const shuList = deliveryOrder.shuItems.length > 0
              ? deliveryOrder.shuItems
              : [{ id: 'empty', shu: '', qoly: '' }];
            const shuCount = shuList.length;

            return shuList.map((shuItem, shuIdx) => {
              const isFirst = shuIdx === 0;

              return (
                <tr
                  key={`${deliveryOrder.id}-${shuItem.id}`}
                  style={{ height: '10.5pt' }}
                >
                  {/* Kolom No (rowSpan jika Multi-SHU) */}
                  {isFirst && (
                    <td
                      rowSpan={shuCount}
                      className="border border-black text-center text-[8.5pt] align-middle"
                    >
                      {doIdx + 1}
                    </td>
                  )}

                  {/* Kolom Nomer DO (rowSpan jika Multi-SHU) */}
                  {isFirst && (
                    <td
                      rowSpan={shuCount}
                      className="border border-black text-center text-[8.5pt] align-middle px-1"
                    >
                      {deliveryOrder.doNumber || ''}
                    </td>
                  )}

                  {/* Kolom SHU */}
                  <td className="border border-black text-center text-[8.5pt] align-middle px-1">
                    {shuItem.shu || ''}
                  </td>

                  {/* Kolom Partner/Name (TIDAK di-merge, setiap baris ada sel tersendiri) */}
                  <td className="border border-black text-center text-[8.5pt] align-middle px-1 uppercase">
                    {deliveryOrder.partnerName || ''}
                  </td>

                  {/* Kolom Qoly */}
                  <td className="border border-black text-center text-[8.5pt] align-middle px-1">
                    {shuItem.qoly !== '' && shuItem.qoly !== undefined ? formatNumber(shuItem.qoly) : ''}
                  </td>
                </tr>
              );
            });
          })}

          {/* Baris Kosong Bergaris (Mengisi Tabel Menuju Row TOTAL) */}
          {Array.from({ length: emptyRowsCount }).map((_, idx) => (
            <tr key={`empty-${idx}`} style={{ height: '10.5pt' }}>
              <td className="border border-black">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
            </tr>
          ))}

          {/* ROW 58: TOTAL (Merged A58:D58, E58: Nilai Total) */}
          <tr style={{ height: '11.5pt' }}>
            <td
              colSpan={4}
              className="border border-black text-center text-[9pt] font-normal align-middle"
            >
              TOTAL
            </td>
            <td className="border border-black text-center text-[9pt] font-normal align-middle">
              {formatNumber(totalQoly)}
            </td>
          </tr>

          {/* ROW 59: Jumlah Pallet (Merged A59:D59, E59) */}
          <tr style={{ height: '11.5pt' }}>
            <td
              colSpan={4}
              className="border border-black text-left px-2 text-[8.5pt] font-normal align-middle"
            >
              Jumlah Pallet
            </td>
            <td className="border border-black text-center text-[9pt] align-middle">
              {data.header.jumlahPallet || ''}
            </td>
          </tr>

          {/* ROW 60: Baris Kosong Pemisah */}
          <tr style={{ height: '4.5pt' }}>
            <td className="border border-black">&nbsp;</td>
            <td className="border border-black">&nbsp;</td>
            <td className="border border-black">&nbsp;</td>
            <td className="border border-black">&nbsp;</td>
            <td className="border border-black">&nbsp;</td>
          </tr>

          {/* ROW 61: Judul Jabatan (Col A+B: Driver, Col C: Security RDC, Col D+E: Penerima) */}
          <tr style={{ height: '16pt' }}>
            <td colSpan={2} className="border border-black text-center text-[10pt] font-normal align-middle">
              Driver
            </td>
            <td className="border border-black text-center text-[10pt] font-normal align-middle">
              Security RDC
            </td>
            <td colSpan={2} className="border border-black text-center text-[10pt] font-normal align-middle">
              Penerima
            </td>
          </tr>

          {/* ROWS 62-64: Kotak Tanda Tangan Bergaris Sesuai Template */}
          {[62, 63, 64].map((r) => (
            <tr key={`ttd-row-${r}`} style={{ height: '14pt' }}>
              <td colSpan={2} className="border border-black">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
              <td colSpan={2} className="border border-black">&nbsp;</td>
            </tr>
          ))}

          {/* ROW 65: Slot Nama Terang */}
          <tr style={{ height: '18pt' }}>
            <td colSpan={2} className="border border-black text-center text-[8.5pt] align-middle px-1">
              ( {data.header.driverName ? data.header.driverName : '.........................................'} )
            </td>
            <td className="border border-black text-center text-[8.5pt] align-middle px-1">
              ( {data.header.securityName ? data.header.securityName : '.........................................'} )
            </td>
            <td colSpan={2} className="border border-black text-center text-[8.5pt] align-middle px-1">
              ( {data.header.penerimaName ? data.header.penerimaName : '.........................................'} )
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
