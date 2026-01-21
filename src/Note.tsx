import React from 'react';
import { Box, Button, Grid, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNote } from "./useNote";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';


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

        switch (node.tagName.toLowerCase()) {
            case "p":
                return <Text key={key} style={{ marginBottom: 8 }}>{children}</Text>;

            case "h1":
                return <Text key={key} style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>{children}</Text>;

            case "h2":
                return <Text key={key} style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>{children}</Text>;

            case "h3":
                return <Text key={key} style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>{children}</Text>;

            
            case "b":
                return <Text key={key} style={{ fontWeight: "bold" }}>{children}</Text>;

          
            case "i":
                return <Text key={key} style={{ fontStyle: "italic" }}>{children}</Text>;

            case "span":
                return (
                    <Text
                        key={key}
                        style={{ color: node.style.color || "black" }}
                    >
                        {children}
                    </Text>
                );

            case "a":
                return (
                    <Text
                        key={key}
                        style={{ color: "blue", textDecoration: "underline" }}
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
                            <Text key={i}>• {li.textContent}</Text>
                        ))}
                    </View>
                );

            case "ol":
                return (
                    <View key={key} style={{ marginBottom: 8 }}>
                        {Array.from(node.children).map((li, i) => (
                            <Text key={i}>{i + 1}. {li.textContent}</Text>
                        ))}
                    </View>
                );

            default:
                return <Text key={key}>{children}</Text>;
        }
    };

    return Array.from(doc.body.childNodes).map((node, i) => walk(node, i));
}


export function Note({ deleteNote }: NoteProps) {
    const note = useNote();
    const navigate = useNavigate()
    const [bgColor, setBgColor] = useState("#ffffff");
    const [fontFamily, setFontFamily] = useState("sans-serif");

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: bgColor,
            fontFamily: fontFamily === 'serif' ? 'Times-Roman' : fontFamily === 'monospace' ? 'Courier' : 'Helvetica',
            padding: 30,
        },
        title: {
            fontSize: "calc(24px + (45 - 24) * ((100vw - 320px) / (1820 - 320)))",
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
            padding: '4 8',
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
                    backgroundColor: bgColor,
                    fontFamily: fontFamily,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    "& *": {
                        fontFamily: "inherit !important",
                    }
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            fontSize: "calc(24px + (45 - 24) * ((100vw - 320px) / (1820 - 320)))",
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
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
                                            bgcolor: "primary.main",
                                            color: "white",
                                            fontSize: "0.75rem",
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
                                onClick={() => {
                                    deleteNote(note.id);
                                    navigate("/");
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
                                    {loading ? 'Generating PDF...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </Stack>

                </Grid>



                {/* Description */}
                <Box mt={4}
                    sx={{
                        textDecoration: 'none',
                        backgroundColor: 'transparent',
                        borderRadius: 3,
                        textWrap: 'break-word',
                        boxShadow: 5,
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
                        dangerouslySetInnerHTML={{ __html: note.description.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}
                        style={{
                            color: 'inherit',
                            fontFamily: 'inherit'
                        }}
                    />
                </Box>
            </Box>
        </Stack>

    );
}
