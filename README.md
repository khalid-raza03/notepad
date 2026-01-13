# Notepad App

A rich text notepad application built with React, TypeScript, and Material-UI. Features include rich text editing, tag management, PDF export, and local storage persistence.

## Features

- **Rich Text Editor**: TipTap editor with formatting toolbar (bold, italic, headings, lists)
- **Tag Management**: Create, edit, and delete tags with autocomplete
- **PDF Export**: Download notes as PDF with customizable styling
- **Search & Filter**: Search notes by title and filter by tags
- **Local Storage**: Automatic persistence of notes and tags
- **Responsive Design**: Material-UI components with mobile-friendly layout

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Material-UI (MUI) v7** for UI components
- **React Router** with HashRouter for navigation
- **TipTap** for rich text editing
- **jsPDF & html2canvas** for PDF generation
- **React Select** for tag management
- **usehooks-ts** for localStorage hook

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

- `App.tsx` - Main app with routing and state management
- `NoteForm.tsx` - Rich text editor form component
- `Note.tsx` - Note display with PDF export
- `NotesList.tsx` - Notes listing with search/filter
- `NoteLayout.tsx` - Layout wrapper for note routes
