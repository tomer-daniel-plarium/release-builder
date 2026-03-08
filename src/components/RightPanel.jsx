function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-[10px] font-semibold text-[#5a7a99] uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, multiline }) {
  const cls = "w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs text-[#2c3e55] outline-none focus:border-[#5A8DE3] transition-colors";
  if (multiline) {
    return <textarea value={value || ''} onChange={e => onChange(e.target.value)} className={cls} rows={3} />;
  }
  return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className={cls} />;
}

function NumberInput({ value, onChange, min, max }) {
  return (
    <input type="number" value={value ?? ''} min={min} max={max}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs text-[#2c3e55] outline-none focus:border-[#5A8DE3]" />
  );
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex gap-1.5 items-center">
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
        className="w-7 h-7 rounded border border-[#c8d9f0] cursor-pointer p-0" />
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
        className="flex-1 border border-[#c8d9f0] rounded px-2 py-1.5 text-xs text-[#2c3e55] outline-none focus:border-[#5A8DE3] font-mono" />
    </div>
  );
}

function CheckboxInput({ checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)}
        className="w-3.5 h-3.5 cursor-pointer" />
      <span className="text-xs text-[#2c3e55]">{checked ? 'On' : 'Off'}</span>
    </label>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)}
      className="w-full border border-[#c8d9f0] rounded px-2 py-1.5 text-xs text-[#2c3e55] outline-none focus:border-[#5A8DE3] cursor-pointer">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ListEditor({ items, onChange, fields }) {
  const update = (idx, key, val) => {
    const next = items.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange(next);
  };
  const remove = idx => onChange(items.filter((_, i) => i !== idx));
  const add = () => {
    const blank = {};
    fields.forEach(f => { blank[f.key] = ''; });
    onChange([...items, blank]);
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div key={idx} className="bg-[#ECF2FC] rounded p-2 relative">
          <button onClick={() => remove(idx)}
            className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-600 w-4 h-4 flex items-center justify-center">✕</button>
          {fields.map(f => (
            <div key={f.key} className="mb-1">
              <span className="text-[9px] text-[#5a7a99] uppercase">{f.label}</span>
              <input type="text" value={item[f.key] || ''}
                onChange={e => update(idx, f.key, e.target.value)}
                className="w-full border border-[#c8d9f0] rounded px-1.5 py-1 text-xs text-[#2c3e55] outline-none focus:border-[#5A8DE3] mt-0.5" />
            </div>
          ))}
        </div>
      ))}
      <button onClick={add}
        className="text-xs text-[#5A8DE3] border border-dashed border-[#c8d9f0] rounded px-2 py-1 hover:border-[#5A8DE3]">+ Add Item</button>
    </div>
  );
}

const EDITORS = {
  tag: (props, up) => (<>
    <Field label="Emoji"><TextInput value={props.emoji} onChange={v => up({ emoji: v })} /></Field>
    <Field label="Text"><TextInput value={props.text} onChange={v => up({ text: v })} /></Field>
  </>),
  title: (props, up) => (<>
    <Field label="Text"><TextInput value={props.text} onChange={v => up({ text: v })} multiline /></Field>
    <Field label="Font Size"><NumberInput value={props.fontSize} onChange={v => up({ fontSize: v })} min={12} max={48} /></Field>
    <Field label="Bold"><CheckboxInput checked={props.bold} onChange={v => up({ bold: v })} /></Field>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
    <Field label="Alignment"><SelectInput value={props.alignment} onChange={v => up({ alignment: v })} options={['left', 'center', 'right']} /></Field>
  </>),
  subtitle: (props, up) => (<>
    <Field label="Text"><TextInput value={props.text} onChange={v => up({ text: v })} multiline /></Field>
    <Field label="Font Size"><NumberInput value={props.fontSize} onChange={v => up({ fontSize: v })} min={10} max={24} /></Field>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
  </>),
  accent: (props, up) => (<>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
    <Field label="Width (px)"><NumberInput value={props.width} onChange={v => up({ width: v })} min={20} max={300} /></Field>
  </>),
  body: (props, up) => (<>
    <Field label="Text"><TextInput value={props.text} onChange={v => up({ text: v })} multiline /></Field>
    <Field label="Font Size"><NumberInput value={props.fontSize} onChange={v => up({ fontSize: v })} min={10} max={24} /></Field>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
  </>),
  image: (props, up) => (<>
    <Field label="Image URL"><TextInput value={props.url} onChange={v => up({ url: v })} /></Field>
    <Field label="Caption"><TextInput value={props.caption} onChange={v => up({ caption: v })} /></Field>
    <Field label="Height (px)"><NumberInput value={props.height} onChange={v => up({ height: v })} min={100} max={600} /></Field>
  </>),
  features: (props, up) => (<>
    <Field label="Section Title"><TextInput value={props.sectionTitle} onChange={v => up({ sectionTitle: v })} /></Field>
    <Field label="Items">
      <ListEditor items={props.items || []} onChange={v => up({ items: v })}
        fields={[{ key: 'bold', label: 'Bold' }, { key: 'text', label: 'Text' }]} />
    </Field>
  </>),
  button: (props, up) => (<>
    <Field label="Text"><TextInput value={props.text} onChange={v => up({ text: v })} /></Field>
    <Field label="URL"><TextInput value={props.url} onChange={v => up({ url: v })} /></Field>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
    <Field label="Alignment"><SelectInput value={props.alignment} onChange={v => up({ alignment: v })} options={['left', 'center', 'right']} /></Field>
  </>),
  whatsnext: (props, up) => (<>
    <Field label="Section Title"><TextInput value={props.sectionTitle} onChange={v => up({ sectionTitle: v })} /></Field>
    <Field label="Items">
      <ListEditor items={props.items || []} onChange={v => up({ items: v })}
        fields={[{ key: 'bold', label: 'Bold' }, { key: 'badge', label: 'Badge' }, { key: 'text', label: 'Text' }]} />
    </Field>
  </>),
  quote: (props, up) => (<>
    <Field label="Quote Text"><TextInput value={props.text} onChange={v => up({ text: v })} multiline /></Field>
    <Field label="Attribution"><TextInput value={props.attribution} onChange={v => up({ attribution: v })} /></Field>
    <Field label="Accent Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
  </>),
  version: (props, up) => (<>
    <Field label="Version"><TextInput value={props.version} onChange={v => up({ version: v })} /></Field>
    <Field label="Date"><TextInput value={props.date} onChange={v => up({ date: v })} /></Field>
    <Field label="Alignment"><SelectInput value={props.alignment} onChange={v => up({ alignment: v })} options={['left', 'center', 'right']} /></Field>
  </>),
  numbered: (props, up) => (<>
    <Field label="Section Title"><TextInput value={props.sectionTitle} onChange={v => up({ sectionTitle: v })} /></Field>
    <Field label="Steps">
      <ListEditor items={props.items || []} onChange={v => up({ items: v })}
        fields={[{ key: 'text', label: 'Step' }]} />
    </Field>
  </>),
  divider: (props, up) => (<>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
    <Field label="Thickness (px)"><NumberInput value={props.thickness} onChange={v => up({ thickness: v })} min={1} max={5} /></Field>
  </>),
  spacer: (props, up) => (<>
    <Field label="Height (px)"><NumberInput value={props.height} onChange={v => up({ height: v })} min={4} max={80} /></Field>
  </>),
  closing: (props, up) => (<>
    <Field label="Text"><TextInput value={props.text} onChange={v => up({ text: v })} multiline /></Field>
    <Field label="Font Size"><NumberInput value={props.fontSize} onChange={v => up({ fontSize: v })} min={10} max={20} /></Field>
    <Field label="Color"><ColorInput value={props.color} onChange={v => up({ color: v })} /></Field>
  </>),
};

export default function RightPanel({ component, dispatch }) {
  if (!component) return null;

  const up = (partial) => dispatch({ type: 'UPDATE_PROPS', id: component.id, props: partial });
  const editor = EDITORS[component.type];

  return (
    <div className="w-[255px] bg-white border-l border-[#c8d9f0]/50 overflow-y-auto shrink-0">
      <div className="px-4 pt-4 pb-2">
        <div className="text-xs font-bold text-[#0d1b2e] capitalize mb-3">{component.type} Properties</div>
        {editor ? editor(component.props, up) : <div className="text-xs text-[#5a7a99]">No editable properties</div>}
      </div>
    </div>
  );
}
