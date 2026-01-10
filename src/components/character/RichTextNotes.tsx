import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextNotesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextNotes({
  value,
  onChange,
  placeholder: placeholderText = "Add notes about your Hunter, campaign events, session summaries, or anything else...",
  className,
  disabled = false
}: RichTextNotesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const lastValueRef = useRef<string>('');

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'blockquote', 'code-block'
  ];

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      readOnly: disabled,
      placeholder: placeholderText,
      modules,
      formats,
    });

    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      const normalized = html === '<p><br></p>' ? '' : html;
      if (normalized !== lastValueRef.current) {
        lastValueRef.current = normalized;
        onChange(normalized);
      }
    });

    quillRef.current = quill;

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
      lastValueRef.current = quill.root.innerHTML;
    }
  }, [disabled, formats, modules, onChange, placeholderText, value]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    quill.enable(!disabled);
  }, [disabled]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const normalized = value || '';
    if (normalized === lastValueRef.current) return;

    const selection = quill.getSelection();
    if (normalized) {
      quill.clipboard.dangerouslyPasteHTML(normalized);
    } else {
      quill.setText('');
    }
    lastValueRef.current = normalized;
    if (selection) {
      quill.setSelection(selection);
    }
  }, [value]);

  return (
    <div className={cn("rich-text-editor", className)}>
      <div ref={containerRef} className="bg-background" />
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 150px;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 150px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}

