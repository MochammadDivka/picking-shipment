# Picking Shipment Generator

Aplikasi web modern dan presisi untuk membuat, mengelola, mencetak, serta mengekspor dokumen **Surat Jalan / Picking Shipment** standar operasional distribusi DC (Distribution Center).

## Fitur Utama

- **Tata Letak Presisi 1 Halaman A4**: Dirancang agar seluruh tabel dokumen (hingga 50 baris DO/SHU + total + tanda tangan) pas tercetak dalam 1 lembar A4 portrait tanpa terpotong.
- **Ekspor Dokumen Resmi**:
  - **PDF (.pdf)**: Menggunakan tabel berkelanjutan presisi tinggi dengan jsPDF & autoTable.
  - **Excel (.xlsx)**: Menggunakan template asli spreadsheet dengan rumus dinamis `=SUM(E8:E57)`.
- **Desain Minimalis & Responsif**: Tampilan antarmuka clean, modern, dan intuitif tanpa ornamen berlebih (*anti-AI slop*).
- **Preview Real-time**: Pratinjau langsung lembar A4 dengan kontrol zoom interaktif.
- **Siap Deploy ke Netlify**: Dilengkapi konfigurasi `netlify.toml` untuk *single-page application* (SPA).

## Teknologi

- React 18 + TypeScript
- Vite
- Tailwind CSS
- jsPDF & jsPDF-AutoTable
- ExcelJS
- Lucide React Icons

## Panduan Menjalankan Lokal

```bash
# Install dependensi
npm install

# Jalankan server development
npm run dev

# Build untuk produksi
npm run build
```

## Panduan Deploy ke Netlify

Aplikasi ini sudah dilengkapi dengan file `netlify.toml`:
1. Push repositori ini ke GitHub / GitLab.
2. Buka [Netlify](https://app.netlify.com/) dan pilih **Add new site** > **Import an existing project**.
3. Hubungkan repositori GitHub Anda.
4. Netlify akan otomatis membaca konfigurasi `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Klik **Deploy site**.
