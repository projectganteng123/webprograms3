/**
 * ar.js — Kirim perintah ke iframe ar-scene.html via postMessage.
 * Tidak ada A-Frame di sini — semua AR logic ada di dalam iframe.
 */

const AR = (() => {

  function getFrame() {
    return document.getElementById('ar-frame');
  }

  // Kirim state terbaru ke iframe untuk rebuild scene
  function rebuild() {
    const frame = getFrame();
    if (!frame || !frame.contentWindow) return;

    const modelURL  = Store.getModelObjectURL();
    const modelType = Store.getModelFileType();
    const markers   = Store.getMarkers();
    const controls  = Store.getControls();

    frame.contentWindow.postMessage({
      type: 'REBUILD',
      payload: { markers, controls, modelURL, modelType }
    }, '*');

    updateStatus();
  }

  function updateStatus() {
    const el = document.getElementById('status-bar');
    if (!el) return;
    const modelURL = Store.getModelObjectURL();
    const markers  = Store.getMarkers();

    if (!modelURL) {
      el.textContent = 'Upload model 3D di menu Pengaturan';
    } else if (markers.length === 0) {
      el.textContent = 'Tambah marker di menu Pengaturan';
    } else {
      el.textContent = `${markers.length} marker aktif — arahkan kamera ke marker`;
    }
  }

  function init() {
    // Setelah iframe selesai load, langsung kirim state awal
    const frame = getFrame();
    if (frame) {
      frame.addEventListener('load', () => {
        // Tunggu sebentar agar A-Frame di iframe siap
        setTimeout(rebuild, 1500);
      });
    }

    // Dengarkan perubahan Store
    Store.onChange((changed) => {
      if (changed === 'markers' || changed === 'controls' || changed === 'model') {
        rebuild();
      }
    });
  }

  return { init, rebuild, updateStatus };
})();

window.AR = AR;
