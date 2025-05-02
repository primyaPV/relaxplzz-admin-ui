import React, { useState, useEffect } from 'react';
import '../../css/blog/CreateEditBlog.css';
import CKEditorWrapper from './CKEditorWrapper';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaLink, FaFileAlt } from 'react-icons/fa';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'active' | 'inactive';
  fields: {
    type: 'image' | 'content' | 'link';
    value: string;
  }[];
}

interface BlogPostFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<BlogPost, 'id'>) => void;
  initialData: BlogPost | null;
}

const CreateEditBlog: React.FC<BlogPostFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    author: '',
    status: 'active',
    fields: [
      { type: 'image', value: '' },  // Pre-populate one image upload field
      { type: 'content', value: '<p>Default content goes here...</p>' }, // Pre-populate one content field
    ],
  });

  const navigate = useNavigate();

  // Initialize form data if editing
  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { type: 'image', value: '' }],
    }));
  };

  const addContentField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        { type: 'content', value: '<p>Default content goes here...</p>' }, // Add default content field
      ],
    }));
  };

  const addLinkField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { type: 'link', value: '' }],
    }));
  };

  const updateFieldValue = (index: number, value: string) => {
    const updatedFields = [...formData.fields];
    updatedFields[index].value = value;
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      updateFieldValue(index, imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Submit the form data
    navigate('/previewblog', { state: formData }); // Navigate to the preview page
  };

  const handleReset = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      author: '',
      status: 'active',
      fields: [
        { type: 'image', value: '' },  // Pre-populate one image upload field
        { type: 'content', value: '<p>Default content goes here...</p>' }, // Pre-populate one content field
      ],
    });
  };

  return (
    <div className="create-blog-page">
      <header className="create-blog-header">
        <h1>{initialData ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
        <button className="back-button" onClick={onClose}>← Back</button>
        <div className="blog-header-actions">
          <button className="icon-button" title="Add Image" onClick={addImageField}><FaImage /></button>
          <button className="icon-button" title="Add Content" onClick={addContentField}><FaFileAlt /></button>
          <button className="icon-button" title="Add Link" onClick={addLinkField}><FaLink /></button>
        </div>
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

        <label>Author</label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          required
        />

        {/* Render the fields (image, content, link) */}
        {formData.fields.map((field, index) => {
          if (field.type === 'content') {
            return (
              <div key={index}>
                <label>Content</label>
                <CKEditorWrapper
                  value={field.value}
                  onChange={(value) => updateFieldValue(index, value)}
                />
              </div>
            );
          }

          if (field.type === 'image') {
            return (
              <div key={index}>
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                />
                {field.value && (
                  <img
                    src={field.value}
                    alt={`Preview ${index + 1}`}
                    width="200"
                    style={{ marginTop: '10px', borderRadius: '6px' }}
                  />
                )}
              </div>
            );
          }

          if (field.type === 'link') {
            return (
              <div key={index}>
                <label>Link</label>
                <input
                  type="url"
                  value={field.value}
                  onChange={(e) => updateFieldValue(index, e.target.value)}
                  placeholder="Enter link"
                  required
                />
              </div>
            );
          }

          return null;
        })}

        <div className="form-actions">
          <button type="submit">Preview & Publish</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditBlog;
