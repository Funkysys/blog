"use client";

import { Textarea } from "@/components/ui/textarea";

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
  return (
    <div className={className}>
      <div className="mb-2">
        <p className="text-sm text-slate-400">
          Éditeur de texte simple (HTML supporté)
        </p>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-32"
        rows={10}
      />
      <div className="mt-2 text-xs text-slate-500">
        <p>Balises HTML supportées : &lt;b&gt;, &lt;i&gt;, &lt;u&gt;, &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;</p>
      </div>
    </div>
  );
};

export default QuillEditor;
