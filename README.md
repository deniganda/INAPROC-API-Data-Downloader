# INAPROC API Data Downloader
Website sederhana untuk mengambil data pengadaan dari INAPROC API Gateway dan mengunduhnya sebagai CSV.

## Cara Kerja
- Ambil data sesuai endpoint dan parameter yang diisi.
- Untuk endpoint yang pakai cursor, aplikasi akan lanjut otomatis ke halaman berikutnya.
- Jika server bilang “masih ada data” tapi tidak memberi cursor, aplikasi akan coba ulang maksimal 5 kali dengan jeda 5 detik.
- Kalau tetap gagal, status akan tampil gagal dan kamu bisa coba ulang.
- Mau lihat alasan gagal? Aktifkan `Debug logging` lalu cek Console di DevTools (F12).

Live Demo: https://inaproc-api-downloader.vercel.app

## Cara Menjalankan Secara Lokal
1) Download source code:
   - Opsi Git: `git clone https://github.com/deniganda/INAPROC-API-Downloader.git`
   - Opsi ZIP: buka repo di GitHub, klik `Code` lalu pilih `Download ZIP`.
2) Pastikan file `index.html` sudah ada di komputer.
3) Buka `index.html` langsung di browser (double click)

## Cara Penggunaan
1) Isi token API dari https://data.inaproc.id/portal/
2) Pilih endpoint data.
3) Isi parameter yang tersedia.
4) Klik `Show Data` untuk menampilkan data atau `Download Data` untuk mengunduh CSV.
