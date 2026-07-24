"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useState } from "react";

interface ClassicEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ClassicEditor({ value, onChange }: ClassicEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] bg-gray-50 border border-gray-200 rounded animate-pulse"></div>;
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-[400px] mb-12"
      />
    </div>
  );
}
