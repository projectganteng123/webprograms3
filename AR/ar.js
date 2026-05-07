/**
 * ar.js — Mengontrol a-scene A-Frame + AR.js.
 * Membaca data dari Store, inject/rebuild marker entity di scene.
 */

const AR = (() => {

  // Definisi marker bawaan AR.js
  const MARKER_DEFS = {
    hiro:    { preset: 'hiro' },
    kanji:   { preset: 'kanji' },
    letterA: { preset: 'custom', url: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/pattern-files/pattern-letterA.patt' },
    letterB: { preset: 'custom', url: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/pattern-files/pattern-letterB.patt' },
    letterC: { preset: 'custom', url: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/pattern-files/pattern-letterC.patt' },
    letterD: { preset: 'custom', url: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/pattern-files/pattern-letterD.patt' },
  };

  function getScene() { return document.getElementById('ar-scene'); }

  // Hapus semua a-marker yang sudah ada di scene
  function _clearMarkers() {
    const scene = getScene();
    if (!scene) return;
    scene.querySelectorAll('a-marker').forEach(el => el.remove());
  }

  // Buat satu a-marker beserta entitas model 3D di dalamnya
  function _createMarkerEntity(marker, controls, modelURL, modelType) {
    const def = MARKER_DEFS[marker.type] || MARKER_DEFS['hiro'];

    const aMarker = document.createElement('a-marker');

    if (def.preset === 'hiro' || def.preset === 'kanji') {
      aMarker.setAttribute('preset', def.preset);
    } else {
      aMarker.setAttribute('preset', 'custom');
      aMarker.setAttribute('type', 'pattern');
      aMarker.setAttribute('url', def.url);
    }

    // Smooth tracking
    aMarker.setAttribute('smooth', 'true');
    aMarker.setAttribute('smoothCount', '10');
    aMarker.setAttribute('smoothTolerance', '0.01');
    aMarker.setAttribute('smoothThreshold', '5');

    // Entitas model
    const entity = document.createElement('a-entity');
    const { scale, height, rotate } = controls;

    entity.setAttribute('scale',    `${scale} ${scale} ${scale}`);
    entity.setAttribute('position', `0 ${height} 0`);
    entity.setAttribute('rotation', `0 ${rotate} 0`);

    if (modelType === 'obj') {
      entity.setAttribute('obj-model', `obj: url(${modelURL})`);
    } else {
      entity.setAttribute('gltf-model', `url(${modelURL})`);
    }

    aMarker.appendChild(entity);
    return aMarker;
  }

  // Rebuild seluruh scene berdasarkan state Store saat ini
  function rebuild() {
    _clearMarkers();

    const modelURL  = Store.getModelObjectURL();
    const modelType = Store.getModelFileType();
    const markers   = Store.getMarkers();
    const controls  = Store.getControls();

    if (!modelURL || markers.length === 0) {
      updateStatus();
      return;
    }

    const scene = getScene();
    markers.forEach(marker => {
      const el = _createMarkerEntity(marker, controls, modelURL, modelType);
      scene.appendChild(el);
    });

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
    // Dengarkan perubahan Store, rebuild scene secara otomatis
    Store.onChange((changed) => {
      if (changed === 'markers' || changed === 'controls' || changed === 'model') {
        rebuild();
      }
    });
  }

  return { init, rebuild, updateStatus };
})();

window.AR = AR;
