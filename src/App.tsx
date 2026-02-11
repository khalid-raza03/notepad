import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './LandingPage'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useLocalStorage } from "usehooks-ts";
import { useMemo, lazy, Suspense } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Note } from './Note';
import type { NoteTheme } from './Themes';
import { getThemeById } from './Themes';
import { Box, CircularProgress, ThemeProvider, CssBaseline } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import ChooseTheme from './NotesTheme';
import { getTheme } from './theme';
import { ThemeContext } from './ThemeContext';

const NewNote = lazy(() => import('./NewNote'));
const NotesList = lazy(() => import('./NotesList'));
const NoteLayout = lazy(() => import('./NoteLayout'));
const EditNotes = lazy(() => import('./EditNotes'));


export type Tag = {
  id: string;
  label: string;
}
export type NotesData = {
  title: string;
  description: string;
  tags: Tag[]
  themeId?: string
}

export type NoteProps = {
  id: string;
} & NotesData

export type RawNote = {
  id: string;
} & RawNoteData

export type RawNoteData = {
  title: string;
  description: string;
  tagIds: string[];
  themeId?: string;
  theme?: NoteTheme;
}


function App() {

  const [tags, setTags] = useLocalStorage<Tag[]>("Tags", [])
  const [notes, setNotes] = useLocalStorage<RawNote[]>("Notes", []);
  const [mode, setMode] = useLocalStorage<PaletteMode>("themeMode", "light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const notesWithTags = useMemo(
    () => {
      return notes.map(note => {
        return {
          ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))
        }
      })
    }, [notes, tags]
  )

  function onCreateNote({ tags, ...data }: NotesData) {
    setNotes(prevNotes => {
      const themeSnapshot = getThemeById(data.themeId || "")
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id), themeId: data.themeId, theme: themeSnapshot }]
    })
  }

  function onUpdateNotes(id: string, { tags, ...data }: NotesData) {
    setNotes(prevNotes => {
      const themeSnapshot = getThemeById(data.themeId || "")
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id), themeId: data.themeId, theme: themeSnapshot }
        } else {
          return note
        }
      })
    })
  }

  function deleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        }
        return tag
      }
      )
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }


  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{
          position: 'fixed',
          top: "0%",
          left: "0%",
          maxWidth: "100%",
          inset: "0",
          height: "100%",
          zIndex: -1,
          pointerEvents: 'none'
        }}>
          <img src="/Notepad-bg.webp" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.35" }} alt="notepad-logo" />
        </div>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>
          }>
            <Routes>
              <Route path='/' element={<LandingPage />}></Route>
              <Route path='/notes' element={<NotesList notes={notesWithTags} availableTags={tags} updateTag={updateTag} deleteTag={deleteTag} />}></Route>
              <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}
              />} />
              <Route path="/themes" element={<ChooseTheme />} />


              <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
                <Route index element={<Note deleteNote={deleteNote} />} />
                <Route path='edit' element={<EditNotes onSubmit={onUpdateNotes} onAddTag={addTag} availableTags={tags} />} />

              </Route>

              <Route path='*' element={<Navigate to="/" />}></Route>
            </Routes>
          </Suspense>
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default App
