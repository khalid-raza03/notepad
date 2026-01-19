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
import { Menu, MenuItem, IconButton } from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import TextFormatTwoToneIcon from '@mui/icons-material/TextFormatTwoTone';
import FormatColorTextTwoToneIcon from '@mui/icons-material/FormatColorTextTwoTone';
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { NotesData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import { ResizableImage } from "./utils/ResizableImage.ts"


import { FormatBold, FormatColorResetTwoTone, FormatStrikethroughSharp, FormatUnderlined } from "@mui/icons-material";
import { CircleCheckBig, Code, Heading1, Heading2, Heading3, ImageUpIcon, Link2Icon, Link2Off, List, ListOrdered, } from 'lucide-react';
import { TextStyle } from "@tiptap/extension-text-style";


function EditorToolbar({ editor }: { editor: Editor | null }) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const selectedImageAttrs = editor?.getAttributes("image") || {};
  const isImageSelected = editor?.isActive("image") || false;

  type OpenMenu = "align" | "format" | null;

  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    menu: OpenMenu;
  }>({
    anchorEl: null,
    menu: null,
  });


  if (!editor) return null;

  const handleMenuOpen =
    (menu: OpenMenu) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setMenuState({
        anchorEl: e.currentTarget,
        menu,
      });
    };

  const handleMenuClose = () => {
    setMenuState({
      anchorEl: null,
      menu: null,
    });
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };



  const updateImageSize = (width: number) => {
    editor?.chain().focus().updateAttributes("image", { width }).run();
  };


  const addImageFromDevice = () => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string, width: 250, })
          .run();
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  const applyColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor?.chain().focus().setColor(e.target.value).run();
  };


  const buttonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? "skyblue" : "transparent",
    color: isActive ? "black" : "inherit",
    transition: 'all 0.3s ease',
    "&:hover": {
      backgroundColor: isActive ? "skyblue" : "#2667c91a",
      transform: 'scale(1.05)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }
  });

  return (
    <Stack direction="row" sx={{ gap: '10px', padding: "10px" }} flexWrap="wrap" mb={2}>
      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBold().run()}
        sx={buttonStyle(editor.isActive("bold"))}
      >
        <FormatBold />
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        sx={buttonStyle(editor.isActive("italic"))}
      >
        <FormatItalicIcon sx={{ fontStyle: "italic" }} />

      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        sx={buttonStyle(editor.isActive("underline"))}
      >
        <FormatUnderlined />
      </Button>

      <IconButton
        size="small"
        onClick={handleMenuOpen("align")}
        sx={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 1 }}
      >
        <FormatAlignLeftIcon />
      </IconButton>


      <Menu
        anchorEl={menuState.anchorEl}
        open={menuState.menu === "align"}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("left").run();
            handleMenuClose();
          }}
        >
          <FormatAlignLeftIcon sx={{ mr: 1 }} /> Left
        </MenuItem>

        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("right").run();
            handleMenuClose();
          }}
        >
          <FormatAlignRightIcon sx={{ mr: 1 }} /> Right
        </MenuItem>

        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("center").run();
            handleMenuClose();
          }}
        >
          <FormatAlignCenterIcon sx={{ mr: 1 }} /> Center
        </MenuItem>

        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("justify").run();
            handleMenuClose();
          }}
        >
          <FormatAlignJustifyIcon sx={{ mr: 1 }} /> Justify
        </MenuItem>
      </Menu>




      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        sx={buttonStyle(editor.isActive("strike"))}
      >
        <FormatStrikethroughSharp />
      </Button>


      <IconButton
        size="small"
        onClick={handleMenuOpen("format")}
        sx={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 1 }}
      >
        <TextFormatTwoToneIcon />
      </IconButton>

      <Menu
        anchorEl={menuState.anchorEl}
        open={menuState.menu === "format"}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            handleMenuClose();
          }}
        >
          <Heading1 />
        </MenuItem>

        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            handleMenuClose();
          }}
        >
          <Heading2 />
        </MenuItem>

        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            handleMenuClose();
          }}
        >
          <Heading3 />
        </MenuItem>

        <MenuItem
          onClick={() => {
            editor.chain().focus().setParagraph().run();
            handleMenuClose();
          }}
        >
          Para
        </MenuItem>
      </Menu>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        sx={buttonStyle(editor.isActive("bulletList"))}
      >
        <List />

      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        sx={buttonStyle(editor.isActive("orderedList"))}
      >
        <ListOrdered />

      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        sx={buttonStyle(editor.isActive("taskList"))}
      >
        <CircleCheckBig />

      </Button>

      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => colorInputRef.current?.click()}
        >
          <FormatColorTextTwoToneIcon />
        </Button>

        <input
          ref={colorInputRef}
          type="color"
          onChange={applyColor}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </Box>



      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().unsetColor().run()}>
        <FormatColorResetTwoTone />
      </Button>


      <Button
        size="small"
        variant="outlined"
        onClick={setLink}
        sx={buttonStyle(editor.isActive("link"))}
      >
        <Link2Icon />
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Link2Off />
      </Button>


      <Button
        size="small"
        variant="outlined"
        onClick={addImageFromDevice}
      >
        <ImageUpIcon />
      </Button>
      {isImageSelected && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            size="small"
            type="number"
            label="Image width"
            value={selectedImageAttrs.width || 250}
            onChange={(e) => updateImageSize(Number(e.target.value))}
            inputProps={{ min: 50, max: 600 }}
            sx={{ width: 110 }}
          />
        </Box>
      )}





      <Button
        size="small"
        variant="outlined"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        sx={{
          ...buttonStyle(editor.isActive("codeBlock")),
          display: { xs: 'none', sm: 'inline-flex' }
        }}
      >
        <Code />
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
      Underline,
      TaskList,
      TextStyle,
      Color,
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskItem.configure({
        nested: true,
      }),
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
      description: editor?.getHTML() || "",
      tags: targetTags,
    });
    navigate(-1);
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
          <Grid size={{ xs: 12, md: 6 }} sx={{
            animation: 'slideInLeft 0.5s ease-out',
            animationDelay: '0.1s',
            animationFillMode: 'both',
            '@keyframes slideInLeft': {
              from: {
                opacity: 0,
                transform: 'translateX(-30px)'
              },
              to: {
                opacity: 1,
                transform: 'translateX(0)'
              }
            }
          }}>
            <TextField
              label="Title of your Note"
              required
              fullWidth
              inputRef={notesTitleRef}
              defaultValue={title}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                },
                "& .MuiInputBase-input": {
                  overflowX: "auto",
                  ...scrollbarStyles,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{
            animation: 'slideInRight 0.5s ease-out',
            animationDelay: '0.2s',
            animationFillMode: 'both',
            '@keyframes slideInRight': {
              from: {
                opacity: 0,
                transform: 'translateX(30px)'
              },
              to: {
                opacity: 1,
                transform: 'translateX(0)'
              }
            }
          }}>
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
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)',
                        transform: 'translateY(-2px)'
                      },
                      ...scrollbarStyles,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }} sx={{
            animation: 'fadeInUp 0.5s ease-out',
            animationDelay: '0.3s',
            animationFillMode: 'both',
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(30px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                minHeight: 48,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                },
                "& .ProseMirror": {
                  maxHeight: "50vh",
                  overflowY: "auto",
                  padding: "30px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "black",
                  outline: "none",
                  transition: 'all 0.3s ease',
                  "&:focus": {
                    outline: "2px solid #1976d2",
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  },
                  ...scrollbarStyles,
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
            sx={{
              width: "100%",
              animation: 'fadeIn 0.5s ease-out',
              animationDelay: '0.4s',
              animationFillMode: 'both',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 }
              }
            }}
          >
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                }
              }}
            >
              SUBMIT
            </Button>

            <Button
              component={Link}
              to="/notes"
              variant="outlined"
              startIcon={<CloseIcon />}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  backgroundColor: 'rgba(255,0,0,0.05)'
                }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Stack>
    </Box>
  );
}
