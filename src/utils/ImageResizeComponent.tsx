import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export const ImageResizeComponent: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, selected, editor, getPos } = props;
  const { width, height, src, alt, title, align } = node.attrs;

  const [currentWidth, setCurrentWidth] = useState<number>(width || 250);
  const [currentHeight, setCurrentHeight] = useState<number | "auto">(
    height || "auto"
  );
  const [open, setOpen] = useState(false);
  const [tempWidth, setTempWidth] = useState<number>(width || 250);
  const [tempHeight, setTempHeight] = useState<number | "">(height || "");

  // Drag-resize state
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    setCurrentWidth(width || 250);
    setCurrentHeight(height || "auto");
  }, [width, height]);

  const handleSave = () => {
    updateAttributes({ width: tempWidth, height: tempHeight || null });
    setOpen(false);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempWidth(currentWidth);
    setTempHeight(currentHeight === "auto" ? "" : (currentHeight as number));
    setOpen(true);
  };

  const handleImageClick = () => {
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.commands.setNodeSelection(pos);
      }
    }
  };

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      startX.current = e.clientX;
      startWidth.current = currentWidth;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current) return;
        const diff = moveEvent.clientX - startX.current;
        const newWidth = Math.max(50, Math.min(1000, startWidth.current + diff));
        setCurrentWidth(newWidth);
      };

      const onMouseUp = (upEvent: MouseEvent) => {
        if (!isResizing.current) return;
        isResizing.current = false;
        const diff = upEvent.clientX - startX.current;
        const newWidth = Math.max(50, Math.min(1000, startWidth.current + diff));
        updateAttributes({ width: newWidth });
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [currentWidth, updateAttributes]
  );

  return (
    // div with display:flex and gap:20px — image left (or right/top), editable text flows around
    <NodeViewWrapper
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        flexDirection: align === "right" ? "row-reverse" : align === "center" ? "column" : "row",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {/* ── Image with resize controls ── */}
      <div
        onClick={handleImageClick}
        style={{
          position: "relative",
          flexShrink: 0,
          outline: selected ? "2px solid #3b82f6" : "none",
          outlineOffset: "2px",
          borderRadius: "2px",
          lineHeight: 0,
          cursor: "pointer",
        }}
      >
        <img
          src={src}
          alt={alt}
          title={title}
          draggable={false}
          style={{
            width: currentWidth,
            height: currentHeight === "auto" ? "auto" : currentHeight,
            display: "block",
            maxWidth: "100%",
          }}
        />

        {/* Edit button */}
        {selected && (
          <Button
            onClick={handleOpen}
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              minWidth: "auto",
              width: "28px",
              height: "28px",
              backgroundColor: "#3b82f6",
              color: "white",
              zIndex: 10,
              "&:hover": { backgroundColor: "#2563eb" },
            }}
          >
            <EditIcon fontSize="small" />
          </Button>
        )}

        {/* Drag-to-resize handle */}
        {selected && (
          <Box
            onMouseDown={onMouseDown}
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: "14px",
              height: "14px",
              backgroundColor: "#3b82f6",
              borderRadius: "2px",
              cursor: "ew-resize",
              zIndex: 10,
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 2,
                borderRight: "2px solid white",
                borderBottom: "2px solid white",
              },
            }}
          />
        )}
      </div>

      {/* ── Right: Editable text area (NodeViewContent) ── */}
      <NodeViewContent
        style={{
          flex: 1,
          minWidth: 0,
          outline: "none",
          alignSelf: "stretch",
          lineHeight: "1.6",
          cursor: "text",
        }}
      />

      {/* Size edit dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Image Size</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
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
              onChange={(e) => setTempHeight(Number(e.target.value) || "")}
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