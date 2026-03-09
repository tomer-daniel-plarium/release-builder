import { useState } from 'react';
import { importFromHtml } from '../utils/htmlImporter';
import { B, N1, N2 } from '../data/theme';

export default function ImportModal({ isOpen, onClose, onImported }) {
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    setError('');
    if (!html.trim()) {
      setError('Paste your email HTML first.');
      return;
    }
    const result = importFromHtml(html);
    if (!result || result.components.length === 0) {
      setError('Could not parse any components from this HTML. Make sure you paste the full email source.');
      return;
    }
    onImported(result);
    setHtml('');
    onClose();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setHtml(reader.result);
    reader.readAsText(file);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: N1, borderRadius: 12, padding: 28, width: 560,
          maxHeight: '80vh', overflow: 'auto', border: `1px solid ${B}33`,
        }}
      >
        <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          📥 Import HTML
        </h2>
        <p style={{ color: '#8ca5c4', fontSize: 13, marginBottom: 16 }}>
          Paste an exported email HTML to rebuild the design on the canvas.
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <label
            style={{
              padding: '6px 14px', borderRadius: 6, background: N2,
              color: B, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${B}44`,
            }}
          >
            Browse .html file
            <input type="file" accept=".html,.htm" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          {html && (
            <span style={{ color: '#5A8DE3', fontSize: 12, alignSelf: 'center' }}>
              ✓ {(html.length / 1024).toFixed(1)} KB loaded
            </span>
          )}
        </div>

        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          placeholder="Or paste full email HTML here..."
          style={{
            width: '100%', height: 240, borderRadius: 8, border: `1px solid ${B}33`,
            background: N2, color: '#c8d9f0', fontSize: 12, fontFamily: 'monospace',
            padding: 12, resize: 'vertical', outline: 'none',
          }}
        />

        {error && (
          <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', borderRadius: 6, border: `1px solid ${B}33`,
              background: 'transparent', color: '#8ca5c4', fontSize: 13, cursor: 'pointer',
            }}
          >Cancel</button>
          <button
            onClick={handleImport}
            style={{
              padding: '8px 24px', borderRadius: 6, border: 'none',
              background: B, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >Import</button>
        </div>
      </div>
    </div>
  );
}
