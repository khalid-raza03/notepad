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
            minHeight: '100vh',
            animation: 'fadeInUp 0.6s ease-out',
            '@keyframes fadeInUp': {
                from: {
                    opacity: 0,
                    transform: 'translateY(30px)'
                },
                to: {
                    opacity: 1,
                    transform: 'translateY(0)'
                }
            }
        }}>
            <Typography variant="h3" sx={{
                textAlign: "center",
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: 'text.primary',
                py: 4,
            }}> Edit your note</Typography>
            <NoteForm title={note.title} description={note.description} tags={note.tags} themeId={note.themeId} onSubmit={data => onSubmit(note.id, data)} onAddTag={onAddTag} availableTags={availableTags} />
        </Box>

    )
}

export default EditNotes

