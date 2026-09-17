function Input({ value, onChange, className = '', ...props }) {
  return (
    <input
      {...props}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      className={`h-9 w-full rounded-md border px-2.5 text-sm outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20 ${className || 'border-slate-200 bg-white text-slate-900'}`}
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
    >
      {children}
    </select>
  );
}

function Textarea({ value, onChange }) {
  return (
    <textarea
      value={value ?? ''}
      rows="2"
      onChange={(event) => onChange(event.target.value)}
      className="min-h-[58px] w-full resize-y rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
    />
  );
}

window.Input = Input;
window.Select = Select;
window.Textarea = Textarea;
