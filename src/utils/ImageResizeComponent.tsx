import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export const ImageResizeComponent: React.FC<NodeViewProps> = (props) => {
    const { node, updateAttributes, selected } = props;
    const { width, height, src, alt, title } = node.attrs;

    const [currentWidth, setCurrentWidth] = useState(width || 250);
    const [currentHeight, setCurrentHeight] = useState(height || 'auto');
    const [open, setOpen] = useState(false);
    const [tempWidth, setTempWidth] = useState(width || 250);
    const [tempHeight, setTempHeight] = useState(height || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentWidth(width || 250);
            setCurrentHeight(height || 'auto');
        }, 0);
        return () => clearTimeout(timer);
    }, [width, height]);

    const handleSave = () => {
        updateAttributes({ 
            width: tempWidth, 
            height: tempHeight || null 
        });
        setOpen(false);
    };

    const handleOpen = () => {
        setTempWidth(currentWidth);
        setTempHeight(currentHeight === 'auto' ? '' : currentHeight);
        setOpen(true);
    };

    return (
        <NodeViewWrapper className="image-resizer" style={{ display: "inline-block", position: "relative", lineHeight: 0 }}>
            <img
                src={src}
                alt={alt}
                title={title}
                width={currentWidth}
                height={currentHeight === 'auto' ? undefined : currentHeight}
                style={{
                    display: "block",
                    maxWidth: "100%",
                    height: currentHeight === 'auto' ? 'auto' : currentHeight
                }}
            />

            {selected && (
                <Button
                    onClick={handleOpen}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        minWidth: "auto",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        '&:hover': {
                            backgroundColor: "#2563eb"
                        }
                    }}
                >
                    <EditIcon fontSize="small" />
                </Button>
            )}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Edit Image Size</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
                        <TextField
                            label="Width (px)"
                            type="number"
                            value={tempWidth}
                            onChange={(e) => setTempWidth(Number(e.target.value))}
                            inputProps={{ min: 50, max: 1000 }}
                        />
                        <TextField
                            label="Height (px)"
                            type="number"
                            value={tempHeight}
                            onChange={(e) => setTempHeight(Number(e.target.value) || '')}
                            placeholder="Auto"
                            inputProps={{ min: 50, max: 1000 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </NodeViewWrapper>
    );
};