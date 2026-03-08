import { useState, useEffect } from 'react';
import { loadTemplates, saveTemplate, deleteTemplate } from '../data/templates';

export default function TemplatesModal({ isOpen, onClose, currentAppId, components, apps, dispatch }) {
  const [templates, setTemplates] = useState([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [creator, setCreator] = useState('');

  useEffect(() => {
    if (isOpen) setTemplates(loadTemplates());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    const updated = saveTemplate({
      name: name.trim(),
      app_id: currentAppId,
      created_by: creator.trim() || 'Anonymous',
      components: JSON.parse(JSON.stringify(components)),
    });
    setTemplates(updated);
    setSaving(false);
    setName('');
    setCreator('');
  };

  const handleLoad = (tpl) => {
    dispatch({ type: 'LOAD_TEMPLATE', components: tpl.components, appId: tpl.app_id });
    onClose();
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this template?')) return;
    setTemplates(deleteTemplate(id));
  };

  const appName = (id) => apps.find(a => a.id === id)?.name || id;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c8d9f0]/50">
          <h2 className="text-sm font-bold text-[#0d1b2e]">Templates</h2>
          <button onClick={onClose} className="text-[#5a7a99] hover:text-[#0d1b2e] text-lg">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          {!saving && (
            <button onClick={() => setSaving(true)}
              className="w-full mb-4 text-xs text-[#5A8DE3] border border-dashed border-[#5A8DE3] rounded-lg px-3 py-2.5 hover:bg-[#ECF2FC] transition-colors">
              + Save Current as Template
            </button>
          )}

          {saving && (
            <div className="mb-4 bg-[#ECF2FC] rounded-lg p-4">
              <input placeholder="Template name" value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs mb-2 outline-none focus:border-[#5A8DE3]" />
              <input placeholder="Your name (optional)" value={creator} onChange={e => setCreator(e.target.value)}
                className="w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs mb-3 outline-none focus:border-[#5A8DE3]" />
              <div className="flex gap-2">
                <button onClick={handleSave}
                  className="text-xs px-4 py-1.5 rounded bg-[#5A8DE3] text-white font-semibold hover:bg-[#4a7dd3]">Save</button>
                <button onClick={() => setSaving(false)}
                  className="text-xs px-4 py-1.5 rounded border border-[#c8d9f0] text-[#5a7a99] hover:text-[#0d1b2e]">Cancel</button>
              </div>
            </div>
          )}

          {templates.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#5a7a99]">No templates yet</div>
          ) : (
            <div className="flex flex-col gap-2">
              {templates.map(tpl => (
                <div key={tpl.id} className="border border-[#c8d9f0] rounded-lg px-4 py-3 flex items-center justify-between hover:border-[#5A8DE3] transition-colors">
                  <div>
                    <div className="text-xs font-semibold text-[#0d1b2e]">{tpl.name}</div>
                    <div className="text-[10px] text-[#5a7a99] mt-0.5">
                      {appName(tpl.app_id)} · {tpl.created_by || 'Anonymous'}
                      {tpl.created_at && ` · ${new Date(tpl.created_at).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleLoad(tpl)}
                      className="text-[10px] px-2.5 py-1 rounded bg-[#ECF2FC] text-[#5A8DE3] font-semibold hover:bg-[#dce8fb]">Load</button>
                    <button onClick={() => handleDelete(tpl.id)}
                      className="text-[10px] px-2 py-1 rounded text-red-400 hover:bg-red-50">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
