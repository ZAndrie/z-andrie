"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlockEditor({ value, onChange }: BlockEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      let initialData = { blocks: [] };
      try {
        if (value) {
          initialData = JSON.parse(value);
        }
      } catch (e) {
        console.error("Invalid JSON for EditorJS", e);
      }

      editorRef.current = new EditorJS({
        holder: "editorjs-container",
        data: initialData,
        placeholder: "Start writing your amazing story...",
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
          image: {
            class: ImageTool,
            config: {
              // We'll leave image uploading simple for now, relying on external URLs
              // or integrating UploadThing later if needed.
              endpoints: {
                byFile: '/api/uploadthing/editorjs', // Placeholder
                byUrl: '/api/uploadthing/editorjs-url', // Placeholder
              }
            }
          }
        },
        onChange: async () => {
          if (editorRef.current) {
            const data = await editorRef.current.save();
            onChange(JSON.stringify(data));
          }
        },
      });
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 min-h-[400px]">
      <div id="editorjs-container" className="prose max-w-none"></div>
    </div>
  );
}
