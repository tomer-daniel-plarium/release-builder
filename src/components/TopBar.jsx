import { B, N1, N2 } from '../data/theme';

const btnBase = {
  padding: '7px 14px', borderRadius: 6, border: 'none', color: '#fff',
  fontSize: 12, cursor: 'pointer', fontWeight: 600, letterSpacing: 0.3,
};

export default function TopBar({
  apps, selectedApp, dispatch, viewMode, previewMode,
  onCopyHtml, onDownloadHtml, onReset, onOpenTemplates, onOpenSettings, onOpenGenerate, canUndo, canRedo,
}) {
  return (
    <div style={{
      height: 50, background: N1, display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 8, flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <span style={{ color: B, fontWeight: 800, fontSize: 13, letterSpacing: 1, marginRight: 6, whiteSpace: 'nowrap' }}>
        📧 Release Builder
      </span>

      <select
        value={selectedApp.id}
        onChange={e => dispatch({ type: 'SELECT_APP', id: e.target.value })}
        style={{
          padding: '5px 8px', borderRadius: 5, border: `1px solid ${B}`,
          background: N2, color: '#fff', fontSize: 12, cursor: 'pointer', outline: 'none',
        }}
      >
        {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => dispatch({ type: 'UNDO' })} disabled={!canUndo}
        style={{ ...btnBase, background: 'transparent', opacity: canUndo ? 0.7 : 0.3, cursor: canUndo ? 'pointer' : 'not-allowed' }}
        title="Undo (Ctrl+Z)"
      >↩</button>
      <button
        onClick={() => dispatch({ type: 'REDO' })} disabled={!canRedo}
        style={{ ...btnBase, background: 'transparent', opacity: canRedo ? 0.7 : 0.3, cursor: canRedo ? 'pointer' : 'not-allowed' }}
        title="Redo (Ctrl+Y)"
      >↪</button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />

      <div style={{ display: 'flex', borderRadius: 5, border: '1px solid rgba(200,217,240,0.2)', overflow: 'hidden' }}>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode: 'desktop' })}
          style={{ ...btnBase, borderRadius: 0, background: viewMode === 'desktop' ? B : '#2a3f5f' }}
        >Desktop</button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode: 'mobile' })}
          style={{ ...btnBase, borderRadius: 0, background: viewMode === 'mobile' ? B : '#2a3f5f' }}
        >Mobile</button>
      </div>

      <button
        onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })}
        style={{ ...btnBase, background: previewMode ? B : '#2a3f5f' }}
      >{previewMode ? '✏️ Edit' : '👁 Preview'}</button>

      <button onClick={onOpenGenerate} style={{ ...btnBase, background: '#5A8DE3' }}>
        ✨ AI Generate
      </button>

      <button onClick={onOpenTemplates} style={{ ...btnBase, background: '#2a3f5f' }}>
        💾 Templates
      </button>

      <button onClick={onReset} style={{ ...btnBase, background: '#2a3f5f' }}>
        ↺ Reset
      </button>

      <button onClick={onDownloadHtml} style={{ ...btnBase, background: '#2a6f4f' }}>
        ⬇ Download
      </button>

      <button onClick={onCopyHtml} style={{ ...btnBase, background: B }}>
        ⎘ Copy HTML
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />

      <button onClick={onOpenSettings} style={{ ...btnBase, background: 'transparent', opacity: 0.7 }} title="LLM Settings">
        ⚙
      </button>
    </div>
  );
}
