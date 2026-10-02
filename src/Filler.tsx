import { useState } from "react";
import { Answer, FormResponse, FormSchema, uid } from "./types";
import type { Locale } from "./i18n";

interface Props { t: Locale; form: FormSchema; onSubmit: (r: FormResponse) => void; }

/** Renders purely from the saved schema, so a stored design always re-renders identically. */
export default function Filler({ t, form, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, Answer>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (id: string, v: Answer) => setValues({ ...values, [id]: v });

  const submit = () => {
    const errs: Record<string, string> = {};
    for (const f of form.fields) {
      const v = values[f.id];
      const empty = v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
      if (f.required && empty) errs[f.id] = t.needed;
      else if (f.type === "email" && !empty && !/^\S+@\S+\.\S+$/.test(v as string)) errs[f.id] = t.bad;
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ id: uid(), at: Date.now(), values });
    setValues({}); setDone(true);
  };

  if (done) return (
    <div className="card"><p>{t.thanks}</p><button className="pri" onClick={() => setDone(false)}>{t.another}</button></div>
  );

  return (
    <div className="card">
      <h2>{form.title || t.untitled}</h2>
      {form.fields.map(f => {
        const opts = f.options.filter(Boolean);
        const v = values[f.id];
        return (
          <div className="q" key={f.id}>
            <label><b>{f.label || t.label}</b>{f.required && <span className="err"> *</span>}</label>
            {f.type === "textarea" && <textarea rows={4} value={(v as string) ?? ""} onChange={e => set(f.id, e.target.value)} />}
            {f.type === "choice" && opts.map(o => (
              <label className="opt" key={o}>
                <input type="radio" name={f.id} checked={v === o} onChange={() => set(f.id, o)} />{o}
              </label>
            ))}
            {f.type === "checkbox" && opts.map(o => {
              const arr = (v as string[]) ?? [];
              return (
                <label className="opt" key={o}>
                  <input type="checkbox" checked={arr.includes(o)}
                    onChange={e => set(f.id, e.target.checked ? [...arr, o] : arr.filter(x => x !== o))} />{o}
                </label>
              );
            })}
            {(f.type === "text" || f.type === "email" || f.type === "number") &&
              <input type={f.type} value={(v as string) ?? ""} onChange={e => set(f.id, e.target.value)} />}
            {errors[f.id] && <div className="err">{errors[f.id]}</div>}
          </div>
        );
      })}
      <button className="pri" onClick={submit}>{form.submitLabel?.trim() || t.submit}</button>
    </div>
  );
}
