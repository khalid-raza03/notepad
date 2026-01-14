import { Box, Button, Card, CardContent, Grid, Modal, Paper, Stack, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react";
import ReactSelect from "react-select";
import type { Tag, NoteProps } from "./App";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { ClearOutlined } from '@mui/icons-material';



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
            maxWidth: '1200px', margin: '0 auto', padding: {
                xs: 2,
                md: 4,
            },
        }}>
            <Stack spacing={4} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                    variant="h3" sx={{
                        fontWeight: "bold",
                        fontFamily: "Times New Roman",
                        fontSize: "calc(18px + (45 - 18) * ((100vw - 320px) / (1820 - 320)))"
                    }}
                >Your Notes List</Typography>

                <Grid sx={{ gap: "10px", display: "flex", justifyContent: "space-between" }} spacing={2}>
                    <Button
                        component={Link}
                        to="/new" variant="contained">Create</Button>
                    <Button variant="outlined" onClick={() => setOpen(true)} >Edit Tags </Button>
                </Grid>

            </Stack>


            <Grid component="form" sx={{ mt: 4 }}>

                {/* title */}
                <TextField
                    label="Search by Title"
                    required
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                        },
                    }}
                />
            </Grid>

            {/* tags */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ my: 2 }}>
                <ReactSelect
                    isMulti
                    styles={{
                        control: (base) => ({
                            ...base,
                            padding: '10px',

                            borderRadius: 12
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
            </Grid>

            {/* Notes */}
            <Grid container spacing={3}>
                {filteredNotes.map((note) => (
                    <Grid
                        key={note.id}
                        size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
                    >
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Grid>
                ))}
            </Grid>

            <EditTagsModal updateTag={updateTag} deleteTag={deleteTag} availableTags={availableTags} opened={open} handleClose={() => setOpen(false)} />
        </Box>
    )
}

type simplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}


function NoteCard({ id, title, tags }: simplifiedNote) {
    return (
        <Card
            component={Link}
            to={`/${id}`}
            sx={{
                textDecoration: 'none',
                background: '#ffffff5a',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'text.primary', fontStyle: 'italic' }}>
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
                                    fontSize: '0.75rem'
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
    }), []);




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
                        <Button variant="contained" onClick={handleSaveAll}>Save</Button>
                        <Button onClick={handleClose}><ClearOutlined sx={{ fontSize: "25px", color: "black" }} /></Button>
                    </Stack>
                </Grid>

                <Box mt={2}

                >
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Grid container rowSpacing={1} alignItems={"center"}
                                justifyContent={"space-between"}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={tag.id}>
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
                                                },
                                            }}
                                        />
                                    </Item>
                                </Grid>
                                <Grid size={{ xs: 'auto' }}>
                                    <Item sx={{ color: "white", bgcolor: "#f73333" }}>
                                        <Button onClick={() => deleteTag(tag.id)} sx={{ minWidth: "0" }}>
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