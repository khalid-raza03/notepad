import { Box, Typography } from '@mui/material'
import { NoteForm } from './NoteForm'
import type { NotesData, Tag } from './App'

type NewNoteProps = {
    onSubmit: (data: NotesData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

const NewNote = ({onSubmit, onAddTag, availableTags}: NewNoteProps) => {
    return (
        <Box>
            <Typography variant="h3" sx={{
                textAlign: "center",
                fontFamily: "Times New Roman"
            }}> Notepad</Typography>
            <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}/>
        </Box>

    )
}

export default NewNote

