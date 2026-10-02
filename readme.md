# FormCraft – a Tally-style form builder (frontend only)

Build a form, preview it, share it by link, and collect responses. Built with React + TypeScript (Vite).

## Run

```
npm install
npm run dev      # development
npm run build    # production build (also type-checks)
```

Requires Node 18 or newer.

## Assumptions

**Storage / persistence**

1. There is no backend. The form design, responses and language choice are saved in the browser's `localStorage` (keys `fc:form`, `fc:responses`, `fc:locale`). This is "persistent storage" for the assignment; it survives reloads but is per browser and per device, and is limited to about 5 MB.
2. The design is saved as JSON (`Form`), which is all that is needed to re-render it. Re-rendering is done by `Filler`, which reads only that JSON.
3. Only one form is edited at a time. "New form" replaces it and clears its responses.
4. All reads and writes go through `store.ts`, so a REST API or database can be swapped in by changing only those two functions.

**Form behaviour** 10. Supported question types: short text, long text, email, number, single choice, multiple choice. 11. "Required" means non-empty; for multiple choice, at least one option ticked. 12. Email is checked with a simple pattern (`text@text.text`), not full validation. Number fields accept whatever the browser's number input allows. 13. Blank lines in an options list are ignored. 14. The submit button text is optional; if empty, the translated default ("Submit") is used.

**Localization (L10N) and internationalization (I18N)** 15. The interface is translated into English, Hindi, Spanish and Arabic. The initial language is the browser language, falling back to English, and the choice is remembered. 16. Arabic switches the page to right-to-left (`dir="rtl"`); other languages are left-to-right. 17. Dates use `Intl.DateTimeFormat` with the chosen language. 18. Text typed by the form creator (title, questions, options, button text) is not translated. It is written in one language. Supporting several would mean storing text per language, such as `label: { en, hi }`. 19. Translations are written by hand and should be reviewed by a native speaker before real use. Adding a language means adding one object in `i18n.ts`.

**Responsive design and UI** 20. The layout uses flexible rows and an auto-fitting grid, with one narrow-screen rule at 480 px. It was designed for current phones, tablets and desktops. 21. There is one light theme only (white page, `#fadb14` buttons with black text, rounded white inputs, `#8c8c8c` placeholders). Dark mode is not supported. 22. The language and field-type dropdowns are native selects, so their open list is styled by the browser or operating system.
