import React, { useState, useEffect } from 'react';
import '../../css/blog/CreateEditBlog.css';
import CKEditorWrapper from './CKEditorWrapper'; // Import Quill styles

export interface BlogPost {
  id: number;
  title: string;
  images: string[];
  links: string[];
  date: string;
  description: string;
  content: string;
  status: 'active' | 'inactive';
}

interface BlogPostFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<BlogPost, 'id'>) => void;
  initialData: BlogPost | null;
}

const CreateEditBlog: React.FC<BlogPostFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    images: [],
    links: [],
    date: new Date().toISOString().slice(0, 10),
    description: '',
    content: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, images: [imageUrl] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      images: [],
      links: [],
      date: new Date().toISOString().slice(0, 10),
      description: '',
      content: '',
      status: 'active',
    });
  };

  return (
    <div className="create-blog-page">
      <header className="create-blog-header">
        <h1>{initialData ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
        <button className="back-button" onClick={onClose}>← Back</button>
      </header>

      <form className="blog-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />

        <label>Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          required
        />

        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.images.length > 0 && (
          <img
            src={formData.images[0]}
            alt="Preview"
            width="200"
            style={{ marginTop: '10px', borderRadius: '6px' }}
          />
        )}


<label>Content</label>
<CKEditorWrapper
  value={formData.content}
  onChange={(value) => handleChange('content', value)}
  className="custom-ckeditor"
/>

        <div className="form-actions">
          <button type="submit">Preview & Publish</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditBlog;
