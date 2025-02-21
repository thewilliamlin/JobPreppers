import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { IconButton, Button, Icon } from "@mui/material";
import { Placeholder } from "@tiptap/extension-placeholder";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import LinkIcon from "@mui/icons-material/Link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Link from "@tiptap/extension-link";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import "./TipTapStyles.css";
import { Controller } from "react-hook-form";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <FormatBoldIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <FormatItalicIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <StrikethroughSIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          <FormatUnderlinedIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <ClearAllIcon />
        </IconButton>

        {/* 
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button> */}
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <FormatListNumberedIcon />
        </IconButton>
        {/* <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
          >
          Code block
          </button> */}
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <FormatQuoteIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <FormatAlignLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <FormatAlignCenterIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <FormatAlignRightIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <FormatAlignJustifyIcon />
        </IconButton>
      </div>
      <div>
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <RedoIcon />
        </IconButton>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  Placeholder.configure({
    placeholder: "Start Typing Here..",
  }),
];

const content = `


`;

const TipTap = ({ control, name }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <EditorProvider
          {...field}
          editor={field.value}
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={field.value}
          onUpdate={({ editor }) => field.onChange(editor.getHTML())}
        ></EditorProvider>
      )}
    />
  );
};

export default TipTap;
