import { Box, Button, Grid, Stack, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNote } from "./useNote";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";


type NoteProps = {
    deleteNote: (id: string) => void
}

export function Note({ deleteNote }: NoteProps) {
    const note = useNote();
    const navigate = useNavigate()
    const [bgColor, setBgColor] = useState("#ffffff");
    const [fontFamily, setFontFamily] = useState("sans-serif");
    const [fileName, setFileName] = useState(note.title || "note");
    const [openDialog, setOpenDialog] = useState(false);


    const handleDownloadPDF = async () => {
        const element = document.getElementById("note-pdf-content");
        const buttonsContainer = document.querySelector(".pdf-exclude");

        if (!element) return;

        // Hide buttons for PDF
        if (buttonsContainer) {
            (buttonsContainer as HTMLElement).style.display = "none";
        }

        const originalBg = element.style.background;
        const originalFont = element.style.fontFamily;
        const originalPadding = element.style.padding;

        element.style.background = bgColor;
        element.style.fontFamily = fontFamily;
        element.style.padding = "20px";

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Add padding to PDF
        const margin = 10;
        const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);

        // Restore original styles
        element.style.background = originalBg;
        element.style.fontFamily = originalFont;
        element.style.padding = originalPadding;

        // Show buttons again
        if (buttonsContainer) {
            (buttonsContainer as HTMLElement).style.display = "flex";
        }

        setOpenDialog(false);
    };


    return (
        <Box
            id="note-pdf-content"
            sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: bgColor,
                fontFamily: fontFamily,
                transition: 'all 0.3s ease'
            }}
        >
            {/* Header section */}
            <Grid
                container
                spacing={2}
            >
                {/* Title + Tags */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="h4" component="h1">
                        <b>Title:</b>  {note.title}
                    </Typography>

                    {note.tags.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={1}
                            mt={1}
                            flexWrap="wrap"
                        >
                            {note.tags.map((tag) => (
                                <Box
                                    key={tag.id}
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        bgcolor: "primary.main",
                                        color: "white",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {tag.label}
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Grid>

                {/* Action buttons */}
                <Grid size={{ xs: 12, md: 6 }} className="pdf-exclude">
                    <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start" }} flexWrap="wrap">
                        <Button
                            component={Link}
                            to={`/${note.id}/edit`}
                            variant="contained"
                        >
                            Edit
                        </Button>
                        <Button variant="outlined" onClick={() => {
                            deleteNote(note.id);
                            navigate("/");
                        }}>
                            Delete
                        </Button>
                        <Button
                            component={Link}
                            to="/"
                            variant="outlined"
                        >
                            Back
                        </Button>
                    </Stack>
                </Grid>

                <Stack direction="row" sx={{ gap: "10px" }} flexWrap="wrap" alignItems="center" className="pdf-exclude">
                    {/* Background color */}
                    <Box sx={{
                        border: '2px solid #ddd',
                        borderRadius: 1,
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Typography variant="caption">Background:</Typography>
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            style={{
                                width: '40px',
                                height: '30px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        />
                    </Box>

                    {/* Font family */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Font Family</InputLabel>
                        <Select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            label="Font Family"
                            size="small"
                        >
                            {/* Generic families */}
                            <MenuItem value="serif">Serif (Default)</MenuItem>
                            <MenuItem value="sans-serif">Sans-serif</MenuItem>
                            <MenuItem value="monospace">Monospace</MenuItem>
                            <MenuItem value="cursive">Cursive</MenuItem>

                            {/* Specific system fonts */}
                            <MenuItem value="Verdana, Geneva, sans-serif">Verdana</MenuItem>
                            <MenuItem value="'Times New Roman', Times, serif">Times New Roman</MenuItem>
                            <MenuItem value="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">
                                Franklin Gothic
                            </MenuItem>
                            <MenuItem value="'Lucida Sans', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif">
                                Lucida Sans
                            </MenuItem>
                            <MenuItem value="'Gill Sans', 'Gill Sans MT', Calibri, sans-serif">
                                Gill Sans
                            </MenuItem>
                            <MenuItem value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
                                Segoe UI
                            </MenuItem>
                            <MenuItem value="'Trebuchet MS', Helvetica, sans-serif">
                                Trebuchet MS
                            </MenuItem>
                            <MenuItem value="Arial, Helvetica, sans-serif">
                                Arial
                            </MenuItem>
                            <MenuItem value="Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">
                                Cambria
                            </MenuItem>
                            <MenuItem value="Georgia, 'Times New Roman', Times, serif">
                                Georgia
                            </MenuItem>
                            <MenuItem value="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif">
                                Impact
                            </MenuItem>
                        </Select>

                    </FormControl>

                    <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                        Download PDF
                    </Button>
                </Stack>

            </Grid>

            {/* PDF Download Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Download PDF</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="File Name"
                        fullWidth
                        variant="outlined"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleDownloadPDF} variant="contained">Download</Button>
                </DialogActions>
            </Dialog>

            {/* Description */}
            <Box mt={4}
                sx={{
                    textDecoration: 'none',
                    backgroundColor: '#f8cd6a7e',
                    borderRadius: 3,
                    boxShadow: 5,
                    padding: 3
                }}>
                <div 
                    dangerouslySetInnerHTML={{ __html: note.description }}
                    style={{ 
                        color: 'inherit',
                        fontFamily: 'inherit'
                    }}
                />
            </Box>
        </Box>
    );
}
