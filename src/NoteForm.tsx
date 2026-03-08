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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import type { NotesData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { ResizableImage } from "./utils/ResizableImage.ts"
import { FontSize } from "./utils/FontSize";
import { useLocation } from "react-router-dom";
import { getThemeById, getStoredThemes } from "./Themes";



import { FormatBold, FormatColorResetTwoTone, FormatStrikethroughSharp, FormatUnderlined, Undo, Redo, FormatSize, FindReplace, PhotoSizeSelectLarge } from "@mui/icons-material";
import { CircleCheckBig, Code, Heading1, Heading2, Heading3, ImageUpIcon, Link2Icon, Link2Off, List, ListOrdered, } from 'lucide-react';
import { TextStyle } from "@tiptap/extension-text-style";
import { SearchAndReplace } from "./utils/SearchAndReplace";
import { fetchGoogleFonts, loadFont, applyFontToEditor, getSavedFont, saveSelectedFont } from "./utils/GoogleFonts";

// Scrollbar styles that can be used across all components in this file
const scrollbarStyles = {
  "&::-webkit-scrollbar": {
    height: "4px",
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(251, 205, 108, 0.7)",
    borderRadius: "12px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255, 255, 255, 0.5)",
  },
};

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const selectedImageAttrs = editor?.getAttributes("image") || {};
  const isImageSelected = editor?.isActive("image") || false;
  const [fonts, setFonts] = useState<Array<{ family: string; category: string }>>([]);
  const [selectedFont, setSelectedFont] = useState<string>(() => getSavedFont());
  const [fontsLoading, setFontsLoading] = useState(true);

  type OpenMenu = "align" | "format" | "imageAlign" | null;

  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    menu: OpenMenu;
  }>({
    anchorEl: null,
    menu: null,
  });

  const [showSearch, setShowSearch] = useState(false);

  // Fetch Google Fonts on mount
  useEffect(() => {
    const loadFonts = async () => {
      setFontsLoading(true);
      try {
        const fetchedFonts = await fetchGoogleFonts();
        setFonts(fetchedFonts as Array<{ family: string; category: string }>);

        // Load and apply the saved font
        const savedFont = getSavedFont();
        loadFont(savedFont);
        applyFontToEditor(editor, savedFont);
      } catch (error) {
        console.error("Failed to load fonts:", error);
      } finally {
        setFontsLoading(false);
      }
    };
    loadFonts();
  }, [editor]);

  if (!editor) return;

  const sizeAttr = editor.getAttributes("textStyle").fontSize;
  const fontSize = sizeAttr ? parseInt(sizeAttr) : "";

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
    backgroundColor: isActive ? "rgba(51, 112, 255, 0.1)" : "transparent",
    color: isActive ? "#3370FF" : "inherit",
    borderColor: isActive ? "#3370FF" : "inherit",
    transition: 'all 0.2s ease',
    fontSize: '14px',
    "&:hover": {
      backgroundColor: isActive ? "rgba(51, 112, 255, 0.2)" : "rgba(0,0,0,0.05)",
      borderColor: "#3370FF",
    }
  });



  return (
    <Box mb={2}>
      <Stack direction="row" sx={{
        gap: '10px', padding: "10px", width: "100%", maxWidth: { xs: "100%", md: "1200px" }, flexWrap: { md: "wrap", xs: "nowrap" }, overflowX: "auto", "& .MuiInputBase-input": {

          ...scrollbarStyles,
        },
      }}>


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
            sx={{ backgroundColor: "white" }}
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
          sx={{ backgroundColor: "white" }}
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
          sx={{ backgroundColor: "white" }}
          variant="outlined"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off />
        </Button>


        <Button
          size="small"
          variant="outlined"
          onClick={addImageFromDevice}
          sx={{ backgroundColor: "white" }}
        >
          <ImageUpIcon />
        </Button>
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
            <IconButton
              size="small"
              onClick={handleMenuOpen("imageAlign")}
              sx={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 1 }}
              title="Align Image"
            >
              <span style={{fontSize:"14px", padding:"5px", borderRadius:"12px" , fontWeight:"bold"}}>Align Image</span>
            </IconButton>
          </Box>

        <Menu
          anchorEl={menuState.anchorEl}
          open={menuState.menu === "imageAlign"}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              editor?.chain().focus().updateAttributes("image", { align: "left" }).run();
              handleMenuClose();
            }}
          >
            <FormatAlignLeftIcon sx={{ mr: 1 }} /> Left
          </MenuItem>
          <MenuItem
            onClick={() => {
              editor?.chain().focus().updateAttributes("image", { align: "center" }).run();
              handleMenuClose();
            }}
          >
            <FormatAlignCenterIcon sx={{ mr: 1 }} /> Center
          </MenuItem>
          <MenuItem
            onClick={() => {
              editor?.chain().focus().updateAttributes("image", { align: "right" }).run();
              handleMenuClose();
            }}
          >
            <FormatAlignRightIcon sx={{ mr: 1 }} /> Right
          </MenuItem>
        </Menu>

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

        <Box display={"flex"} alignItems={"center"} gap={1}>
          <FormatSize titleAccess="select your text and set font-size" />
          <TextField
            type="number"
            size="small"
            inputProps={{ min: 10, step: 1 }}
            value={fontSize}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                editor.chain().setFontSize(String(value)).run();
              } else {
                editor.chain().unsetFontSize().run();
              }
            }}
            sx={{ width: 120 }}
          />
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={1}>
          <TextFormatTwoToneIcon titleAccess="select font family" />
          <Autocomplete
            size="small"
            options={fonts.map((font) => font.family)}
            value={selectedFont}
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedFont(newValue);
                saveSelectedFont(newValue);
                loadFont(newValue);
                applyFontToEditor(editor, newValue);
              }
            }}
            loading={fontsLoading}
            freeSolo
            sx={{ width: 150 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Font"
                size="small"
                placeholder="Select font..."
              />
            )}
          />
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={() => setShowSearch(!showSearch)}
          sx={buttonStyle(showSearch)}
          title="Find and Replace"
        >
          <FindReplace />
        </Button>

      </Stack>

      {showSearch && (
        <Stack direction="row" spacing={1} sx={{ mt: 1, p: 1, border: '1px solid #eee', borderRadius: 2, flexWrap: "wrap", gap: 1 }} alignItems="center">
          <TextField
            size="small"
            placeholder="Search..."
            variant="outlined"
            onChange={(e) => editor.commands.setSearchTerm(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              "& .MuiOutlinedInput-root": { borderRadius: 2 }
            }}
          />
          <TextField
            size="small"
            placeholder="Replace with..."
            variant="outlined"
            onChange={(e) => editor.commands.setReplaceTerm(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              "& .MuiOutlinedInput-root": { borderRadius: 2 }
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => editor.commands.replace()}
            sx={{ borderRadius: 2 }}
          >
            Replace
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => editor.commands.replaceAll()}
            sx={{ borderRadius: 2 }}
          >
            Replace All
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              editor.commands.clearSearch();
              setShowSearch(false);
            }}
            sx={{ borderRadius: 2 }}
          >
            Clear
          </Button>
        </Stack>
      )}
    </Box>
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
  themeId: propThemeId,
}: NoteFormProps) {
  const [, forceUpdate] = useState({});
  const notesTitleRef = useRef<HTMLInputElement>(null);
  const [targetTags, setTargetTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();
  const location = useLocation();
  const { id: noteId } = useParams<{ id: string }>();

  const themeId = propThemeId ?? location.state?.themeId ?? "glass";

  const selectedTheme = getThemeById(themeId) ?? getStoredThemes()[0];

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      FontSize,
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
      Placeholder.configure({
        placeholder: "write your notes here...",
      }),
      Markdown.configure({
        html: true,
        transformPastedText: false,
        transformCopiedText: false,
      }),
      SearchAndReplace,
    ],
    content: description,
    onUpdate: () => forceUpdate({}),
  });



  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      title: notesTitleRef.current!.value,
      description: editor?.getHTML() || "",
      tags: targetTags,
      themeId,
    });

    // Redirect to the specific note
    if (noteId) {
      // For editing, we have the ID from URL params
      navigate(`/${noteId}`);
    } else {
      // For creating, retrieve the newly created note from localStorage
      const savedNotes = localStorage.getItem("Notes");
      if (savedNotes) {
        try {
          const notes = JSON.parse(savedNotes);
          // Get the last note (most recently created)
          if (notes.length > 0) {
            const lastNote = notes[notes.length - 1];
            navigate(`/${lastNote.id}`);
          } else {
            navigate("/notes");
          }
        } catch (error) {
          console.error("Failed to get created note ID:", error);
          navigate("/notes");
        }
      } else {
        navigate("/notes");
      }
    }
  }

  const rowColSx = {
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    justifyContent: "space-between",
  };



  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: (theme) => theme.palette.mode === 'light'
          ? "0 4px 20px rgba(0,0,0,0.08)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: "1200px",
        position: { xs: "relative", sm: "static" },
        mx: "auto",
        mt: { xs: 2, md: 4 },
        py: { xs: 3, lg: 6 },
        px: { xs: 2, md: 4 },
      }}
    >

      <Stack spacing={4}>
        <Grid container spacing={2}>
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
                  overflow: "auto",
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

          {/* submit button */}

          <Box display={"flex"} gap={"5px"} sx={{ position: { xs: "absolute", sm: "static" }, bottom: "0%", left: "0%", width: { xs: "100%", sm: "auto" }, }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                transition: 'all 0.3s ease-in',
                width: { xs: "50%", sm: "auto" },
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
              startIcon={<CloseIcon />}
              sx={{
                transition: 'all 0.3s ease',
                width: { xs: "50%", sm: "auto" },
                backgroundColor: 'rgb(241, 233, 233)',
                border: "1px solid #1976d2",
                '&:hover': {
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  backgroundColor: 'rgba(255,0,0,0.05)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>

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
                  ...selectedTheme.editorSx,
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
                    outline: "2px solid #0b0c0c",
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  },
                  ...scrollbarStyles,
                },
              }}
            >
              <EditorToolbar editor={editor} />
              <EditorContent editor={editor} color="black" />
            </Box>
          </Grid>

          <Stack
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


            <Box display={"flex"} columnGap={"10px"} rowGap={"40px"} sx={rowColSx}>

              <Box display={"flex"} gap={"10px"} sx={{ margin: { xs: "25px 0", sm: "0" } }} >
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px #00000026'
                    }
                  }}
                >
                  <Undo />
                </Button>

                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px #00000026'
                    }
                  }}
                >
                  <Redo />
                </Button>
              </Box>



            </Box>



          </Stack>
        </Grid>
      </Stack>
    </Box>
  );
}