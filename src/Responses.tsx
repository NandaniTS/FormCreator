import type { FormResponse, FormSchema } from "./types";
import type { Locale } from "./i18n";

interface Props { t: Locale; form: FormSchema; responses: FormResponse[]; locale: string; onClear: () => void; }

export default function Responses({ t, form, responses, locale, onClear }: Props) {
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  if (!responses.length) return <p className="mu">{t.none}</p>;
  return (
    <>
      {responses.map(r => (
        <div className="card" key={r.id}>
          <div className="mu">{fmt.format(r.at)}</div>
          {form.fields.map(f => {
            const v = r.values[f.id];
            return <div key={f.id}><b>{f.label}</b>: {Array.isArray(v) ? v.join(", ") : v ?? "—"}</div>;
          })}
        </div>
      ))}
      <button onClick={onClear}>{t.clear}</button>
    </>
  );
}
