import { Extension } from "@tiptap/core";


export const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element =>
              element.style.fontSize?.replace("px", "") || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
          fontFamily: {
            default: null,
            parseHTML: element =>
              element.style.fontFamily || null,
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: "${attributes.fontFamily}"`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontSize: fontSize })
              .run();
          },

      unsetFontSize:
        () =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontSize: null })
              .run();
          },

      setFontFamily:
        (fontFamily: string) =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontFamily: fontFamily })
              .run();
          },

      unsetFontFamily:
        () =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontFamily: null })
              .run();
          },
    };
  },
});
