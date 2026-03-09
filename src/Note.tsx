import React from 'react';
import { Box, Button, Grid, Stack, Typography, useTheme, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PrintIcon from '@mui/icons-material/Print';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeContext } from './ThemeContext';
import { useNote } from "./useNote";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { loadFontsFromHtml, mapGoogleFontToPdfFont } from "./utils/GoogleFonts";


type NoteProps = {
    deleteNote: (id: string) => void
}

function renderHtmlToPdf(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const walk = (node: ChildNode, key: number): React.ReactElement | null => {
        if (node.nodeType === Node.TEXT_NODE) {
            return <Text key={key}>{node.textContent}</Text>;
        }

        if (!(node instanceof HTMLElement)) return null;

        const children = Array.from(node.childNodes).map((child, i) =>
            walk(child, i)
        );

        // Extract font-family from style attribute if present
        const fontFamily = node.style.fontFamily || 'Helvetica';
        // Clean font-family: remove quotes and get first font in list
        const cleanFont = fontFamily.replace(/["']/g, '').split(',')[0].trim();
        const pdfFont = mapGoogleFontToPdfFont(cleanFont);

        switch (node.tagName.toLowerCase()) {
            case "div":
                return <View key={key}>{children}</View>;

            case "br":
                return <Text key={key}>{"\n"}</Text>;

            case "strong":
                return <Text key={key} style={{ fontWeight: "bold", fontFamily: pdfFont }}>{children}</Text>;

            case "em":
                return <Text key={key} style={{ fontStyle: "italic", fontFamily: pdfFont }}>{children}</Text>;

            case "p":
                return <Text key={key} style={{ marginBottom: 8, fontFamily: pdfFont }}>{children}</Text>;

            case "h1":
                return <Text key={key} style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10, fontFamily: pdfFont }}>{children}</Text>;

            case "h2":
                return <Text key={key} style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8, fontFamily: pdfFont }}>{children}</Text>;

            case "h3":
                return <Text key={key} style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6, fontFamily: pdfFont }}>{children}</Text>;


            case "b":
                return <Text key={key} style={{ fontWeight: "bold", fontFamily: pdfFont }}>{children}</Text>;


            case "i":
                return <Text key={key} style={{ fontStyle: "italic", fontFamily: pdfFont }}>{children}</Text>;

            case "span":
                return (
                    <Text
                        key={key}
                        style={{ color: node.style.color || "black", fontFamily: pdfFont }}
                    >
                        {children}
                    </Text>
                );

            case "a":
                return (
                    <Text
                        key={key}
                        style={{ color: "blue", textDecoration: "underline", fontFamily: pdfFont }}
                    >
                        {children}
                    </Text>
                );

            case "img": {
                const src = node.getAttribute("src") || "";
                const widthAttr = node.getAttribute("width");

                return (
                    <View key={key} style={{ marginVertical: 10, alignItems: "center" }}>
                        <Image
                            src={src}
                            style={{ width: widthAttr ? Number(widthAttr) : 250 }}
                        />
                    </View>
                );
            }


            case "ul":
                return (
                    <View key={key} style={{ marginBottom: 8 }}>
                        {Array.from(node.children).map((li, i) => (
                            <Text key={i} style={{ fontFamily: pdfFont }}>• {li.textContent}</Text>
                        ))}
                    </View>
                );

            case "ol":
                return (
                    <View key={key} style={{ marginBottom: 8 }}>
                        {Array.from(node.children).map((li, i) => (
                            <Text key={i} style={{ fontFamily: pdfFont }}>{i + 1}. {li.textContent}</Text>
                        ))}
                    </View>
                );

            default:
                return <Text key={key} style={{ fontFamily: pdfFont }}>{children}</Text>;
        }
    };

    return Array.from(doc.body.childNodes).map((node, i) => walk(node, i));
}


export function Note({ deleteNote }: NoteProps) {
    const note = useNote();
    const theme = useTheme();
    const [bgColor, setBgColor] = useState("");
    const { mode, toggleTheme } = useThemeContext();
    const [infoDialog, setInfoDialog] = useState<{ open: boolean; title: string; message: string }>({ 
        open: false, 
        title: '', 
        message: '' 
    });

    // Load custom fonts from note HTML on mount
    useEffect(() => {
        loadFontsFromHtml(note.description);
    }, [note.description]);

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: bgColor,
            fontFamily: 'Helvetica',
            padding: 30,
        },
        title: {
            fontSize: 32,
            marginBottom: 10,
            fontWeight: 'bold',
        },
        tags: {
            flexDirection: 'row',
            marginBottom: 20,
            flexWrap: 'wrap',
        },
        tag: {
            backgroundColor: '#1976d2',
            color: 'white',
            paddingVertical: 4,
            paddingHorizontal: 8,
            marginRight: 8,
            marginBottom: 4,
            fontSize: 10,
            borderRadius: 4,
        },
        content: {
            fontSize: 12,
            lineHeight: 1.6,
        },
    });

    const pdfDocument = useMemo(() => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Title - {note.title}</Text>
                {note.tags.length > 0 && (
                    <View style={styles.tags}>
                        {note.tags.map((tag) => (
                            <Text key={tag.id} style={styles.tag}>
                                {tag.label}
                            </Text>
                        ))}
                    </View>
                )}
                <View style={styles.content}>
                    {renderHtmlToPdf(note.description)}
                </View>

            </Page>
        </Document>
    ), [note.title, note.tags, note.description, styles]);


    return (
        <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                py: 8,
                px: {
                    xs: 2,
                    md: 4,
                },
                minHeight: '100vh',
                animation: 'fadeIn 0.6s ease-out',
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            }}
        >
            <Box sx={{
                display:"flex",
                alignItems:"center",
                justifyContent:"flex-end",
                padding:"20px 0",
                width:"100%"
            }}>
                <Button
                    onClick={toggleTheme}
                    variant="outlined"
                    sx={{
                        '&:hover': { transform: 'scale(1.05)' },
                        borderRadius: { xs: "50px", sm:"12px"},
                        height:{ xs: "60px", sm:"auto"},
                        width:{ xs: "60px", sm:"auto"},
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

            <Box
                id="note-pdf-content"
                sx={{
                    maxWidth: '1200px', margin: '0 auto',
                    py: 6,
                    px: {
                        xs: 2,
                        md: 4,
                    },
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backgroundColor: bgColor || theme.palette.background.paper,
                }}
            >
                {/* Header section */}
                <Grid
                    container
                    spacing={2}
                >
                    {/* Title + Tags */}
                    <Grid size={{ xs: 12 }} sx={{
                        mb: 2,
                        animation: 'slideInLeft 0.6s ease-out',
                        '@keyframes slideInLeft': {
                            from: {
                                opacity: 0,
                                transform: 'translateX(-30px)'
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateX(0)'
                            }
                        }
                    }}>
                        <Typography variant="h4" component="h1" sx={{
                            fontWeight: 'bold',
                            color: 'inherit',
                        }}>
                            <b>Title -</b>  {note.title}
                        </Typography>

                        {note.tags.length > 0 && (
                            <Stack
                                direction="row"
                                mt={1}
                                gap={2}
                                flexWrap="wrap"
                            >
                                {note.tags.map((tag) => (
                                    <Box
                                        key={tag.id}
                                        sx={{
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            bgcolor: (theme) => theme.palette.mode === 'light'
                                                ? 'rgba(51, 112, 255, 0.1)'
                                                : 'rgba(75, 132, 255, 0.2)',
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            border: '1px solid',
                                            borderColor: (theme) => theme.palette.mode === 'light'
                                                ? 'rgba(51, 112, 255, 0.2)'
                                                : 'transparent',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: (theme) => theme.palette.mode === 'light'
                                                    ? 'rgba(51, 112, 255, 0.2)'
                                                    : 'rgba(75, 132, 255, 0.3)',
                                                transform: 'translateY(-1px)',
                                            }
                                        }}
                                    >
                                        {tag.label}
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Grid>

                    {/* Action buttons */}
                    <Grid size={{ xs: 12, md: 6 }} className="pdf-exclude" sx={{
                        animation: 'slideInRight 0.6s ease-out',
                        '@keyframes slideInRight': {
                            from: {
                                opacity: 0,
                                transform: 'translateX(30px)'
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateX(0)'
                            }
                        }
                    }}>
                        <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start" }} flexWrap="wrap">
                            <Button
                                component={Link}
                                to={`/${note.id}/edit`}
                                variant="contained"
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/notes"
                                onClick={() => {
                                    deleteNote(note.id);
                                }}
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(255,0,0,0.3)',
                                        borderColor: '#d32f2f',
                                        color: '#d32f2f'
                                    }
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                component={Link}
                                to="/notes"
                                variant="outlined"
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                Back
                            </Button>

                        </Stack>
                    </Grid>

                    <Stack direction="row" sx={{ gap: "20px" }} flexWrap="wrap" alignItems="center" className="pdf-exclude">
                        <Box sx={{
                            border: '2px solid #ddd',
                            borderRadius: { xs: "50px", sm:"12px"},
                            p: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Typography variant="caption" sx={{ display: { sm: "inline-block", xs: "none" } }}>Background:</Typography>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: 'none',
                                    padding: '5px',
                                    borderRadius: '50px',
                                    cursor: 'pointer'
                                }}
                            />
                        </Box>

                        <Stack direction="row" alignItems="center" gap={0.5}>
                            <PDFDownloadLink
                                document={pdfDocument}
                                fileName={`${note.title || 'note'}.pdf`}
                                style={{ textDecoration: 'none' }}
                            >
                                {({ loading }) => (
                                    <Button
                                        variant="outlined"
                                        disabled={loading}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    >
                                        {loading ? 'Generating...' : 'Download PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                            <Tooltip title="Lesser file size but only default fonts and formattings supported" arrow sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <IconButton size="small">
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <IconButton 
                                size="small" 
                                sx={{ display: { xs: 'block', sm: 'none' } }}
                                onClick={() => setInfoDialog({ 
                                    open: true, 
                                    title: 'Download PDF', 
                                    message: 'Less file size but only default fonts support.Your chosen fonts may fallback to Helvetica/Times/Courier.' 
                                })}
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Stack>

                        <Stack direction="row" alignItems="center" gap={0.5}>
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={() => window.print()}
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Print to PDF</Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Print</Box>
                            </Button>
                            <Tooltip title="Higher size but Perfect quality, all fonts and formattings preserved" arrow sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <IconButton size="small">
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <IconButton 
                                size="small" 
                                sx={{ display: { xs: 'block', sm: 'none' } }}
                                onClick={() => setInfoDialog({ 
                                    open: true, 
                                    title: 'Print to PDF (some mobiles may not support)', 
                                    message: 'Higher file size but Perfect quality with all fonts and formatting preserved. Tap Print, then select "Save as PDF" from your device\'s print dialog.' 
                                })}
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Stack>

                </Grid>



                {/* Description */}
                <Box mt={4}
                    sx={{
                        textDecoration: 'none',
                        backgroundColor: 'transparent',

                        borderRadius: 3,
                        textWrap: 'break-word',
                        boxShadow: 3,
                        padding: 3,
                        animation: 'fadeInUp 0.6s ease-out',
                        animationDelay: '0.2s',
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
                        },
                        "& pre": {
                            overflowX: "auto",
                            maxWidth: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            borderRadius: 2,
                            p: 2,
                            my: 2
                        },
                        "& code": {
                            fontFamily: "monospace !important"
                        }
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

            <Dialog 
                open={infoDialog.open} 
                onClose={() => setInfoDialog({ ...infoDialog, open: false })}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>{infoDialog.title}</DialogTitle>
                <DialogContent>
                    <Typography>{infoDialog.message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInfoDialog({ ...infoDialog, open: false })} variant="contained">
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>

    );
}
