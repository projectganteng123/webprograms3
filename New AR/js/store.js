/**
 * store.js — Satu-satunya tempat data disimpan.
 * Model file dibaca sebagai base64 agar bisa dikirim ke iframe via postMessage.
 */

const STORAGE_KEY = 'ar_web_state';

const DEFAULT_STATE = {
  markers: [],
  objControls: { scale: 1.0, height: 0.0, rotate: 0 },
  modelFileName: null,
};

// Runtime: base64 data URL model (tidak di-persist, terlalu besar)
let _modelDataURL  = null;
let _modelFileType = null;

function _loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const saved = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...saved,
      objControls: { ...DEFAULT_STATE.objControls, ...(saved.objControls || {}) },
    };
  } catch { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
}

let _state = _loadState();

function _persist() {
  try {
    // Jangan simpan modelDataURL (bisa sangat besar)
    const toSave = { ..._state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch(e) { console.warn('[store] localStorage error:', e); }
}

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

// ─── Model — baca sebagai base64 data URL ────────────────────
function setModelFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  _modelFileType = ext === 'obj' ? 'obj' : 'glb';
  _state.modelFileName = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    _modelDataURL = e.target.result; // "data:model/gltf-binary;base64,..."
    _persist();
    _notify('model');
  };
  reader.readAsDataURL(file);
}

function getModelDataURL()  { return _modelDataURL; }
function getModelFileType() { return _modelFileType; }
function getModelFileName() { return _state.modelFileName; }

window.Store = {
  getMarkers, addMarker, removeMarker,
  getControls, setControl,
  setModelFile, getModelDataURL, getModelFileType, getModelFileName,
  onChange,
};
