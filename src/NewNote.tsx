import { Box, Typography, Button } from '@mui/material'
import { NoteForm } from './NoteForm'
import type { NotesData, Tag } from './App'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useThemeContext } from './ThemeContext'

type NewNoteProps = {
    onSubmit: (data: NotesData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

const NewNote = ({ onSubmit, onAddTag, availableTags }: NewNoteProps) => {
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
                }}>Create Note</Typography>
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
            <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
        </Box>
    )
}

export default NewNote

