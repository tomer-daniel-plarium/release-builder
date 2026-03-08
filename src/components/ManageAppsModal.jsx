import { useState } from 'react';

export default function ManageAppsModal({ isOpen, onClose, apps, dispatch }) {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editingSvg, setEditingSvg] = useState(null);
  const [svgInput, setSvgInput] = useState('');
  const [editingEmail, setEditingEmail] = useState(null);
  const [emailInput, setEmailInput] = useState('');

  if (!isOpen) return null;

  const addApp = () => {
    if (!newName.trim()) return;
    let id = newName.trim().toLowerCase().replace(/\s+/g, '-');
    if (apps.some(a => a.id === id)) {
      id = id + '-' + Date.now();
    }
    const updated = [...apps, { id, name: newName.trim(), email: newEmail.trim(), svgRaw: null }];
    dispatch({ type: 'UPDATE_APPS', apps: updated });
    setNewName('');
    setNewEmail('');
  };

  const deleteApp = (id) => {
    if (!confirm(`Delete ${apps.find(a => a.id === id)?.name}?`)) return;
    dispatch({ type: 'UPDATE_APPS', apps: apps.filter(a => a.id !== id) });
  };

  const saveSvg = (id) => {
    const updated = apps.map(a => a.id === id ? { ...a, svgRaw: svgInput.trim() || null } : a);
    dispatch({ type: 'UPDATE_APPS', apps: updated });
    setEditingSvg(null);
    setSvgInput('');
  };

  const saveEmail = (id) => {
    const updated = apps.map(a => a.id === id ? { ...a, email: emailInput.trim() } : a);
    dispatch({ type: 'UPDATE_APPS', apps: updated });
    setEditingEmail(null);
    setEmailInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c8d9f0]/50">
          <h2 className="text-sm font-bold text-[#0d1b2e]">Manage Apps</h2>
          <button onClick={onClose} className="text-[#5a7a99] hover:text-[#0d1b2e] text-lg">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          <div className="flex flex-col gap-2 mb-4">
            {apps.map(a => (
              <div key={a.id} className="border border-[#c8d9f0] rounded-lg px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${a.svgRaw ? 'bg-green-400' : 'bg-[#c8d9f0]'}`} />
                    <span className="text-xs font-semibold text-[#0d1b2e]">{a.name}</span>
                    {a.email && <span className="text-[10px] text-[#5a7a99]">({a.email})</span>}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => { setEditingEmail(a.id); setEmailInput(a.email || ''); setEditingSvg(null); }}
                      className="text-[10px] px-2 py-1 rounded bg-[#ECF2FC] text-[#5A8DE3] hover:bg-[#dce8fb]">Email</button>
                    <button onClick={() => { setEditingSvg(a.id); setSvgInput(a.svgRaw || ''); setEditingEmail(null); }}
                      className="text-[10px] px-2 py-1 rounded bg-[#ECF2FC] text-[#5A8DE3] hover:bg-[#dce8fb]">SVG</button>
                    <button onClick={() => deleteApp(a.id)}
                      className="text-[10px] px-2 py-1 rounded text-red-400 hover:bg-red-50">✕</button>
                  </div>
                </div>
                {editingEmail === a.id && (
                  <div className="mt-3">
                    <input value={emailInput} onChange={e => setEmailInput(e.target.value)}
                      placeholder="PM email address"
                      className="w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs outline-none focus:border-[#5A8DE3]" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveEmail(a.id)}
                        className="text-xs px-3 py-1 rounded bg-[#5A8DE3] text-white font-semibold hover:bg-[#4a7dd3]">Save Email</button>
                      <button onClick={() => setEditingEmail(null)}
                        className="text-xs px-3 py-1 rounded border border-[#c8d9f0] text-[#5a7a99]">Cancel</button>
                    </div>
                  </div>
                )}
                {editingSvg === a.id && (
                  <div className="mt-3">
                    <textarea value={svgInput} onChange={e => setSvgInput(e.target.value)}
                      placeholder="Paste white SVG code here"
                      className="w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs font-mono h-20 outline-none focus:border-[#5A8DE3]" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveSvg(a.id)}
                        className="text-xs px-3 py-1 rounded bg-[#5A8DE3] text-white font-semibold hover:bg-[#4a7dd3]">Save SVG</button>
                      <button onClick={() => setEditingSvg(null)}
                        className="text-xs px-3 py-1 rounded border border-[#c8d9f0] text-[#5a7a99]">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-[#c8d9f0]/50 pt-4">
            <div className="text-[10px] font-semibold text-[#5a7a99] uppercase tracking-wider mb-2">Add New App</div>
            <div className="flex gap-2">
              <input placeholder="App name" value={newName} onChange={e => setNewName(e.target.value)}
                className="flex-1 border border-[#c8d9f0] rounded px-2 py-1.5 text-xs outline-none focus:border-[#5A8DE3]" />
              <input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                className="flex-1 border border-[#c8d9f0] rounded px-2 py-1.5 text-xs outline-none focus:border-[#5A8DE3]" />
              <button onClick={addApp}
                className="text-xs px-3 py-1.5 rounded bg-[#5A8DE3] text-white font-semibold hover:bg-[#4a7dd3]">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
