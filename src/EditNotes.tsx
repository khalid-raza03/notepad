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
            maxWidth: '1200px',
            margin: '0 auto',
            padding: {
                xs: 2,
                md: 4,
            },
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
                fontFamily: "Times New Roman",
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                fontSize: "calc(24px + (48 - 24) * ((100vw - 320px) / (1820 - 320)))",
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
                animation: 'gradientShift 3s ease infinite',
                '@keyframes gradientShift': {
                    '0%, 100%': {
                        filter: 'hue-rotate(0deg)'
                    },
                    '50%': {
                        filter: 'hue-rotate(20deg)'
                    }
                }
            }}> Edit your note</Typography>
            <NoteForm title={note.title} description={note.description} tags={note.tags} themeId={note.themeId} onSubmit={data => onSubmit(note.id, data)} onAddTag={onAddTag} availableTags={availableTags} />
        </Box>

    )
}

export default EditNotes

