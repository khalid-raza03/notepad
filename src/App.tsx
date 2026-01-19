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
import { Box, CircularProgress } from '@mui/material';

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
  tags: Tag[];
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
}


function App() {

  const [tags, setTags] = useLocalStorage<Tag[]>("Tags", [])
  const [notes, setNotes] = useLocalStorage<RawNote[]>("Notes", []);

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
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  function onUpdateNotes(id: string, { tags, ...data }: NotesData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
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
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url(${import.meta.env.BASE_URL}background.webp)`,
      backgroundRepeat: "repeat",
      backgroundSize: "auto",
      backgroundPosition: "center center",
      padding: ' 0'
    }}>
      <Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        }>
          <Routes>
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/notes' element={<NotesList notes={notesWithTags} availableTags={tags} updateTag={updateTag} deleteTag={deleteTag} />}></Route>
            <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}
            />} />

            <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
              <Route index element={<Note deleteNote={deleteNote} />} />
              <Route path='edit' element={<EditNotes onSubmit={onUpdateNotes} onAddTag={addTag} availableTags={tags} />} />

            </Route>

            <Route path='*' element={<Navigate to="/" />}></Route>
          </Routes>
        </Suspense>
      </Box>

    </div >
  )
}

export default App
