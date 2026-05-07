# AR Viewer

Web AR berbasis marker — jalan langsung di browser mobile tanpa install apapun.

## Struktur File

```
ar-web/
├── indexAR.html          ← Entry point utama
├── css/
│   └── style.css         ← Semua tampilan UI
├── js/
│   ├── store.js          ← DATA: satu-satunya tempat state disimpan (localStorage)
│   ├── camera.js         ← Fix kamera mobile Chrome / Safari
│   ├── ar.js             ← Kontrol A-Frame + AR.js scene
│   └── ui.js             ← Render UI, handle interaksi user
└── assets/
    └── arrow.glb         ← Model 3D default (panah oranye)
```

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub
2. Upload **seluruh folder** (pertahankan struktur folder `css/`, `js/`, `assets/`)
3. Settings → Pages → Source: **main branch, / (root)**
4. Buka `https://username.github.io/nama-repo/indexAR.html` di HP

> **Wajib HTTPS** — GitHub Pages otomatis pakai HTTPS ✓

## Cara Pakai

1. Buka `indexAR.html` di browser HP (Chrome Android / Safari iOS)
2. Tap **Aktifkan Kamera** → izinkan akses kamera
3. Buka **Pengaturan** → upload model 3D (`.glb` direkomendasikan)
4. Tambah marker → pilih tipe → tap **Tambah**
5. Download & print marker → minimal **8×8 cm**
6. Tutup panel → arahkan kamera ke marker

## Marker Tersedia

| Marker   | Stabilitas | Keterangan |
|----------|-----------|------------|
| Hiro     | ⭐⭐⭐ Terbaik | Marker default AR.js |
| Kanji    | ⭐⭐⭐      | Alternatif stabil |
| Letter A–D | ⭐⭐    | Marker huruf |

> Gunakan **Hiro** terlebih dahulu — paling mudah terdeteksi.

## Format Model 3D

| Format | Keterangan |
|--------|-----------|
| `.glb` | ✅ Direkomendasikan — satu file, cepat |
| `.gltf` | ✅ Didukung |
| `.obj` | ✅ Didukung (tanpa material/texture) |

**Sumber model gratis:** [poly.pizza](https://poly.pizza) · [sketchfab.com](https://sketchfab.com)

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Kamera tidak muncul | Pastikan HTTPS, izinkan kamera di pengaturan browser |
| Marker tidak terdeteksi | Pastikan cahaya cukup, marker minimal 8×8 cm |
| Model tidak muncul | Coba format `.glb`, pastikan file tidak korup |
| Layar hitam setelah izin | Reload halaman, coba browser berbeda |

## Teknologi

- [A-Frame 1.4.2](https://aframe.io)
- [AR.js 3.4.5](https://ar-js-org.github.io/AR.js-Docs/)
- 100% static HTML — tidak butuh server/backend
