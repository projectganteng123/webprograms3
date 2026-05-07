/**
 * store.js — Satu-satunya tempat data disimpan.
 * Semua modul lain baca/tulis data lewat fungsi di sini.
 * Data di-persist ke localStorage secara otomatis.
 */

const STORAGE_KEY = 'ar_web_state';

const DEFAULT_STATE = {
  markers: [],          // [{ id, name, type }]
  objControls: {
    scale:  1.0,        // ukuran objek (0.1 – 3.0)
    height: 0.0,        // posisi Y / tinggi (-1.0 – 2.0)
    rotate: 0,          // rotasi Y (0 – 360 derajat)
  },
  modelFileName: null,  // nama file model yang di-upload (untuk ditampilkan di UI)
};

// Runtime state (tidak di-persist): object URL dari file upload
let _modelObjectURL = null;
let _modelFileType  = null; // 'glb' | 'obj'

// Muat state dari localStorage, fallback ke default
function _loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const saved = JSON.parse(raw);
    // Merge dengan default agar key baru tidak hilang
    return {
      ...DEFAULT_STATE,
      ...saved,
      objControls: { ...DEFAULT_STATE.objControls, ...(saved.objControls || {}) },
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

let _state = _loadState();

function _persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch {
    console.warn('[store] localStorage tidak tersedia.');
  }
}

// ─── Listeners ───────────────────────────────────────────────
const _listeners = [];
function onChange(fn) { _listeners.push(fn); }
function _notify(changed) { _listeners.forEach(fn => fn(changed, _state)); }

// ─── Markers ─────────────────────────────────────────────────
function getMarkers() { return _state.markers; }

function addMarker(name, type) {
  const marker = { id: Date.now(), name, type };
  _state.markers.push(marker);
  _persist();
  _notify('markers');
  return marker;
}

function removeMarker(id) {
  _state.markers = _state.markers.filter(m => m.id !== id);
  _persist();
  _notify('markers');
}

// ─── Kontrol Objek ───────────────────────────────────────────
function getControls() { return { ..._state.objControls }; }

function setControl(key, value) {
  if (!(key in _state.objControls)) return;
  _state.objControls[key] = value;
  _persist();
  _notify('controls');
}

// ─── Model (runtime, tidak di-persist) ───────────────────────
function setModelFile(file) {
  if (_modelObjectURL) URL.revokeObjectURL(_modelObjectURL);
  _modelObjectURL = URL.createObjectURL(file);
  _modelFileType  = file.name.split('.').pop().toLowerCase() === 'obj' ? 'obj' : 'glb';
  _state.modelFileName = file.name;
  _persist(); // simpan nama file saja (bukan data biner)
  _notify('model');
}

function getModelObjectURL() { return _modelObjectURL; }
function getModelFileType()  { return _modelFileType; }
function getModelFileName()  { return _state.modelFileName; }

// ─── Export ──────────────────────────────────────────────────
window.Store = {
  getMarkers,
  addMarker,
  removeMarker,
  getControls,
  setControl,
  setModelFile,
  getModelObjectURL,
  getModelFileType,
  getModelFileName,
  onChange,
};
