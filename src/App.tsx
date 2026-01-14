import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import background from './assets/background.jpg'
import NewNote from './NewNote'
import LandingPage from './LandingPage'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useLocalStorage } from "usehooks-ts";
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import NotesList from './NotesList';
import NoteLayout from './NoteLayout';
import { Note } from './Note';
import EditNotes from './EditNotes';
import { Box, Typography } from '@mui/material';


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
      backgroundImage: `url(${background})`,
      backgroundRepeat: "repeat",
      backgroundSize: "auto",
      backgroundAttachment: "fixed",
      backgroundPosition: "center center",
      padding: ' 0'
    }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: "light", fontFamily: "Times New Roman", fontSize: "calc(10px + (17 - 10) * ((100vw - 320px) / (1820 - 320)))", position: "absolute", top: "5%", right: "5%", color: "text.secondary", fontStyle: "italic", zIndex: 1 }}>
          <span style={{ fontWeight: "bold" }}>Note:</span> your files are auto saved
        </Typography>
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
      </Box>

    </div>
  )
}

export default App
