# Nuonline Node.js Starter App

Starter app Node.js sederhana untuk di-host di Vercel dengan endpoint Midtrans payment callback.

## Cara Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## Endpoint yang Tersedia

### 1. API Utama

- `GET /api` - Test koneksi backend
- `POST /api` - Membuat transaksi Midtrans
- `GET /api/scrape-bahtsul-masail` - Scraping berita Bahtsul Masail

### 2. Payment Callback Endpoints

- `GET /api/payment/finish` - Callback pembayaran berhasil
- `GET /api/payment/error` - Callback pembayaran gagal
- `GET /api/payment/pending` - Callback pembayaran pending
- `GET /api/payment/cancel` - Callback pembayaran dibatalkan
- `POST /api/payment/notification` - Webhook notification Midtrans

## Konfigurasi Environment Variables

Buat file `.env` dengan variabel berikut:

```env
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
```

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Hubungkan repo ke Vercel dan deploy.
3. Set environment variable `MIDTRANS_SERVER_KEY` di dashboard Vercel.

Secara default, Vercel akan menjalankan perintah `npm start`.

## Callback URLs untuk Midtrans

Setelah deploy, gunakan URL berikut di konfigurasi Midtrans:

- **Finish URL**: `https://your-domain.vercel.app/api/payment/finish`
- **Error URL**: `https://your-domain.vercel.app/api/payment/error`
- **Pending URL**: `https://your-domain.vercel.app/api/payment/pending`
- **Cancel URL**: `https://your-domain.vercel.app/api/payment/cancel`
- **Notification URL**: `https://your-domain.vercel.app/api/payment/notification`

## Logging

Semua callback akan di-log dengan detail:

- Query parameters
- Request body
- Headers
- Transaction details
- Error handling
