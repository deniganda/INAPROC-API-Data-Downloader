# INAPROC API Data Downloader
Website sederhana untuk mengambil data pengadaan dari INAPROC API Gateway dan mengunduhnya sebagai CSV.

## Cara Kerja
- Ambil data sesuai endpoint dan parameter yang diisi.
- Untuk endpoint yang pakai cursor, aplikasi akan lanjut otomatis ke halaman berikutnya.
- Jika server bilang “masih ada data” tapi tidak memberi cursor, aplikasi akan coba ulang maksimal 5 kali dengan jeda 5 detik.
- Kalau tetap gagal, status akan tampil gagal dan kamu bisa coba ulang.
- Mau lihat alasan gagal? Aktifkan `Debug logging` lalu cek Console di DevTools (F12).

## Cara Menjalankan Secara Lokal
1) Download source code:
   - Opsi Git: `git clone https://github.com/deniganda/INAPROC-API-Downloader.git`
   - Opsi ZIP: buka repo di GitHub, klik `Code` lalu pilih `Download ZIP`.
2) Install Node.js jika belum ada:
   - Download installer dari https://nodejs.org/
   - Atau install lewat package manager OS masing-masing
   - Verifikasi dengan `node -v`
3) Dari folder project, jalankan `node server.js`
4) Buka `http://127.0.0.1:3000` di browser

Catatan:
- Halaman ini memakai proxy lokal di `/proxy` agar request ke `https://data.inaproc.id` tidak diblokir CORS.
- Proxy ini bukan pihak ketiga. Yang meneruskan request adalah `server.js` yang Anda jalankan sendiri di mesin atau server Anda.
- Alurnya: browser -> server lokal Anda -> API INAPROC.
- Jangan buka `index.html` langsung via `file://` atau Live Server lain tanpa proxy ini.

## Cara Penggunaan
1) Isi token API dari https://data.inaproc.id/portal/
2) Pilih endpoint data.
3) Isi parameter yang tersedia.
4) Klik `Show Data` untuk menampilkan data atau `Download Data` untuk mengunduh CSV.
