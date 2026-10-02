import { FIELD_TYPES, FormSchema, Field, FieldType, uid } from "./types";
import type { Locale } from "./i18n";

interface Props { t: Locale; form: FormSchema; setForm: (f: FormSchema) => void; }
const hasOptions = (f: Field) => f.type === "choice" || f.type === "checkbox";

export default function Builder({ t, form, setForm }: Props) {
  const patch = (id: string, p: Partial<Field>) =>
    setForm({ ...form, fields: form.fields.map(f => (f.id === id ? { ...f, ...p } : f)) });
  const move = (i: number, d: number) => {
    const a = [...form.fields], j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    setForm({ ...form, fields: a });
  };
  const add = (type: FieldType) =>
    setForm({ ...form, fields: [...form.fields, { id: uid(), type, label: "", required: false, options: ["Option 1", "Option 2"] }] });

  return (
    <>
      <div className="card">
        <input className="title" placeholder={t.untitled} value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />
        <div className="mu">✓ {t.saved}</div>
      </div>
      {form.fields.length === 0 && <p className="mu">{t.empty}</p>}
      {form.fields.map((f, i) => (
        <div className="card" key={f.id}>
          <input placeholder={t.label} value={f.label} onChange={e => patch(f.id, { label: e.target.value })} />
          <div className="row">
            <select className="auto" value={f.type} onChange={e => patch(f.id, { type: e.target.value as FieldType })}>
              {FIELD_TYPES.map(x => <option key={x} value={x}>{t[x]}</option>)}
            </select>
            <label className="opt">
              <input type="checkbox" checked={f.required} onChange={e => patch(f.id, { required: e.target.checked })} />
              {t.req}
            </label>
            <button onClick={() => move(i, -1)}>↑ {t.up}</button>
            <button onClick={() => move(i, 1)}>↓ {t.down}</button>
            <button onClick={() => setForm({ ...form, fields: form.fields.filter(x => x.id !== f.id) })}>{t.del}</button>
          </div>
          {hasOptions(f) && (
            <>
              <div className="mu">{t.opts}</div>
              <textarea rows={3} value={f.options.join("\n")}
                onChange={e => patch(f.id, { options: e.target.value.split("\n") })} />
            </>
          )}
        </div>
      ))}
      <div className="card">
        <label><b>{t.btnText}</b></label>
        <input placeholder={t.submit} value={form.submitLabel ?? ""}
          onChange={e => setForm({ ...form, submitLabel: e.target.value })} />
      </div>
      <div className="grid">
        {FIELD_TYPES.map(x => <button key={x} onClick={() => add(x)}>+ {t[x]}</button>)}
      </div>
    </>
  );
}
