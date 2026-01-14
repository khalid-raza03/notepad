import {
  Box,
  Stack,
  Grid,
  TextField,
  Autocomplete,
  Chip,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { NotesData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <Stack direction="row" sx={{ gap: '10px' }} flexWrap="wrap" mb={2}>
      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBold().run()}
        sx={{
          backgroundColor: editor.isActive("bold") ? "skyblue" : "transparent",
          color: editor.isActive("bold") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("bold") ? "skyblue" : "#2667c91a",
          }
        }}
      >
        Bold
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        sx={{
          backgroundColor: editor.isActive("italic") ? "skyblue" : "transparent",
          color: editor.isActive("italic") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("italic") ? "skyblue" : "#2667c91a",
          }
        }}
      >
        Italic
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        sx={{
          backgroundColor: editor.isActive("strike") ? "skyblue" : "transparent",
          color: editor.isActive("strike") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("strike") ? "skyblue" : " #2667c91a",
          }
        }}
      >
        Strike
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        sx={{
          backgroundColor: editor.isActive("heading", { level: 1 }) ? "skyblue" : "transparent",
          color: editor.isActive("heading", { level: 1 }) ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("heading", { level: 1 }) ? "skyblue" : "#2667c91a",
          }
        }}
      >
        H1
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        sx={{
          backgroundColor: editor.isActive("heading", { level: 2 }) ? "skyblue" : "transparent",
          color: editor.isActive("heading", { level: 2 }) ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("heading", { level: 2 }) ? "skyblue" : "#2667c91a",
          }
        }}
      >
        H2
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        sx={{
          backgroundColor: editor.isActive("bulletList") ? "skyblue" : "transparent",
          color: editor.isActive("bulletList") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("bulletList") ? "skyblue" : " #2667c91a",
          }
        }}
      >
        • List
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        sx={{
          backgroundColor: editor.isActive("orderedList") ? "skyblue" : "transparent",
          color: editor.isActive("orderedList") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("orderedList") ? "skyblue" : "#2667c91a",
          }
        }}
      >
        1. List
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        sx={{
          backgroundColor: editor.isActive("codeBlock") ? "skyblue" : "transparent",
          color: editor.isActive("codeBlock") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("codeBlock") ? "skyblue" : " #2667c91a",
          }
        }}
      >
        Code
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        sx={{
          backgroundColor: editor.isActive("blockquote") ? "skyblue" : "transparent",
          color: editor.isActive("blockquote") ? "black" : "inherit",
          "&:hover": {
            backgroundColor: editor.isActive("blockquote") ? "skyblue" : "#2667c91a",
          }
        }}
      >
        Quote
      </Button>
    </Stack>
  );
}



const scrollbarStyles = {
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255, 255, 255, 0.5)",
  },
};

type NoteFormProps = {
  onSubmit: (data: NotesData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NotesData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  description = "",
  tags = [],
}: NoteFormProps) {
  const notesTitleRef = useRef<HTMLInputElement>(null);
  const [targetTags, setTargetTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: description,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      title: notesTitleRef.current!.value,
      description: (editor?.storage as any)?.markdown?.getMarkdown() || "",
      tags: targetTags,
    });
    navigate("..");
  }


  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        maxWidth: '1200px', margin: '0 auto',
        py: 8,
        px: {
          xs: 2,
          md: 4,
        },
        mt: 5,
      }}
    >
      <Stack spacing={4}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Title of your Note"
              required
              fullWidth
              inputRef={notesTitleRef}
              defaultValue={title}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
                "& .MuiInputBase-input": {
                  overflowX: "auto",
                  ...scrollbarStyles,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete<{ value: string; label: string }, true, false, true>
              multiple
              freeSolo
              options={availableTags.map((tag) => {
                return { value: tag.id, label: tag.label };
              })}
              value={targetTags.map((tag) => ({
                value: tag.id,
                label: tag.label,
              }))}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.label
              }
              onChange={(_, tags, reason) => {
                if (reason === "createOption") {
                  const label = tags[tags.length - 1] as string;

                  const newTag = {
                    id: uuidV4(),
                    label,
                  };

                  onAddTag(newTag);
                  setTargetTags((prev) => [...prev, newTag]);
                  return;
                }

                setTargetTags(
                  tags.map((tag) => ({
                    id: typeof tag === "string" ? uuidV4() : tag.value,
                    label: typeof tag === "string" ? tag : tag.label,
                  }))
                );
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={typeof option === "string" ? option : option.label}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags for yout Note"
                  placeholder="Add tags"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      flexWrap: "nowrap",
                      overflowX: "auto",
                      ...scrollbarStyles,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                p: 2,
                boxShadow: 3,
                "& .ProseMirror": {
                  minHeight: "300px",
                  padding: "30px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "black",
                  outline: "none",
                  "&:focus": {
                    outline: "2px solid #1976d2",
                  },
                },
              }}
            >
              <EditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </Box>
          </Grid>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              SUBMIT
            </Button>

            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Stack>
    </Box>
  );
}
