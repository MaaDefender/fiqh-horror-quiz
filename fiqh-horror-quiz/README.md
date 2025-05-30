# Game Edukatif Horor: Fiqh Qadha & Qadhar

Ini adalah proyek game edukatif sederhana berbasis web dengan nuansa horor. Game ini bertujuan untuk menguji pemahaman siswa mengenai materi Fiqh (Aqidah) tentang Qadha dan Qadhar melalui soal pilihan ganda dan esai.

## Fitur

* **Halaman Guru:**
    * Input 10 soal pilihan ganda dan 5 soal esai.
    * Soal default sudah disediakan untuk kemudahan.
    * Menyimpan konfigurasi soal ke `localStorage` browser guru.
    * Menampilkan "link" (path ke `student_login.html`) untuk dibagikan ke siswa.
    * Menampilkan papan peringkat (leaderboard) siswa berdasarkan skor tertinggi, data diambil dari `localStorage`.
* **Halaman Siswa:**
    * Halaman login untuk mengisi Nama dan Kelas.
    * Halaman kuis untuk menjawab soal yang telah disiapkan guru.
    * Penilaian otomatis untuk soal pilihan ganda. Esai diberi skor jika dijawab (penilaian kualitas manual oleh guru).
    * Skor minimal kelulusan adalah 75.
    * Efek "jumpscare" (gambar dan audio) jika skor di bawah 75.
    * Efek "applause" (audio dan pesan) jika skor sempurna (100).
    * Hasil pengerjaan disimpan ke `localStorage` dan muncul di papan peringkat guru.

## Struktur Proyek