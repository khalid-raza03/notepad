import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageResizeComponent } from "./ImageResizeComponent";

export const ResizableImage = Image.extend({
  name: "image",

  // Block node — stays as a div
  inline: false,
  group: "block",
  // Allow inline text content so NodeViewContent can render an editable area beside the image
  content: "inline*",
  atom: false,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: 250,
        parseHTML: (element) => element.getAttribute("width") || 250,
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },

      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) =>
          attributes.height ? { height: attributes.height } : {},
      },

      align: {
        default: "left",
        parseHTML: (element) =>
          element.getAttribute("data-align") || "left",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent);
  },
});
