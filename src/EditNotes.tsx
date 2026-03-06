import { Box, Typography, Button } from '@mui/material'
import { NoteForm } from './NoteForm'
import type { NotesData, Tag } from './App'
import { useNote } from './useNote'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useThemeContext } from './ThemeContext'

type EditNoteProps = {
    onSubmit: (id: string, data: NotesData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

const EditNotes = ({ onSubmit, onAddTag, availableTags }: EditNoteProps) => {
    const note = useNote()
    const { mode, toggleTheme } = useThemeContext();

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    color: 'text.primary',
                }}>Edit your note</Typography>
                <Button
                    onClick={toggleTheme}
                    variant="outlined"
                    sx={{
                        '&:hover': { transform: 'scale(1.05)' },
                        borderRadius: { xs: "50px", sm: "8px" },
                        transition: 'all 0.3s ease-in-out',
                        color: 'text.primary',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography sx={{ display: { xs: "none", md: "block" }, margin: "0 6px" }}>
                        {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Typography>
                    {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </Button>
            </Box>
            <NoteForm title={note.title} description={note.description} tags={note.tags} themeId={note.themeId} onSubmit={data => onSubmit(note.id, data)} onAddTag={onAddTag} availableTags={availableTags} />
        </Box>
    )
}

export default EditNotes

