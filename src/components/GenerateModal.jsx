import { useState, useRef, useCallback } from 'react';
import { generateFromFiles } from '../utils/aiGenerator';
import { v4 as uuidv4 } from 'uuid';

const ACCEPTED = '.pdf,.png,.jpg,.jpeg,.gif,.webp,.html,.htm,.txt,.md,.csv,.json,.xml,.docx,.xlsx';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = { pdf: '📄', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', webp: '🖼️', html: '🌐', htm: '🌐', txt: '📝', md: '📝', csv: '📊', xlsx: '📊', xls: '📊', json: '⚙️', xml: '⚙️', docx: '📃' };
  return icons[ext] || '📎';
}

export default function GenerateModal({ isOpen, onClose, onGenerated }) {
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const addFiles = useCallback((newFiles) => {
    const arr = Array.from(newFiles).map(f => ({ id: uuidv4(), file: f }));
    setFiles(prev => [...prev, ...arr]);
    setError('');
  }, []);

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleGenerate = async () => {
    if (files.length === 0 && !comments.trim()) {
      setError('Upload at least one file or add comments.');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('Reading files...');

    try {
      setStatus('Analyzing with Gemini...');
      const result = await generateFromFiles(files.map(f => f.file), comments);
      setStatus('');
      setLoading(false);
      onGenerated(result);
      setFiles([]);
      setComments('');
      onClose();
    } catch (err) {
      setError(err.message || 'Generation failed');
      setStatus('');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[560px] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c8d9f0]/50">
          <div>
            <h2 className="text-sm font-bold text-[#0d1b2e]">AI Generate Release Note</h2>
            <p className="text-[10px] text-[#5a7a99] mt-0.5">Upload specs, designs, changelogs — get a draft release note</p>
          </div>
          <button onClick={onClose} className="text-[#5a7a99] hover:text-[#0d1b2e] text-lg">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-[#5A8DE3] bg-[#ECF2FC]' : 'border-[#c8d9f0] hover:border-[#5A8DE3] hover:bg-[#f8faff]'
            }`}
          >
            <div className="text-2xl mb-1">📁</div>
            <p className="text-xs text-[#0d1b2e] font-semibold">Drop files here or click to browse</p>
            <p className="text-[10px] text-[#5a7a99] mt-1">PDF, images, HTML, text files</p>
            <input ref={inputRef} type="file" multiple accept={ACCEPTED}
              className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {files.map(({ id, file }) => (
                <div key={id} className="flex items-center justify-between bg-[#f8faff] rounded-lg px-3 py-2 border border-[#c8d9f0]/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm flex-shrink-0">{fileIcon(file.name)}</span>
                    <span className="text-[11px] text-[#0d1b2e] font-medium truncate">{file.name}</span>
                    <span className="text-[10px] text-[#5a7a99] flex-shrink-0">{formatSize(file.size)}</span>
                  </div>
                  <button onClick={() => removeFile(id)}
                    className="text-[#5a7a99] hover:text-red-500 text-xs ml-2 flex-shrink-0">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Comments */}
          <div>
            <label className="block text-[11px] font-semibold text-[#0d1b2e] mb-1">
              Additional context <span className="font-normal text-[#5a7a99]">(optional)</span>
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="e.g. 'Only Part A was developed. Focus on the new dashboard feature. Version is 2.3.0.'"
              rows={4}
              className="w-full border border-[#c8d9f0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#5A8DE3] resize-none"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#c8d9f0]/50 flex items-center justify-between">
          <span className="text-[10px] text-[#5a7a99]">
            {status || (files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} ready` : '')}
          </span>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`text-xs px-5 py-2 rounded font-semibold transition-colors ${
              loading
                ? 'bg-[#5A8DE3]/60 text-white/80 cursor-wait'
                : 'bg-[#5A8DE3] text-white hover:bg-[#4a7dd3] cursor-pointer'
            }`}
          >
            {loading ? '⏳ Generating...' : '✨ Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}
