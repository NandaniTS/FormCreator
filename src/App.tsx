import { useEffect, useState } from "react";
import Builder from "./Builder";
import Filler from "./Filler";
import Responses from "./Responses";
import { LOCALES, detectLocale } from "./i18n";
import { usePersistentState } from "./store";
import { blankForm, FormResponse, FormSchema } from "./types";

type Tab = "build" | "fill" | "resp";

export default function App() {
  
  const [locale, setLocale] = usePersistentState<string>("fc:locale", detectLocale);
  const [form, setForm] = usePersistentState<FormSchema>("fc:form", blankForm);
  const [responses, setResponses] = usePersistentState<FormResponse[]>("fc:responses", () => []);
  const [tab, setTab] = useState<Tab>("build");
  const t = LOCALES[locale] ?? LOCALES.en;

  // Locale drives <html lang> and text direction (RTL for Arabic).
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = t.rtl ? "rtl" : "ltr";
  }, [locale, t.rtl]);

  return (
    <>
      <header>
        <b>{t.app}</b>
        <nav>
          {(["build", "fill", "resp"] as Tab[]).map(k => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t[k]}</button>
          ))}
        </nav>
        <span className="row">
          <button onClick={() => { setForm(blankForm()); setResponses([]); }}>{t.newf}</button>
          <select className="auto" aria-label="Language" value={locale} onChange={e => setLocale(e.target.value)}>
            {Object.entries(LOCALES).map(([k, l]) => <option key={k} value={k}>{l.name}</option>)}
          </select>
        </span>
      </header>
      <main>
        {tab === "build" && <Builder t={t} form={form} setForm={setForm} />}
        {tab === "fill" && <Filler t={t} form={form} onSubmit={r => setResponses([r, ...responses])} />}
        {tab === "resp" && <Responses t={t} form={form} responses={responses} locale={locale} onClear={() => setResponses([])} />}
      </main>
    </>
  );
}
