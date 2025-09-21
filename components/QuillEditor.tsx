"use client";

import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Import ReactQuill dynamically
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-32 flex items-center justify-center border rounded">
      <p>Loading editor...</p>
    </div>
  ),
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const QuillEditor = ({
  value,
  onChange,
  placeholder,
  className,
}: QuillEditorProps) => {
  const [useSimpleEditor, setUseSimpleEditor] = useState(false);

  // Fallback to simple textarea if ReactQuill fails
  if (useSimpleEditor) {
    return (
      <div className={className}>
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setUseSimpleEditor(false)}
            className="text-sm text-blue-500 hover:underline"
          >
            Basculer vers l&apos;éditeur riche
          </button>
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-32"
          rows={10}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => setUseSimpleEditor(true)}
          className="text-sm text-blue-500 hover:underline"
        >
          Basculer vers l&apos;éditeur simple
        </button>
      </div>
      <div
        onError={() => setUseSimpleEditor(true)}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote"],
              ["link"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "blockquote",
            "link",
          ]}
        />
      </div>
    </div>
  );
};

export default QuillEditor;
