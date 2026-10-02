export type FieldType = "text" | "textarea" | "email" | "number" | "choice" | "checkbox";
export const FIELD_TYPES: FieldType[] = ["text", "textarea", "email", "number", "choice", "checkbox"];

export interface Field { id: string; type: FieldType; label: string; required: boolean; options: string[]; }
/** The saved "design": everything needed to re-render a form. */
export interface FormSchema { id: string; title: string; fields: Field[]; submitLabel?: string; }
export type Answer = string | string[];
export interface FormResponse { id: string; at: number; values: Record<string, Answer>; }

export const uid = () => crypto.randomUUID();
export const blankForm = (): FormSchema => ({ id: uid(), title: "", fields: [], submitLabel: "" });
