# PRODUCT REQUIREMENTS DOCUMENT
## JD Music Entertainment — Website Rebranding
> **Vendor Jasa Hiburan Musik & Undangan Digital**

| Atribut | Detail |
|---|---|
| **Versi Dokumen** | 1.0.0 |
| **Tanggal** | 31 Mei 2025 |
| **Status** | Draft — Untuk Implementasi |
| **Penulis** | Sistem Informasi — JD Music |
| **Platform** | Web Application |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Flow](#6-user-flow)
7. [Tech Stack Rekomendasi](#7-tech-stack-rekomendasi)
8. [Milestone & Prioritas Pengembangan](#8-milestone--prioritas-pengembangan)
9. [Asumsi & Batasan](#9-asumsi--batasan)
10. [Design Identity & Visual Guidelines](#10-design-identity-&-visual-guidelines)
11. [Glosarium](#10-glosarium)

---

## 1. Ringkasan Eksekutif

JD Music Entertainment adalah vendor jasa hiburan musik (live band) yang berspesialisasi pada acara pernikahan. Dokumen ini mendefinisikan kebutuhan produk untuk pembangunan website baru yang bertujuan untuk:

- Melakukan rebranding website agar tampil lebih profesional dan terpercaya
- Meningkatkan tingkat konversi booking dari pengunjung website
- Mengintegrasikan layanan undangan digital sebagai produk bundling
- Menyederhanakan proses booking via konfirmasi WhatsApp admin

> **Pernyataan Masalah**
>
> Saat ini JD Music Entertainment belum memiliki platform digital yang memadai untuk memperlihatkan portofolio, menjelaskan paket layanan, dan memfasilitasi proses pemesanan secara efisien. Potensi klien kesulitan menemukan informasi lengkap dan melakukan booking tanpa proses manual yang panjang.

---

## 2. User Personas

Berdasarkan analisis target pasar JD Music Entertainment, berikut adalah tiga persona utama pengguna website:

### 2.1 Persona 1 — Calon Pengantin

| Atribut | Detail |
|---|---|
| **Nama Representatif** | Anisa Rahmawati |
| **Usia** | 24–32 tahun |
| **Pekerjaan** | Karyawan swasta / profesional muda |
| **Lokasi** | Kota besar (Bandung, Jakarta, Tasikmalaya) |
| **Tech Savviness** | Menengah–Tinggi (aktif media sosial, familiar e-commerce) |
| **Motivasi** | Mencari hiburan berkualitas untuk hari pernikahannya dengan harga transparan |
| **Pain Points** | Bingung membandingkan paket, takut harga tidak sesuai, butuh kepastian jadwal |
| **Goals** | Menemukan paket yang sesuai budget, memesan dengan mudah, mendapat konfirmasi cepat |
| **Perilaku** | Riset via Instagram/Google, membandingkan 2–3 vendor sebelum memutuskan |

### 2.2 Persona 2 — Panitia/Event Organizer

| Atribut | Detail |
|---|---|
| **Nama Representatif** | Budi Santoso |
| **Usia** | 28–45 tahun |
| **Pekerjaan** | Event Organizer profesional / Wedding Planner |
| **Motivasi** | Mencari vendor hiburan andal untuk kliennya dengan proses booking yang efisien |
| **Pain Points** | Butuh informasi teknis lengkap (rider, kebutuhan venue), proses koordinasi yang simpel |
| **Goals** | Mendapatkan penawaran cepat, konfirmasi ketersediaan jadwal, dan invoice yang rapi |
| **Perilaku** | Langsung ke halaman paket, menghubungi via WhatsApp, berulang kali memesan |

### 2.3 Persona 3 — Klien Undangan Digital

| Atribut | Detail |
|---|---|
| **Nama Representatif** | Siti Nurhaliza |
| **Usia** | 22–35 tahun |
| **Pekerjaan** | Beragam (tidak terbatas pada klien musik) |
| **Motivasi** | Hanya membutuhkan undangan digital tanpa layanan hiburan musik |
| **Pain Points** | Bingung membedakan layanan bundling vs standalone undangan |
| **Goals** | Memesan undangan digital dengan harga terjangkau dan proses yang mudah |
| **Perilaku** | Mencari via Google, referensi dari teman, membandingkan desain dan harga |

---

## 3. User Stories

User stories ditulis dalam format: *Sebagai [peran], saya ingin [fitur], sehingga [manfaat].*

### 3.1 Landing Page & Profil

1. Sebagai calon klien, saya ingin melihat video highlight pertunjukan di hero section, sehingga saya bisa langsung menilai kualitas band.
2. Sebagai calon klien, saya ingin membaca profil singkat JD Music Entertainment, sehingga saya mengetahui pengalaman dan keahlian vendor.
3. Sebagai calon klien, saya ingin melihat testimoni pelanggan sebelumnya, sehingga saya merasa yakin untuk memesan.
4. Sebagai calon klien, saya ingin melihat galeri foto/video acara sebelumnya, sehingga saya mendapat gambaran hasil kerja.

### 3.2 Pricelist & Paket

5. Sebagai calon klien, saya ingin melihat semua paket beserta harganya dalam satu halaman, sehingga saya bisa membandingkan dan memilih yang sesuai.
6. Sebagai calon klien, saya ingin melihat detail isi setiap paket (jumlah personil, durasi, peralatan), sehingga saya memahami apa yang saya bayar.
7. Sebagai calon klien, saya ingin melihat paket yang paling populer ditandai secara visual, sehingga saya mendapat rekomendasi terbaik.
8. Sebagai event organizer, saya ingin mengunduh pricelist dalam format PDF, sehingga bisa saya bagikan ke klien saya.

### 3.3 Bundle System & Add-on

9. Sebagai calon klien, saya ingin menambahkan layanan undangan digital ke paket musik pilihan saya, sehingga saya mendapat layanan lengkap dalam satu transaksi.
10. Sebagai calon klien, saya ingin melihat perhitungan harga bundle secara real-time saat saya memilih add-on, sehingga saya tahu total biaya sebelum booking.
11. Sebagai calon klien, saya ingin melihat preview desain undangan digital yang tersedia, sehingga saya bisa memilih sesuai selera.

### 3.4 Sistem Booking & Konfirmasi

12. Sebagai calon klien, saya ingin mengisi form booking dengan detail acara (tanggal, venue, nama), sehingga admin bisa memproses pesanan saya.
13. Sebagai calon klien, saya ingin mendapatkan ringkasan pesanan sebelum mengirim, sehingga saya bisa memverifikasi kebenaran data.
14. Sebagai calon klien, saya ingin ringkasan pesanan saya terkirim ke WhatsApp admin secara otomatis, sehingga proses konfirmasi bisa berlangsung cepat.
15. Sebagai admin, saya ingin menerima pesan WhatsApp terstruktur berisi detail pesanan, sehingga saya bisa dengan mudah memverifikasi ketersediaan jadwal.
16. Sebagai calon klien, saya ingin diarahkan ke halaman "Booking Terkirim" setelah submit, sehingga saya tahu proses sudah berhasil.

### 3.5 Undangan Digital Mandiri

17. Sebagai klien yang hanya butuh undangan digital, saya ingin melihat opsi pemesanan undangan saja tanpa harus memilih paket musik, sehingga prosesnya tidak membingungkan.
18. Sebagai klien undangan digital, saya ingin memilih template desain undangan, sehingga hasilnya sesuai tema pernikahan saya.
19. Sebagai klien undangan digital, saya ingin mengisi form dengan data pernikahan (nama, tanggal, lokasi), sehingga undangan langsung terpersonalisasi.

---

## 4. Functional Requirements

Kebutuhan fungsional dibagi berdasarkan modul sistem dan lapisan arsitektur (Front-end & Back-end).

### 4.1 Modul Landing Page

**Front-end**

- **Hero Section:** Video background atau embed video YouTube/Vimeo dengan overlay teks tagline dan CTA button "Lihat Paket" dan "Hubungi Kami".
- **Navigation Bar:** Sticky navbar dengan logo, menu (Beranda, Paket, Undangan, Booking, Kontak), dan tombol CTA "Pesan Sekarang". Responsif mobile dengan hamburger menu.
- **About Section:** Foto/video profil band, deskripsi singkat, angka statistik (jumlah acara, tahun pengalaman).
- **Galeri:** Grid foto/video responsif dengan lightbox viewer. Mendukung kategorisasi (Wedding, Corporate, Prewedding).
- **Testimoni:** Carousel atau grid card berisi nama klien, foto, rating bintang, dan kutipan ulasan.
- **Footer:** Informasi kontak, link media sosial, dan copyright.

---

### 4.2 Modul Pricelist & Paket

**Front-end**

- **Tampilan Card Paket:** Setiap paket ditampilkan dalam card dengan nama paket, harga, daftar fitur (checklist), dan tombol "Pilih Paket". Card paket populer diberi badge atau highlight khusus.
- **Paket yang tersedia (minimal):** Acoustic Package, Full Band Package, Premium Full Band Package.
- **Detail Modal/Page:** Klik kartu paket membuka detail lengkap berisi jumlah personil, instrumen, durasi penampilan, area jangkauan, dan syarat teknis.
- **Filter/Sorting:** Pengguna dapat memfilter paket berdasarkan kisaran harga atau jenis acara.

**Back-end / Data**

- Data paket disimpan dalam struktur JSON/database yang mudah diperbarui admin tanpa coding.
- CMS sederhana atau file konfigurasi untuk manajemen konten paket.

---

### 4.3 Modul Bundle System

**Front-end**

- **Add-on Selector:** Setelah memilih paket musik, muncul opsi toggle/checkbox "Tambahkan Undangan Digital".
- **Pemilihan Tema Undangan:** Carousel atau grid preview desain undangan digital yang tersedia (minimal 5 tema).
- **Price Calculator:** Komponen yang menampilkan rincian harga secara real-time (Harga Paket + Harga Add-on = Total).
- **Summary Panel:** Panel sticky atau section ringkasan di sisi kanan/bawah yang menampilkan pilihan aktif dan total harga.

**Logika Bisnis**

- Klien dapat memilih: (a) Paket Musik saja, (b) Paket Musik + Undangan Digital (bundle diskon), (c) Undangan Digital saja.
- Harga bundle menerapkan logika diskon yang dapat dikonfigurasi (misal: hemat Rp 100.000 vs beli terpisah).

---

### 4.4 Modul Booking & Konfirmasi WhatsApp

**Form Booking — Front-end**

- Field wajib: Nama lengkap, nomor WhatsApp, tanggal acara (date picker), lokasi/venue acara, paket yang dipilih, add-on (jika ada), catatan tambahan.
- Validasi form real-time: format nomor telepon, tanggal minimal H+14, field wajib tidak kosong.
- Order Review Page: Halaman ringkasan sebelum submit menampilkan semua pilihan dan total estimasi biaya.
- Konfirmasi visual setelah submit dengan status "Pesanan Terkirim" dan instruksi selanjutnya.

**Integrasi WhatsApp — Front-end / API**

- Setelah submit, sistem generate URL WhatsApp (`wa.me`) dengan pesan terstruktur berformat template yang ditetapkan.
- Format pesan WhatsApp harus mencakup: identitas klien, tanggal & lokasi acara, paket dipilih, add-on, estimasi harga, dan catatan.
- Tombol "Kirim via WhatsApp" membuka aplikasi WhatsApp dengan pesan sudah terisi otomatis ke nomor admin.
- *(Opsional lanjutan)* Integrasi WhatsApp Business API (Twilio/Fonnte) untuk pengiriman otomatis tanpa interaksi manual klien.

**Back-end**

- Menyimpan log setiap submission booking ke database (nama, tanggal, paket, status: "Menunggu Konfirmasi").
- Admin dashboard sederhana untuk melihat daftar booking masuk dan mengubah status (Menunggu / Dikonfirmasi / Ditolak).

---

### 4.5 Modul Undangan Digital Mandiri

**Front-end**

- Halaman khusus `/undangan` atau `/invitation` yang dapat diakses dari navigasi utama.
- Pilihan tema undangan dengan preview live yang dapat di-scroll.
- Form pemesanan undangan: nama mempelai pria & wanita, tanggal akad, tanggal resepsi, lokasi, jadwal, foto pasangan (upload), dan link Google Maps.
- Estimasi harga ditampilkan sebelum submit.

**Back-end**

- Endpoint untuk menerima data form undangan dan menyimpan ke database.
- Trigger pengiriman ringkasan ke WhatsApp admin dengan format yang sama seperti booking musik.

---

## 5. Non-Functional Requirements

### 5.1 Performa

| Metrik | Target |
|---|---|
| Page Load Time (LCP) | ≤ 2.5 detik pada koneksi 4G |
| First Contentful Paint (FCP) | ≤ 1.5 detik |
| Time to Interactive (TTI) | ≤ 3.5 detik |
| Lighthouse Performance Score | ≥ 85 (Mobile) / ≥ 90 (Desktop) |
| Image Optimization | Format WebP/AVIF, lazy loading, max 200KB per gambar |
| Video | Embed eksternal (YouTube/Vimeo), bukan host sendiri |
| Uptime | ≥ 99.5% per bulan |

### 5.2 Keamanan

- HTTPS wajib pada seluruh halaman (SSL Certificate terpasang).
- Validasi dan sanitasi semua input form di sisi server untuk mencegah XSS dan SQL Injection.
- Rate limiting pada endpoint form booking (maks 5 submission per IP per jam) untuk mencegah spam.
- Data nomor WhatsApp dan informasi pribadi klien tidak ditampilkan secara publik.
- CSRF protection pada semua form POST request.
- Backup database otomatis minimal 1x sehari, disimpan minimal 7 hari terakhir.

### 5.3 Responsivitas & Kompatibilitas

- Mobile-first design: tampilan optimal pada layar 360px–12 inci.
- Breakpoint: Mobile (< 768px), Tablet (768px–1024px), Desktop (> 1024px).
- Kompatibel dengan browser: Chrome, Firefox, Safari, dan Edge versi 2 tahun terakhir.
- Mendukung mode landscape pada perangkat mobile.

### 5.4 Skalabilitas

- Arsitektur berbasis komponen (React/Vue/Next.js) yang memudahkan penambahan paket atau fitur baru tanpa refaktor besar.
- Database relasional (MySQL/PostgreSQL) atau NoSQL (Firebase/Supabase) yang mendukung penambahan tabel/koleksi baru.
- Infrastruktur cloud (Vercel, Netlify, atau VPS) yang dapat di-scale up sesuai kebutuhan traffic.
- Konten paket dan harga dapat diperbarui admin melalui CMS atau file konfigurasi tanpa deploy ulang.

### 5.5 Aksesibilitas & SEO

- Semantic HTML5: penggunaan tag `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` yang benar.
- Alt text wajib pada semua elemen `<img>`.
- Meta tag lengkap: title, description, Open Graph untuk share media sosial.
- Schema markup untuk Local Business (nama, alamat, nomor telepon, jenis layanan).
- Sitemap XML otomatis dan `robots.txt` yang benar.
- Minimal kontras warna 4.5:1 (WCAG AA) untuk keterbacaan teks.

---

## 6. User Flow

Alur berikut menggambarkan perjalanan pengguna dari pertama mengunjungi website hingga konfirmasi booking via WhatsApp.

### 6.1 Flow A: Booking Paket Musik (Tanpa Add-on)

| # | Langkah | Deskripsi Aksi & Sistem |
|---|---|---|
| 1 | Kedatangan | Pengguna mendarat di Homepage melalui Google/Instagram/referensi. |
| 2 | Eksplorasi Hero | Menonton video hero section, membaca tagline, klik CTA "Lihat Paket". |
| 3 | Halaman Paket | Sistem menampilkan kartu semua paket. Pengguna membaca dan membandingkan. |
| 4 | Pilih Paket | Pengguna klik tombol "Pilih Paket" pada kartu yang diminati. |
| 5 | Add-on Screen | Sistem menampilkan opsi Add-on Undangan Digital. Pengguna memilih "Lewati, lanjut tanpa add-on". |
| 6 | Form Booking | Pengguna mengisi form: nama, WhatsApp, tanggal, venue, catatan. Sistem validasi real-time. |
| 7 | Review Pesanan | Sistem menampilkan halaman ringkasan pesanan. Pengguna verifikasi semua data. |
| 8 | Submit Booking | Pengguna klik "Kirim Pesanan". Sistem menyimpan data ke database, generate pesan WA terstruktur. |
| 9 | Redirect WhatsApp | Browser membuka WhatsApp dengan pesan booking sudah terisi ke nomor admin. |
| 10 | Konfirmasi Admin | Admin menerima pesan, mengecek ketersediaan jadwal, membalas konfirmasi/penolakan via WhatsApp. |
| 11 | Sukses | Pengguna menerima konfirmasi admin dan melanjutkan ke proses DP/kontrak. |

### 6.2 Flow B: Booking Paket Musik + Undangan Digital (Bundle)

| # | Langkah | Deskripsi Aksi & Sistem |
|---|---|---|
| 1–4 | (sama) | Sama dengan Flow A (Kedatangan → Pilih Paket Musik). |
| 5 | Add-on Screen | Sistem menampilkan opsi add-on. Pengguna memilih "Tambahkan Undangan Digital". |
| 6 | Pilih Tema Undangan | Sistem menampilkan galeri tema. Pengguna memilih satu tema. Harga bundle ditampilkan real-time. |
| 7 | Form Booking | Pengguna mengisi form booking + form data undangan (nama mempelai, tanggal, dll). |
| 8–11 | (sama) | Sama dengan Flow A (Review → Submit → WhatsApp → Konfirmasi Admin). |

### 6.3 Flow C: Pemesanan Undangan Digital Mandiri

| # | Langkah | Deskripsi Aksi & Sistem |
|---|---|---|
| 1 | Kedatangan | Pengguna mendarat di Homepage atau langsung ke halaman `/undangan`. |
| 2 | Halaman Undangan | Sistem menampilkan halaman undangan dengan penjelasan layanan, harga, dan pilihan tema. |
| 3 | Pilih Tema | Pengguna memilih tema undangan dan melihat preview live. |
| 4 | Form Undangan | Pengguna mengisi form: nama mempelai, tanggal, venue, upload foto, Google Maps link. |
| 5 | Review & Harga | Sistem menampilkan ringkasan pesanan undangan dan estimasi biaya. |
| 6 | Submit | Pengguna submit form. Sistem menyimpan ke database dan generate pesan WA terstruktur. |
| 7 | Redirect WhatsApp | Browser membuka WhatsApp ke admin dengan pesan detail pesanan undangan. |
| 8 | Konfirmasi Admin | Admin merespons via WhatsApp untuk konfirmasi, revisi, dan pengiriman draft undangan. |

### 6.4 Template Pesan WhatsApp Admin

Berikut adalah format pesan WhatsApp yang diterima admin setelah setiap submission booking:

```
Halo Admin JD Music! Ada pesanan masuk:

📅 DETAIL PESANAN
Nama       : [Nama Klien]
WhatsApp   : [Nomor WA Klien]
Tanggal    : [DD/MM/YYYY]
Venue      : [Nama & Alamat Venue]

🎵 PAKET DIPILIH
Paket      : [Nama Paket]
Add-on     : [Undangan Digital / -]
Tema Undgn : [Nama Tema / -]
Estimasi   : Rp [Total Harga]

📝 Catatan    : [Catatan Tambahan Klien]

Mohon konfirmasi ketersediaan jadwal. Terima kasih!
```

---

## 7. Tech Stack Rekomendasi

Rekomendasi teknologi disesuaikan untuk konteks mahasiswa Sistem Informasi yang akan mengimplementasikan sendiri:

| Layer | Teknologi Rekomendasi |
|---|---|
| **Front-end Framework** | Next.js 14 (React) atau Nuxt.js (Vue.js) |
| **Styling** | Tailwind CSS — utility-first, cepat untuk responsive design |
| **Animasi** | Framer Motion atau CSS Transitions natif |
| **State Management** | Zustand (React) atau Pinia (Vue) — ringan untuk skala ini |
| **Database** | Supabase (PostgreSQL) — gratis tier, ada auth, real-time, REST API |
| **File Storage** | Supabase Storage atau Cloudinary (untuk gambar/foto) |
| **Deployment** | Vercel (gratis untuk proyek personal/portfolio) |
| **WhatsApp Integration** | `wa.me` URL scheme (sederhana) atau Fonnte API (advanced) |
| **Form Validation** | React Hook Form + Zod / VeeValidate + Yup |
| **CMS Konten** | Sanity.io atau Notion API (opsional, untuk non-dev content update) |

### 7.1 Catatan Implementasi

- Mulai dengan pendekatan **MVP**: Landing Page + Pricelist + Form Booking WhatsApp terlebih dahulu.
- Bundle System dapat diimplementasikan sebagai enhancement di iterasi kedua setelah core flow selesai.
- Admin dashboard dapat menggunakan Supabase Studio sebagai pengganti sementara sebelum custom dashboard dibangun.
- Simpan nomor WhatsApp admin sebagai **environment variable**, bukan hardcode di frontend.

---

## 8. Milestone & Prioritas Pengembangan

| Fase | Fitur & Deliverable | Prioritas |
|---|---|---|
| **Fase 1 — Core (MVP)** | Landing Page, Hero Section, About, Testimoni, Footer | `P0 — Kritis` |
| **Fase 1 — Core (MVP)** | Halaman Pricelist dengan Card Paket statis | `P0 — Kritis` |
| **Fase 1 — Core (MVP)** | Form Booking + Redirect WhatsApp terstruktur | `P0 — Kritis` |
| **Fase 2 — Enhanced** | Bundle System dengan Add-on Selector & Price Calculator | `P1 — Tinggi` |
| **Fase 2 — Enhanced** | Halaman Undangan Digital Mandiri | `P1 — Tinggi` |
| **Fase 2 — Enhanced** | Galeri interaktif dengan lightbox | `P1 — Tinggi` |
| **Fase 3 — Advanced** | Admin Dashboard untuk manajemen booking | `P2 — Menengah` |
| **Fase 3 — Advanced** | Integrasi WhatsApp Business API (otomatis) | `P2 — Menengah` |
| **Fase 3 — Advanced** | CMS untuk update konten paket tanpa coding | `P2 — Menengah` |
| **Fase 4 — Optional** | Preview live undangan digital di browser | `P3 — Opsional` |
| **Fase 4 — Optional** | Download PDF pricelist otomatis | `P3 — Opsional` |

---

## 9. Asumsi & Batasan

### 9.1 Asumsi

- Admin memiliki akun WhatsApp Business yang aktif dan responsif dalam jam kerja.
- Ketersediaan jadwal diverifikasi secara manual oleh admin melalui WhatsApp (bukan sistem kalender otomatis di Fase 1–2).
- Harga paket dalam mata uang Rupiah (IDR) dan dapat berubah sewaktu-waktu oleh admin.
- Website ditujukan untuk wilayah Indonesia dan menggunakan bahasa Indonesia sebagai bahasa utama.

### 9.2 Batasan *(Out of Scope)*

- **Pembayaran online (payment gateway)** — tidak termasuk dalam scope proyek ini. Pembayaran dilakukan di luar sistem (transfer bank, cash).
- **Sistem kalender otomatis** untuk blokir tanggal — dijadwalkan sebagai enhancement masa depan.
- **Aplikasi mobile native** (iOS/Android) — website mengutamakan mobile-responsive web.
- **Multi-bahasa** (Bahasa Inggris) — tidak termasuk scope awal.

---

## 10. Design Identity & Visual Guidelines
Untuk menjaga konsistensi *brand*, desain website harus merujuk pada identitas visual yang sudah ada di Instagram (contoh: @jdmusic_ent).

*   **Color Palette:**
    *   Primary: Deep Navy Blue (Warna latar belakang logo).
    *   Secondary: Metallic Silver (Warna ikon logo).
    *   Accent: [Sebutkan warna aksen jika ada, misal Gold atau Electric Blue].
*   **Logo Usage:**
    *   Gunakan aset logo 3D terbaru yang telah dirender.
    *   Logo harus responsif dan terlihat jelas di mode *dark* maupun *light*.
*   **Typography:**
    *   Gunakan font yang clean dan modern (misal: Montserrat atau Poppins) agar selaras dengan kesan profesional band wedding.
*   **Vibe & Tone:**
    *   Professional, Elegan, dan *Tech-Savvy*.
    *   Elemen visual harus mencerminkan kesan "Modern Music Entertainment" (seperti penggunaan *star-field* atau *bokeh* sesuai aset logo).

---

## 11. Glosarium

| Istilah | Definisi |
|---|---|
| **Bundle** | Paket gabungan antara layanan musik live band + undangan digital dengan harga spesial. |
| **Add-on** | Layanan tambahan (undangan digital) yang bisa dipilih saat memesan paket musik. |
| **WhatsApp Redirect** | Mekanisme pengalihan browser ke aplikasi WhatsApp dengan pesan yang sudah terisi otomatis. |
| **CTA (Call-to-Action)** | Tombol atau elemen yang mendorong pengguna untuk mengambil tindakan (misal: "Pesan Sekarang"). |
| **MVP (Minimum Viable Product)** | Versi paling sederhana dari produk yang sudah dapat digunakan dan memenuhi kebutuhan dasar. |
| **LCP (Largest Contentful Paint)** | Metrik performa web yang mengukur waktu muat elemen konten terbesar terlihat di layar. |
| **Rider** | Daftar teknis kebutuhan panggung dan peralatan yang dibutuhkan band untuk tampil. |


---

*— Akhir Dokumen PRD v1.0.0 — JD Music Entertainment —*
