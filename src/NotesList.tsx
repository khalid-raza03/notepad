import { Box, Button, Card, CardContent, Grid, Modal, Paper, Stack, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react";
import ReactSelect from "react-select";
import type { Tag, NoteProps } from "./App";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { ClearOutlined } from '@mui/icons-material';
import { Paintbrush } from "lucide-react";



type NoteListProps = {
    availableTags: Tag[]
    notes: NoteProps[]
    updateTag: (id: string, label: string) => void
    deleteTag: (id: string) => void
}



export default function NotesList({ availableTags, notes, updateTag, deleteTag }: NoteListProps) {
    const [selectedTag, setSelectedTag] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) && (selectedTag.length == 0 || selectedTag.every((tag: Tag) => note.tags.some((noteTag: Tag) => noteTag.id === tag.id)))
        })
    }, [title, selectedTag, notes])

    return (
        <Box sx={{
            backgroundImage: "url('/background.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
            minHeight: '100vh',
            paddingTop: {
                xs: '30px',
                md: '60px'
            },
            animation: 'fadeIn 0.5s ease-in',
            '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 }
            }
        }}>
            <Box sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: {
                    xs: 2,
                    md: 4,
                },
            }}>
                {/* Header Section */}
                <Stack
                    spacing={3}
                    sx={{
                        mb: 4,
                        animation: 'slideDown 0.6s ease-out',
                        '@keyframes slideDown': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(-30px)'
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        spacing={2}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: "bold",
                                fontFamily: "Times New Roman",
                                fontSize: "calc(24px + (45 - 24) * ((100vw - 320px) / (1820 - 320)))",
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >Your Notes List</Typography>

                        <Stack direction="row" flexWrap={'wrap'} gap={'10px'} alignItems={'flex-start'} >
                            <Button
                                component={Link}
                                to="/new"
                                variant="contained"
                                sx={{
                                    animation: 'pulse 2s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%, 100%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.05)' }
                                    },
                                    '&:hover': {
                                        animation: 'none',
                                        transform: 'scale(1.08)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                                    },
                                    transition: 'all 0.3s ease',
                                    fontSize: {
                                        xs: "12px",
                                        lg: "16px"
                                    }
                                }}
                            >Create</Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpen(true)}
                                sx={{

                                    transition: 'all 0.3s ease-in-out',
                                    fontSize: { xs: '12px', lg: '16px' },
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    },
                                }}
                            >
                                Edit Tags
                            </Button>


                            <Button
                                component={Link}
                                to="/themes"
                                variant="contained"
                                sx={{
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease-in-out',
                                    backgroundColor: '#ba127d',
                                    fontSize: {
                                        xs: "12px",
                                        lg: "16px"
                                    },

                                }}
                            ><span style={{ margin: "0 6px" }}>Choose a Theme</span>  <Paintbrush /> </Button>
                        </Stack>
                    </Stack>

                    {/* Search and Filter Section */}
                    <Stack spacing={2}>
                        <TextField
                            label="Search by Title"
                            required
                            fullWidth
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
                                    }
                                },
                            }}
                        />

                        <ReactSelect
                            isMulti
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    padding: '10px',
                                    borderRadius: 12,
                                    transition: 'all 0.3s ease',
                                    boxShadow: state.isFocused ? '0 6px 16px rgba(102, 126, 234, 0.3)' : 'none',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }
                                })
                            }}
                            options={availableTags.map(tag => ({
                                value: tag.id,
                                label: tag.label
                            }))}
                            value={selectedTag.map(tag => ({
                                value: tag.id,
                                label: tag.label
                            }))}
                            onChange={tags => {
                                setSelectedTag((tags || []).map((tag: { value: string; label: string }) => ({
                                    id: tag.value,
                                    label: tag.label
                                })));
                            }}
                            placeholder="Filter by Tags"
                            isClearable
                        />
                    </Stack>
                </Stack>

                {/* Notes Grid */}
                <Grid container spacing={3}>
                    {filteredNotes.map((note, index) => (
                        <Grid
                            key={note.id}
                            size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
                            sx={{
                                animation: 'fadeInUp 0.5s ease-out',
                                animationDelay: `${index * 0.1}s`,
                                animationFillMode: 'both',
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
                            }}
                        >
                            <NoteCard id={note.id} title={note.title} tags={note.tags} theme={((note as any).theme)} />
                        </Grid>
                    ))}
                </Grid>

                <EditTagsModal updateTag={updateTag} deleteTag={deleteTag} availableTags={availableTags} opened={open} handleClose={() => setOpen(false)} />
            </Box>
        </Box>
    )
}

type simplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}


function NoteCard({ id, title, tags, theme }: simplifiedNote & { theme?: any }) {
    const baseSx: any = {
        textDecoration: 'none',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
        }
    };

    const themeSx = theme?.containerSx ?? { background: '#ffffff5a' };

    return (
        <Card
            component={Link}
            to={`/${id}`}
            sx={{
                ...baseSx,
                ...themeSx,
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: "calc(16px + (24 - 16) * ((100vw - 320px) / (1820 - 320)))",
                    fontStyle: 'italic',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                        color: '#667eea'
                    }
                }}>
                    {title}
                </Typography>
                {tags.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {tags.map(tag => (
                            <Box
                                key={tag.id}
                                sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                {tag.label}
                            </Box>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}


type EditTagsProp = {
    availableTags: Tag[]
    opened: boolean
    handleClose: () => void
    updateTag: (id: string, label: string) => void
    deleteTag: (id: string) => void
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));


function EditTagsModal({ availableTags, handleClose, opened, updateTag, deleteTag }: EditTagsProp) {
    const [editingTags, setEditingTags] = useState<{ [key: string]: string }>({});

    const handleSaveAll = () => {
        Object.entries(editingTags).forEach(([tagId, newLabel]) => {
            const originalTag = availableTags.find(tag => tag.id === tagId);
            if (originalTag && newLabel.trim() !== '' && newLabel !== originalTag.label) {
                updateTag(tagId, newLabel.trim());
            }
        });
        setEditingTags({});
        handleClose();
    };

    const style = useMemo(() => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '520px',
        maxHeight: '80vh',
        width: { xs: "100%", md: "90%" },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 0 0 1px rgba(255,255,255,0.2)
  `,
        py: 4,
        px: {
            xs: 2,
            md: 4,
        },
        overflowY: 'auto',
        transition: 'all 0.3s ease-in-out',
        animation: opened ? 'slideIn 0.4s ease-out' : 'none',
        '@keyframes slideIn': {
            from: {
                opacity: 0,
                transform: 'translate(-50%, -45%) scale(0.9)'
            },
            to: {
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)'
            }
        },

        '&::-webkit-scrollbar': { width: '10px' },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, rgba(247,200,99,0.9), rgba(247,200,99,0.4))',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-button': { display: 'none' },
    }), [opened]);



    return (
        <Modal
            open={opened}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableAutoFocus
            disableEnforceFocus
            sx={{ margin: "0 20px" }}
        >
            <Box sx={style}>
                <Grid display={"flex"} mb={"1rem"} width={"100%"} justifyContent={"space-between"}>
                    <Typography id="modal-modal-title" variant="h5" component="h3" sx={{ fontWeight: 600, fontSize: { xs: "18px", md: "24px" } }}>
                        Edit your tags
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            onClick={handleSaveAll}
                            sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
                                }
                            }}
                        >Save</Button>
                        <Button
                            onClick={handleClose}
                            sx={{
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'rotate(90deg)',

                                }
                            }}
                        ><ClearOutlined sx={{ fontSize: "25px", color: "black" }} /></Button>
                    </Stack>
                </Grid>

                <Box mt={2}>
                    <Stack gap={2}>
                        {availableTags.map((tag, index) => (
                            <Grid
                                container
                                rowSpacing={1}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                key={tag.id}
                                sx={{
                                    animation: 'fadeInLeft 0.4s ease-out',
                                    animationDelay: `${index * 0.05}s`,
                                    animationFillMode: 'both',
                                    '@keyframes fadeInLeft': {
                                        from: {
                                            opacity: 0,
                                            transform: 'translateX(-20px)'
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: 'translateX(0)'
                                        }
                                    }
                                }}
                            >
                                <Grid size={{ xs: 9 }}>
                                    <Item sx={{ bgcolor: "transparent" }}>
                                        <TextField
                                            label="Tag Name"
                                            fullWidth
                                            value={editingTags[tag.id] ?? tag.label}
                                            onChange={(e) => setEditingTags(prev => ({
                                                ...prev,
                                                [tag.id]: e.target.value
                                            }))}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                                    }
                                                },
                                            }}
                                        />
                                    </Item>
                                </Grid>
                                <Grid size={{ xs: 'auto' }}>
                                    <Item sx={{ bgcolor: "#d32f2f", borderRadius: "50%" }}>
                                        <Button
                                            onClick={() => deleteTag(tag.id)}
                                            sx={{
                                                minWidth: "0",
                                                transition: 'all 0.3s ease',
                                                borderRadius: "50%",
                                                '&:hover': {
                                                    transform: 'scale(1.1) rotate(90deg)',
                                                    backgroundColor: '#d32f2f'
                                                }
                                            }}
                                        >
                                            <ClearOutlined sx={{ fontSize: { xs: "20px", md: "35px" }, color: "white" }} />
                                        </Button>
                                    </Item>
                                </Grid>
                            </Grid>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Modal>
    )
}