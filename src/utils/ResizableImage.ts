import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageResizeComponent } from "./ImageResizeComponent";

export const ResizableImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: 250,
        parseHTML: element => element.getAttribute("width") || 250,
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },

      height: {
        default: null,
        parseHTML: element => element.getAttribute("height"),
        renderHTML: attributes =>
          attributes.height ? { height: attributes.height } : {},
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent);
  },
});
