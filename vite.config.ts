import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/notepad/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
          editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', 'html2canvas', 'jspdf'],
        },
      },
    },
  },
});
