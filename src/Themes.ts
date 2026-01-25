export type NoteTheme = {
  id: string;
  name: string;
  containerSx: Record<string, any>;
  editorSx: Record<string, any>;
};

export const DEFAULT_NOTE_THEMES: NoteTheme[] = [
  {
    id: "glass",
    name: "Glass",
    containerSx: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.3)",
    },
    editorSx: {
      backgroundColor: "rgba(255,255,255,0.05)",
      color: "black",
    },
  },
  {
    id: "Blue",
    name: "Blue",
    containerSx: {
      background: "#75a0df",
      border: "1px solid #333",
    },
    editorSx: {
      backgroundColor: "#1e1e1e",
      color: "white",
    },
  },
  {
    id: "pastel",
    name: "Pastel",
    containerSx: {
      background: "linear-gradient(135deg,#fdfbfb,#ebedee)",
    },
    editorSx: {
      backgroundColor: "#ffffff",
      color: "#333",
    },
  },
];

const STORAGE_KEY = "note_themes_v1";

function isValidThemeArray(obj: any): obj is NoteTheme[] {
  return Array.isArray(obj) && obj.every((t) => t && typeof t.id === "string");
}

export function getStoredThemes(): NoteTheme[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidThemeArray(parsed)) {
        const merged = [...parsed];
        for (const def of DEFAULT_NOTE_THEMES) {
          if (!merged.find((t) => t.id === def.id)) merged.push(def);
        }
        return merged;
      }
    }
  } catch (err) {
  }

  return [...DEFAULT_NOTE_THEMES];
}

export function saveThemes(themes: NoteTheme[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  } catch (err) {
    console.error("Failed to save themes:", err);
  }
}

export function addTheme(theme: NoteTheme) {
  const themes = getStoredThemes();
  if (themes.find((t) => t.id === theme.id)) {
    return themes;
  }
  const next = [...themes, theme];
  saveThemes(next);
  return next;
}

export function deleteTheme(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getStoredThemes();
    const parsed = JSON.parse(raw);
    if (!isValidThemeArray(parsed)) return getStoredThemes();
    const filtered = parsed.filter((t: NoteTheme) => t.id !== id);
    saveThemes(filtered);
    return getStoredThemes();
  } catch (err) {
    console.error("Failed to delete theme:", err);
    return getStoredThemes();
  }
}

export function getThemeById(id?: string) {
  if (!id) return undefined;
  return getStoredThemes().find((t) => t.id === id);
}

export const NOTE_THEMES = DEFAULT_NOTE_THEMES;
