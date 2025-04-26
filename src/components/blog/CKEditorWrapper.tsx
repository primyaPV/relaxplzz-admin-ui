import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ClassicEditor: any;
  }
}

interface CKEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;  // Optional: Accept className as prop
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({ value, onChange, className }) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    if (
      editorContainerRef.current &&
      window.ClassicEditor &&
      !editorInstanceRef.current
    ) {
      const editorDiv = document.createElement('div');
      editorContainerRef.current.innerHTML = ''; // Clear previous
      editorContainerRef.current.appendChild(editorDiv);

      window.ClassicEditor.create(editorDiv)
        .then((editor: any) => {
          if (!isMounted) return;
          editor.setData(value);
          editor.model.document.on('change:data', () => {
            onChange(editor.getData());
          });
          editorInstanceRef.current = editor;
        })
        .catch((err: any) => console.error('CKEditor init error:', err));
    }

    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={editorContainerRef} className={className} />;
};

export default CKEditorWrapper;
