import { Box, Button, Container, Typography, Stack, Card, CardContent, Fade, Grow, Zoom } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WavesIcon from '@mui/icons-material/Waves';

const LandingPage = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: <EditNoteIcon sx={{ fontSize: 48 }} />,
            title: 'Rich Text Editor',
            description: 'Powerful TipTap editor with formatting toolbar for bold, italic, headings, lists, and more.',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: <LocalOfferIcon sx={{ fontSize: 48 }} />,
            title: 'Tag Management',
            description: 'Organize your notes with custom tags. Create, edit, and filter notes effortlessly.',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            icon: <PictureAsPdfIcon sx={{ fontSize: 48 }} />,
            title: 'PDF Export',
            description: 'Download your notes as beautifully formatted PDF documents with a single click.',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            icon: <SaveIcon sx={{ fontSize: 48 }} />,
            title: 'Auto-Save',
            description: 'Never lose your work. All notes are automatically saved with local storage technology.',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
    ];

    return (
        <Box
            ref={containerRef}
            sx={{
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'url("/notepad-bg.jpg")',
                backgroundSize: { xs: "cover", md: "cover" },
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(237, 217, 146, 0.74) 0%, rgba(177, 210, 238, 0.89) 100%)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 0,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                    pointerEvents: 'none',
                    zIndex: 1,
                    transition: 'all 0.1s ease',
                }
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    zIndex: 1,
                }}
            >
                {[...Array(20)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, rgba(100,150,255,${Math.random() * 0.1}) 0%, transparent 70%)`,
                            borderRadius: '50%',
                            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </Box>

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
                <Helmet>
                    <title>Free Online Notepad - Create, Edit & Save Notes</title>
                    <meta name="description" content="A powerful, free online notepad with rich text editing, tag management, and PDF export. Automatically save your notes locally. No login required." />
                    <meta name="keywords" content="online notepad, free notepad, rich text editor, markdown editor, note taking app, pdf export notes" />
                    <link rel="canonical" href="https://notepad.solviaweb.com/" />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://notepad.solviaweb.com/" />
                    <meta property="og:title" content="Free Online Notepad - Create, Edit & Save Notes | SolviaWeb" />
                    <meta property="og:description" content="A powerful, free online notepad with rich text editing, tag management, and PDF export. Automatically save your notes locally." />
                    <meta property="og:image" content="https://notepad.solviaweb.com/og-image.jpeg" />

                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://notepad.solviaweb.com/" />
                    <meta property="twitter:title" content="Free Online Notepad - Create, Edit & Save Notes | SolviaWeb" />
                    <meta property="twitter:description" content="A powerful, free online notepad with rich text editing, tag management, and PDF export. Automatically save your notes locally." />
                    <meta property="twitter:image" content="https://notepad.solviaweb.com/og-image.jpeg" />

                    <script type="application/ld+json">
                        {`
                            {
                                "@context": "https://schema.org",
                                "@type": "WebApplication",
                                "name": "SolviaWeb Notepad",
                                "url": "https://notepad.solviaweb.com/",
                                "applicationCategory": "Productivity",
                                "operatingSystem": "Web",
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "USD"
                                },
                                "featureList": "Rich Text Editor, Tag Management, PDF Export, Auto-save"
                            }
                        `}
                    </script>
                </Helmet>

                {/* Hero Section with floating animation */}
                <Zoom in={show} timeout={800}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 4,
                            mt: 4,
                            p: { xs: "1.5rem", lg: "5rem" },
                            maxWidth: "90%",
                            marginX: "auto",
                            position: 'relative',

                        }}
                    >
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '4rem', lg: '8rem' },
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #e96715 0%, #e7d028 50%, #995c0d 100%)',
                                    
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    mb: 3,
                                    textShadow: '0 2px 2px 8px rgba(213, 226, 225, 0.52)',
                                    letterSpacing: '-0.02em',
                                    position: "relative",
                                    display: "inline-block",
                                    fontFamily: "'Dancing Script', cursive",

                                }}
                            >
                                NotePad

                                <img
                                    src="/feather.png"
                                    alt="feather"
                                    style={{
                                        position: "absolute",
                                        rotate: "25deg",
                                        bottom: "calc(-10% + (10 - 18) * ((100vw - 320px) / (1024 - 320)))",
                                        // ncsocn 
                                        right: "calc(-30% + (30 - 55) * ((100vw - 320px) / (1024 - 320)))",
                                        opacity: "0.5",
                                        width: "calc(60px + (150 - 40) * ((100vw - 320px) / (1920 - 320)))",
                                        animation: 'float 4s ease-in-out infinite',
                                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                                    }}
                                />
                            </Typography>
                        </Box>

                        <Typography
                            variant="h4" component="h2"
                            sx={{
                                fontSize: { xs: '1rem', md: '1.5rem', lg: '2rem' },
                                fontWeight: 600,
                                color: '#776107',
                                mb: 4,
                                fontStyle: "normal",
                                textShadow: '0 2px 15px rgba(0,0,0,0.05)',
                                mx: 'auto',
                                lineHeight: 1.6,
                                fontFamily: "'Dancing Script', cursive",
                                maxWidth: '800px',
                            }}
                        >
                            Create, Save, Download Your Notes with Our Amazing Editor
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/notes')}
                            sx={{
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                fontWeight: 600,
                                px: { xs: 6, lg: 12 },
                                py: { xs: 3, lg: 3 },
                                mt: 2,
                                borderRadius: '50px',
                                background:"#ffffff6a",
                                backdropFilter: 'blur(20px)',
                                color: '#e96715',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': {
                                    background: '#e966156f',
                                    color: '#ffffff',
                                    transform: 'translateY(-5px) scale(1.05)',
                                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
                                },
                                '&:active': {
                                    transform: 'translateY(-2px) scale(1.02)',
                                },
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Zoom>

                {/* Features Section */}
                <Box sx={{ mt: 8 }}>
                    <Fade in={show} timeout={1500}>
                        <Typography
                            variant="h3" component="h2"
                            sx={{
                                textAlign: 'center',
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 8,
                                textShadow: '0 5px 20px rgba(0,0,0,0.1)',
                                position: 'relative',
                                display: 'inline-block',
                                width: '100%',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '100px',
                                    height: '4px',
                                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                    borderRadius: '2px',
                                }
                            }}
                        >
                            Powerful Features
                        </Typography>
                    </Fade>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        sx={{
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: "30px",
                        }}
                    >
                        {features.map((feature, index) => (
                            <Grow
                                key={index}
                                in={show}
                                timeout={1000 + index * 200}
                                style={{ transformOrigin: '0 0 0' }}
                            >
                                <Card
                                    sx={{
                                        flex: { xs: '1 1 100%', md: '1 1 calc(50% - 15px)', lg: '1 1 calc(25% - 23px)' },
                                        maxWidth: { xs: '100%', md: 'calc(50% - 15px)', lg: '300px' },
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '30px',
                                        border: '1px solid rgba(255, 255, 255, 0.5)',
                                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.7) inset',
                                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: feature.gradient,
                                            opacity: 0,
                                            transition: 'opacity 0.5s ease',
                                            zIndex: 0,
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-15px) scale(1.02)',
                                            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.9) inset',
                                            '&::before': {
                                                opacity: 0.05,
                                            },
                                            '& .feature-icon': {
                                                transform: 'scale(1.1) rotate(5deg)',
                                            }
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        <Box
                                            className="feature-icon"
                                            sx={{
                                                mb: 3,
                                                transition: 'transform 0.5s ease',
                                                background: feature.gradient,
                                                py: 2,
                                                px: 3,
                                                borderRadius: '20px',
                                                display: 'inline-block',
                                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                                '& svg': {
                                                    color: 'white',
                                                    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))',
                                                }
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h6" component="h3"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#2c3e50',
                                                mb: 2,
                                                fontSize: '1.35rem',
                                                background: feature.gradient,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#34495e',
                                                lineHeight: 1.7,
                                                fontSize: '0.95rem',
                                                opacity: 0.9,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grow>
                        ))}
                    </Stack>
                </Box>

                {/* Footer CTA with enhanced animations */}
                <Fade in={show} timeout={2000}>
                    <Box sx={{ textAlign: 'center', mt: 12, mb: 4 }}>
                        <Typography
                            variant="h4" component="h2"
                            sx={{
                                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 4,
                                fontWeight: 600,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                animation: 'pulse 3s ease-in-out infinite',
                            }}
                        >
                            Ready to transform your note-taking?
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/notes')}
                            sx={{
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                px: 5,
                                py: 2,
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#ffffff',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    transform: 'translateY(-3px) scale(1.02)',
                                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
                                },
                            }}
                        >
                            Start Creating Notes
                            <AutoAwesomeIcon sx={{ ml: 1, fontSize: '1.2rem' }} />
                        </Button>
                    </Box>
                </Fade>
            </Container>

            {/* Global animations */}
            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes glow {
                        0%, 100% { filter: drop-shadow(0 0 20px rgba(45, 83, 251, 0.66)); }
                        50% { filter: drop-shadow(0 0 40px rgba(225, 22, 222, 0.42)); }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes wave {
                        0%, 100% { transform: rotate(-10deg) translateY(0); }
                        50% { transform: rotate(-10deg) translateY(-10px); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                `}
            </style>
        </Box>
    );
};

export default LandingPage;