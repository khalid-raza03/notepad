import { Box, Typography } from '@mui/material'
import { NoteForm } from './NoteForm'
import type { NotesData, Tag } from './App'
import { useNote } from './useNote'

type EditNoteProps = {
    onSubmit: (id: string, data: NotesData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

const EditNotes = ({ onSubmit, onAddTag, availableTags }: EditNoteProps) => {
    const note = useNote()

    return (
        <Box sx={{
        maxWidth: '1200px', margin: '0 auto', padding: {
          xs: 2,
          md: 4,
        },
      }}>
            <Typography variant="h3" sx={{
                textAlign: "center",
                fontFamily: "Times New Roman"
            }}> Edit your note</Typography>
            <NoteForm title={note.title} description={note.description} tags={note.tags} onSubmit={data => onSubmit(note.id, data)} onAddTag={onAddTag} availableTags={availableTags} />
        </Box>

    )
}

export default EditNotes

