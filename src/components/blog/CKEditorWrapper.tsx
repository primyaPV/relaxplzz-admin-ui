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
  const previousValueRef = useRef<string>(''); // To track the previous value

  useEffect(() => {
    let isMounted = true;

    // Initialize CKEditor only once
    if (editorContainerRef.current && window.ClassicEditor && !editorInstanceRef.current) {
      const editorDiv = document.createElement('div');
      editorContainerRef.current.innerHTML = ''; // Clear previous content
      editorContainerRef.current.appendChild(editorDiv);

      window.ClassicEditor.create(editorDiv, {
        mediaEmbed: {
          previewsInData: true, // Ensures media is embedded and visible in the editor
        },
      })
        .then((editor: any) => {
          if (!isMounted) return;
          editor.setData(value); // Set initial content
          editor.model.document.on('change:data', () => {
            onChange(editor.getData()); // Notify parent when data changes
          });
          editorInstanceRef.current = editor;
        })
        .catch((err: any) => console.error('CKEditor initialization error:', err));
    }

    // Cleanup CKEditor on component unmount
    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []); // Only runs once when the component mounts

  useEffect(() => {
    const editor = editorInstanceRef.current;
    // Only update content when the value prop changes and it's different from the previous value
    if (editor && previousValueRef.current !== value) {
      editor.setData(value); // Update the content only if value changes
      previousValueRef.current = value; // Update the previous value tracker
    }
  }, []); // Only runs when `value` prop changes

  return <div ref={editorContainerRef} className={className} />;
};

export default CKEditorWrapper;
