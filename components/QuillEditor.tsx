"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Import ReactQuill dynamically to avoid SSR issues
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

const QuillEditor = ({ value, onChange, placeholder, className }: QuillEditorProps) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Suppress findDOMNode warnings in development
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
          return;
        }
        originalError.call(console, ...args);
      };
    }
  }, []);

  return (
    <div className={className}>
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme="snow"
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link'],
            ['clean']
          ],
        }}
        formats={[
          'header',
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'blockquote', 'code-block',
          'link'
        ]}
      />
    </div>
  );
};

export default QuillEditor;