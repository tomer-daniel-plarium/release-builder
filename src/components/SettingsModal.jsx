import { useState, useEffect } from 'react';

const inputCls = 'w-full border border-[#c8d9f0] rounded px-2.5 py-2 text-xs outline-none focus:border-[#5A8DE3] bg-white';
const labelCls = 'block text-[11px] font-semibold text-[#0d1b2e] mb-1';

function load() {
  try { return JSON.parse(localStorage.getItem('llm_settings') || '{}'); }
  catch { return {}; }
}

function save(s) {
  try { localStorage.setItem('llm_settings', JSON.stringify(s)); }
  catch { /* ignore */ }
}

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    backend: 'aistudio',
    apiKey: '',
    gcpProject: '',
    gcpRegion: 'us-central1',
    accessToken: '',
    model: 'gemini-2.0-flash',
    githubToken: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const s = load();
      setSettings(prev => ({ ...prev, ...s }));
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    save(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c8d9f0]/50">
          <h2 className="text-sm font-bold text-[#0d1b2e]">LLM Backend</h2>
          <button onClick={onClose} className="text-[#5a7a99] hover:text-[#0d1b2e] text-lg">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          <div>
            <label className={labelCls}>Choose your backend</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1.5 text-xs text-[#0d1b2e] cursor-pointer">
                <input type="radio" name="backend" value="aistudio"
                  checked={settings.backend === 'aistudio'}
                  onChange={() => update('backend', 'aistudio')} />
                Gemini API (AI Studio)
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[#0d1b2e] cursor-pointer">
                <input type="radio" name="backend" value="vertex"
                  checked={settings.backend === 'vertex'}
                  onChange={() => update('backend', 'vertex')} />
                Vertex AI (GCP)
              </label>
            </div>
          </div>

          {settings.backend === 'aistudio' && (
            <div>
              <label className={labelCls}>API Key</label>
              <input type="password" className={inputCls} placeholder="AIza..."
                value={settings.apiKey} onChange={e => update('apiKey', e.target.value)} />
              <p className="text-[10px] text-[#5a7a99] mt-1">
                Get a key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer"
                  className="text-[#5A8DE3] underline">aistudio.google.com</a>
              </p>
            </div>
          )}

          {settings.backend === 'vertex' && (
            <>
              <div>
                <label className={labelCls}>GCP Project ID</label>
                <input className={inputCls} placeholder="my-project-id"
                  value={settings.gcpProject} onChange={e => update('gcpProject', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Region</label>
                <input className={inputCls} placeholder="us-central1"
                  value={settings.gcpRegion} onChange={e => update('gcpRegion', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Access Token</label>
                <input type="password" className={inputCls} placeholder="ya29.a0..."
                  value={settings.accessToken} onChange={e => update('accessToken', e.target.value)} />
                <p className="text-[10px] text-[#5a7a99] mt-1">
                  Run <code className="bg-[#ECF2FC] px-1 py-0.5 rounded text-[10px]">gcloud auth print-access-token</code> and paste here. Expires in ~1 hour.
                </p>
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>Model</label>
            <select className={inputCls + ' cursor-pointer'}
              value={settings.model} onChange={e => update('model', e.target.value)}>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (fast)</option>
              <option value="gemini-2.5-pro-preview-05-06">Gemini 2.5 Pro (best quality)</option>
              <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (cheapest)</option>
            </select>
          </div>

          <div className="border-t border-[#c8d9f0]/50 pt-4 mt-1">
            <h3 className="text-xs font-bold text-[#0d1b2e] mb-3">Image Hosting (GitHub)</h3>
            <div>
              <label className={labelCls}>GitHub Personal Access Token</label>
              <input type="password" className={inputCls} placeholder="ghp_..."
                value={settings.githubToken} onChange={e => update('githubToken', e.target.value)} />
              <p className="text-[10px] text-[#5a7a99] mt-1">
                Used to upload images to your repo. Needs <code className="bg-[#ECF2FC] px-1 py-0.5 rounded text-[10px]">repo</code> scope.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#c8d9f0]/50 flex items-center justify-between">
          <span className={`text-[10px] font-semibold transition-opacity ${saved ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
            Saved!
          </span>
          <button onClick={handleSave}
            className="text-xs px-5 py-2 rounded bg-[#5A8DE3] text-white font-semibold hover:bg-[#4a7dd3]">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
