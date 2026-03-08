import { useDraggable } from '@dnd-kit/core';
import { COMPONENT_TYPES } from '../data/defaults';

function PaletteItem({ type, label, icon }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { origin: 'palette', componentType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '7px 9px', marginBottom: 3, background: '#ECF2FC', borderRadius: 5,
        fontSize: 12, cursor: 'grab', color: '#0d1b2e', fontWeight: 500,
        userSelect: 'none', border: '1px solid #c8d9f0',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {icon} {label}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '5px 7px', fontSize: 11, borderRadius: 4,
  border: '1px solid #c8d9f0', outline: 'none', boxSizing: 'border-box',
};

export default function LeftPanel({ apps, selectedAppId, dispatch, onManageApps, headerTagline, senderEmail }) {
  return (
    <div style={{ width: 175, background: '#fff', borderRight: `1px solid #c8d9f0`, overflow: 'auto', padding: 10, flexShrink: 0 }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>Drag Components</p>
      {COMPONENT_TYPES.map(ct => (
        <PaletteItem key={ct.type} {...ct} />
      ))}

      <div style={{ height: 1, background: '#c8d9f0', margin: '12px 0' }} />

      <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>Apps</p>
      {apps.map(a => (
        <div
          key={a.id}
          onClick={() => dispatch({ type: 'SELECT_APP', id: a.id })}
          style={{
            padding: '6px 9px', marginBottom: 3, borderRadius: 5, fontSize: 12, cursor: 'pointer',
            background: a.id === selectedAppId ? '#5A8DE3' : '#ECF2FC',
            color: a.id === selectedAppId ? '#fff' : '#0d1b2e',
            border: `1px solid ${a.id === selectedAppId ? '#5A8DE3' : '#c8d9f0'}`,
            fontWeight: a.id === selectedAppId ? 700 : 400,
          }}
        >{a.name}</div>
      ))}
      <button
        onClick={onManageApps}
        style={{
          width: '100%', marginTop: 6, padding: 6, background: 'none',
          border: '1px dashed #5A8DE3', borderRadius: 5, color: '#5A8DE3',
          fontSize: 11, cursor: 'pointer',
        }}
      >+ Manage Apps</button>

      <div style={{ height: 1, background: '#c8d9f0', margin: '12px 0' }} />

      <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 6px' }}>Header Tagline</p>
      <input
        value={headerTagline}
        onChange={e => dispatch({ type: 'SET_HEADER_TAGLINE', value: e.target.value })}
        placeholder="Release Notes"
        style={inputStyle}
      />

      <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>Sender Email</p>
      <input
        value={senderEmail}
        onChange={e => dispatch({ type: 'SET_SENDER_EMAIL', value: e.target.value })}
        placeholder="your.email@company.com"
        style={inputStyle}
      />
    </div>
  );
}
