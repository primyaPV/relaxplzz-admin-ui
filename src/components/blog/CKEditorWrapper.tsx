import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ClassicEditor: any;
  }
}

interface CKEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  className?: string; 
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({ value, onChange, className }) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    
    if (editorContainerRef.current && window.ClassicEditor && !editorInstanceRef.current) {
      const editorDiv = document.createElement('div');
      editorContainerRef.current.innerHTML = ''; 
      editorContainerRef.current.appendChild(editorDiv);

      window.ClassicEditor.create(editorDiv, {
        mediaEmbed: {
          previewsInData: true, 
        },
      })
        .then((editor: any) => {
          if (!isMounted) return;
          editor.setData(value); 
          editor.model.document.on('change:data', () => {
            onChange(editor.getData()); 
          });
          editorInstanceRef.current = editor;
        })
        .catch((err: any) => console.error('CKEditor initialization error:', err));
    }


    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (editor && editor.getData() !== value) {
      editor.setData(value); 
    }
  }, []); 

  return <div ref={editorContainerRef} className={className} />;
};

export default CKEditorWrapper;
