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

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
      <Button
        size="small"
        variant={editor.isActive("bold") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>

      <Button
        size="small"
        variant={editor.isActive("italic") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>

      <Button
        size="small"
        variant={editor.isActive("strike") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        Strike
      </Button>

      <Button
        size="small"
        variant={editor.isActive("heading", { level: 1 }) ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>

      <Button
        size="small"
        variant={editor.isActive("heading", { level: 2 }) ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>

      <Button
        size="small"
        variant={editor.isActive("bulletList") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </Button>

      <Button
        size="small"
        variant={editor.isActive("orderedList") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </Button>

      <Button
        size="small"
        variant={editor.isActive("codeBlock") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Code
      </Button>

      <Button
        size="small"
        variant={editor.isActive("blockquote") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Quote
      </Button>
    </Stack>
  );
}



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
    extensions: [StarterKit],
    content: description,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      title: notesTitleRef.current!.value,
      description: editor?.getHTML() || "",
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
        py: 8,
        px: 4,
        mt: 5,
        color: "#fff",
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
                  padding: "12px",
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
