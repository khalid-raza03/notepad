import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import React, { useRef, useEffect, useState } from "react";

export const ImageResizeComponent: React.FC<NodeViewProps> = (props) => {
    const { node, updateAttributes, selected } = props;
    const { width, src, alt, title } = node.attrs;

    const [resizing, setResizing] = useState(false);
    const [currentWidth, setCurrentWidth] = useState(width);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    const currentWidthRef = useRef(width);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentWidth(width);
            currentWidthRef.current = width;
        }, 0);
        return () => clearTimeout(timer);
    }, [width]);

    const onMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        setResizing(true);
        startXRef.current = event.clientX;
        startWidthRef.current = currentWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startXRef.current;
            const newWidth = Math.max(50, startWidthRef.current + deltaX); // Min width 50px
            setCurrentWidth(newWidth);
            currentWidthRef.current = newWidth; // Update ref
        };

        const onMouseUp = () => {
            setResizing(false);
            updateAttributes({ width: currentWidthRef.current }); // Use ref value

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };


    return (
        <NodeViewWrapper className="image-resizer" style={{ display: "inline-block", position: "relative", lineHeight: 0 }}>
            <img
                src={src}
                alt={alt}
                title={title}
                width={currentWidth}
                style={{
                    display: "block",
                    maxWidth: "100%", 
                    height: "auto",
                    transition: resizing ? "none" : "width 0.2s ease-in-out"
                }}
            />

            {(selected || resizing) && (
                <div
                    className="resize-handle"
                    onMouseDown={onMouseDown}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#3b82f6", 
                        cursor: "nwse-resize",
                        zIndex: 10,
                        borderTopLeftRadius: "4px"
                    }}
                />
            )}
        </NodeViewWrapper>
    );
};
