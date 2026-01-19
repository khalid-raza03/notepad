import { Box, Button, Container, Typography, Stack, Card, CardContent, Fade, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LandingPage = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: <EditNoteIcon sx={{ fontSize: 48, color: '#87CEEB' }} />,
            title: 'Rich Text Editor',
            description: 'Powerful TipTap editor with formatting toolbar for bold, italic, headings, lists, and more.'
        },
        {
            icon: <LocalOfferIcon sx={{ fontSize: 48, color: '#87CEEB' }} />,
            title: 'Tag Management',
            description: 'Organize your notes with custom tags. Create, edit, and filter notes effortlessly.'
        },
        {
            icon: <PictureAsPdfIcon sx={{ fontSize: 48, color: '#87CEEB' }} />,
            title: 'PDF Export',
            description: 'Download your notes as beautifully formatted PDF documents with a single click.'
        },
        {
            icon: <SaveIcon sx={{ fontSize: 48, color: '#87CEEB' }} />,
            title: 'Auto-Save',
            description: 'Never lose your work. All notes are automatically saved to your browser\'s local storage. But do not delete cache of your browser otherwise you can loose your work. Persistent saving feature will be added in future.' 
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(135, 206, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                    animation: 'pulse 8s ease-in-out infinite',
                },
                '@keyframes pulse': {
                    '0%, 100%': {
                        opacity: 1,
                    },
                    '50%': {
                        opacity: 0.8,
                    },
                },
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
                <Box >

                    {/* Hero Section */}
                    <Fade in={show} timeout={1000}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                mb: 8,
                                mt: 4,
                            }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #e0f7ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    mb: 3,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'Verdana, sans-serif',
                                }}
                            >
                                NotePad
                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontSize: { xs: '1.25rem', md: '1.5rem', lg: '1.7rem' },
                                    fontWeight: 500,
                                    color: '#ffffff',
                                    mb: 3,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    mx: 'auto',
                                    lineHeight: 1.4,
                                    fontFamily: 'Verdana, sans-serif',
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
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    fontWeight: 600,
                                    px: 5,
                                    py: 2,
                                    borderRadius: '50px',
                                    background: 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                                    color: '#fff',
                                    boxShadow: '0 8px 32px rgba(135, 206, 235, 0.4)',
                                    transition: 'all 0.5s ease-in-out',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4A90E2 0%, #87CEEB 100%)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 12px 40px rgba(135, 206, 235, 0.6)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Fade>

                    {/* Features Section */}
                    <Box sx={{ mt: 4 }}>
                        <Fade in={show} timeout={1500}>
                            <Typography
                                variant="h3"
                                sx={{
                                    textAlign: 'center',
                                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    mb: 6,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                }}
                            >
                                Powerful Features
                            </Typography>
                        </Fade>

                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={3}
                            sx={{
                                flexWrap: 'wrap',
                                justifyContent: 'center',
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
                                            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' },
                                            maxWidth: { xs: '100%', md: 'calc(50% - 12px)', lg: '280px' },
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 48px rgba(135, 206, 235, 0.3)',
                                                background: 'rgba(255, 255, 255, 0.15)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                            <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#ffffff',
                                                    mb: 1.5,
                                                    fontSize: '1.25rem',
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.85)',
                                                    lineHeight: 1.6,
                                                    fontSize: '0.95rem',
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
                </Box>

                {/* Footer CTA */}
                <Fade in={show} timeout={2000}>
                    <Box sx={{ textAlign: 'center', mt: 10, mb: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#ffffff',
                                mb: 3,
                                fontWeight: 600,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            }}
                        >
                            Ready to transform your note-taking?
                        </Typography>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/notes')}
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                borderRadius: '50px',
                                borderColor: '#87CEEB',
                                borderWidth: 2,
                                color: '#ffffff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderWidth: 2,
                                    borderColor: '#ffffff',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Start Creating Notes
                        </Button>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default LandingPage;
