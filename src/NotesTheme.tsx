import { Box, Card, CardContent, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton } from "@mui/material";
import { getStoredThemes, addTheme, deleteTheme, DEFAULT_NOTE_THEMES } from "./Themes";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { ArrowLeft, PlusIcon, Trash2 } from "lucide-react";

export default function ChooseTheme() {
    const navigate = useNavigate();

    const [themes, setThemes] = useState(() => getStoredThemes());


    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [textColor, setTextColor] = useState("#333333");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleOpen = () => {
        setName("");
        setTextColor("#333333");
        setBgColor("#ffffff");
        setImagePreview(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
            setBgColor("");
        };
        reader.readAsDataURL(file);
    };

    const handleCreate = () => {
        if (!name.trim()) return alert("Please enter a theme name");

        const id = `custom-${Date.now()}`;

        const containerSx: any = {};
        if (imagePreview) {
            containerSx.backgroundImage = `url(${imagePreview})`;
            containerSx.backgroundSize = 'cover';
            containerSx.backgroundPosition = 'center';
        } else if (bgColor) {
            containerSx.background = bgColor;
        }

        const editorSx: any = { color: textColor };

        const theme = { id, name, containerSx, editorSx };
        const next = addTheme(theme as any);
        setThemes(next);
        setOpen(false);
        navigate('/new', { state: { themeId: id } });
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", pt: 6 }}>

            <Button variant="contained" sx={{ mb: 4, position:"fixed", left:"5%", top:"5%"}} onClick={() => navigate(-1)}><ArrowLeft size={"16px"} /> Back to Notes</Button>
            <Typography variant="h4" mb={4} textAlign="center" fontFamily={'cursive'}>
                Choose a Note Theme
            </Typography>

            <Grid container spacing={3} display={'flex'} flexWrap={'wrap'} justifyContent={'center'} padding={'20px'}>
                {themes.map((theme) => (
                    <Grid item xs={12} sm={6} md={4} key={theme.id}>
                        <Card
                            onClick={() =>
                                navigate("/new", {
                                    state: { themeId: theme.id },
                                })
                            }
                            sx={{
                                cursor: "pointer",
                                borderRadius: '15px',
                                padding: '20px',
                                position: 'relative',
                                ...theme.containerSx,
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            {/* delete button for custom themes */}
                            {!DEFAULT_NOTE_THEMES.find((d) => d.id === theme.id) && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const ok = window.confirm(`Delete theme "${theme.name}"?`);
                                        if (!ok) return;
                                        const next = deleteTheme(theme.id);
                                        setThemes(next);
                                    }}
                                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.6)' }}
                                >
                                    <Trash2 />
                                </IconButton>
                            )}

                            <CardContent>
                                <Typography variant="h6">{theme.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        onClick={handleOpen}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "0.3s",
                            border: "2px dashed rgba(0,0,0,0.12)",
                            "&:hover": { transform: "scale(1.03)" },
                        }}
                    >
                        <CardContent sx={{ display: "flex", flexDirection: 'column', alignItems: "center", rowGap: "10px" }}>
                            <PlusIcon size={48} />
                            <Typography variant="h6" fontSize={'12px'} color="#686464">Create Custom </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth >
                <DialogTitle sx={{ backgroundColor: "#55048baf" }}>Create Custom Theme</DialogTitle>
                <DialogContent sx={{ backgroundColor: "#be8fde", padding: "40px 20px" }}>
                    <Stack spacing={2} mt={1}>
                        <TextField label="Theme name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField type="color" label="Text color" value={textColor} onChange={(e) => setTextColor(e.target.value)} sx={{ width: 110 }} />
                            <Box>

                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box flexDirection={'column'} display={'flex'}>

                                <TextField type="color" label="Background color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setImagePreview(null); }} sx={{ width: 110 }} />

                            </Box>
                            <Typography>OR</Typography>
                            <Button variant="outlined" startIcon={<PhotoCamera />} onClick={() => fileRef.current?.click()}>Pick Image</Button>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickImage} />
                        </Stack>

                        {imagePreview ? (
                            <Box sx={{ height: 140, borderRadius: 1, overflow: 'hidden', backgroundImage: `url(${imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        ) : (
                            <Box sx={{ height: 140, borderRadius: 1, background: bgColor, display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                                Your Image or background Preview
                            </Box>

                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#55048baf", padding: "20px 10px" }}>
                    <Button variant="outlined" onClick={handleClose} sx={{ color: "#ffffff", borderColor: "white" }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create Theme</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
