import { Box, Typography } from '@mui/material'
import { NoteForm } from './NoteForm'
import type { NotesData, Tag } from './App'

type NewNoteProps = {
    onSubmit: (data: NotesData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

const NewNote = ({ onSubmit, onAddTag, availableTags }: NewNoteProps) => {
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
                fontFamily: "Times New Roman",
                fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                py: 2,
                animation: 'gradientShift 3s ease infinite',
                '@keyframes gradientShift': {
                    '0%, 100%': {
                        filter: 'hue-rotate(0deg)'
                    },
                    '50%': {
                        filter: 'hue-rotate(20deg)'
                    }
                }
            }}> Notepad</Typography>
            <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
        </Box>

    )
}

export default NewNote

