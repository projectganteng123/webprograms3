/**
 * camera.js — Fix kamera untuk mobile Chrome.
 *
 * Masalah utama yang diselesaikan di sini:
 * 1. AR.js / A-Frame kadang tidak memicu permintaan izin kamera di mobile.
 * 2. Harus ada interaksi user (tap/klik) sebelum getUserMedia bisa dipanggil
 *    di beberapa browser mobile.
 * 3. Perlu HTTPS — halaman HTTP tidak bisa akses kamera sama sekali.
 * 4. Video element harus punya atribut: autoplay, muted, playsinline.
 */

const Camera = (() => {

  // Cek apakah halaman dibuka via HTTPS (wajib untuk getUserMedia)
  function isSecureContext() {
    return location.protocol === 'https:' || location.hostname === 'localhost';
  }

  // Tampilkan error di overlay layar
  function showError(msg) {
    const el = document.getElementById('cam-error');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideError() {
    const el = document.getElementById('cam-error');
    if (el) el.style.display = 'none';
  }

  // Minta izin kamera secara eksplisit, kemudian feed hasilnya
  // ke video element yang sudah dibuat oleh AR.js agar sinkron.
  async function requestCamera() {
    if (!isSecureContext()) {
      showError('❌ Butuh HTTPS. Buka via GitHub Pages atau localhost.');
      return false;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError('❌ Browser tidak mendukung akses kamera. Coba Chrome atau Safari terbaru.');
      return false;
    }

    try {
      // Prioritas kamera belakang (environment) untuk AR
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // AR.js membuat elemen <video> sendiri. Kita tunggu sampai ada,
      // lalu pasang stream kita ke sana supaya tidak konflik izin.
      _patchArjsVideo(stream);
      hideError();
      return true;

    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showError('❌ Izin kamera ditolak. Buka Pengaturan browser dan izinkan kamera untuk situs ini.');
      } else if (err.name === 'NotFoundError') {
        showError('❌ Kamera tidak ditemukan di perangkat ini.');
      } else if (err.name === 'NotReadableError') {
        showError('❌ Kamera sedang dipakai aplikasi lain. Tutup aplikasi kamera lalu reload.');
      } else {
        showError('❌ Gagal akses kamera: ' + err.message);
      }
      return false;
    }
  }

  // Tunggu video element AR.js muncul di DOM, lalu set srcObject-nya.
  function _patchArjsVideo(stream) {
    const tryPatch = () => {
      // AR.js menaruh video di dalam canvas container dengan id 'arjs-video'
      // atau sebagai elemen <video> pertama di body.
      const vid = document.getElementById('arjs-video')
                || document.querySelector('video');
      if (vid) {
        // Atribut wajib untuk autoplay di mobile
        vid.setAttribute('autoplay', '');
        vid.setAttribute('muted', '');
        vid.setAttribute('playsinline', '');
        vid.srcObject = stream;
        vid.play().catch(() => {});
      } else {
        // Coba lagi setelah 200ms
        setTimeout(tryPatch, 200);
      }
    };
    tryPatch();
  }

  // Tombol "Mulai Kamera" yang muncul sebelum scene AR aktif.
  // Butuh gesture user agar getUserMedia bisa jalan di iOS / beberapa Android.
  function init() {
    const btn = document.getElementById('btn-start-camera');
    if (!btn) return;

    if (!isSecureContext()) {
      showError('❌ Butuh HTTPS. Buka via GitHub Pages bukan via file://');
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = 'Memuat kamera…';
      const ok = await requestCamera();
      if (ok) {
        document.getElementById('start-screen').style.display = 'none';
      } else {
        btn.disabled = false;
        btn.textContent = '📷 Coba Lagi';
      }
    });
  }

  return { init, requestCamera, isSecureContext };
})();

window.Camera = Camera;
