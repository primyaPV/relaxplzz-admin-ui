import React, { useState, useEffect } from 'react';
import '../../css/blog/CreateEditBlog.css';
import CKEditorWrapper from './CKEditorWrapper';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaImage, FaFileAlt, FaVideo, FaYoutube } from 'react-icons/fa';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'active' | 'inactive';
  fields: {
    type: 'image' | 'content' | 'video' | 'youtube';
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
      { type: 'image', value: '' },
      { type: 'content', value: '<p>Default content goes here...</p>' },
    ],
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { id, ...rest } = location.state as BlogPost;
      setFormData({
        ...rest,
        date: rest.date || new Date().toISOString().slice(0, 10),
      });
    } else if (initialData) {
      const { id, ...rest } = initialData;
      setFormData({
        ...rest,
        date: rest.date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [location.state, initialData]);

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
      fields: [...prev.fields, { type: 'content', value: '<p>Default content goes here...</p>' }],
    }));
  };

  const addVideoField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { type: 'video', value: '' }],
    }));
  };

  const addYouTubeField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { type: 'youtube', value: '' }],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      updateFieldValue(index, imageUrl);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const videoUrl = URL.createObjectURL(e.target.files[0]);
      updateFieldValue(index, videoUrl);
    }
  };

  const updateFieldValue = (index: number, value: string) => {
    const updatedFields = [...formData.fields];
    updatedFields[index].value = value;
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const extractYouTubeID = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    navigate('/previewblog', { state: formData });
  };

  const handleReset = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      author: '',
      status: 'active',
      fields: [
        { type: 'image', value: '' },
        { type: 'content', value: '<p>Default content goes here...</p>' },
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
          <button className="icon-button" title="Add Video" onClick={addVideoField}><FaVideo /></button>
          <button className="icon-button" title="Add YouTube Link" onClick={addYouTubeField}><FaYoutube /></button>
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

        {formData.fields.map((field, index) => {
          if (field.type === 'content') {
            return (
              <div key={index}>
                <label>Content</label>
                <CKEditorWrapper
                  value={field.value}  // Pass the value of content
                  onChange={(value) => updateFieldValue(index, value)}  // Update content on change
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
                {field.value && field.value !== "" && (
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

          if (field.type === 'video') {
            return (
              <div key={index}>
                <br />
                <label>Upload Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(e, index)}
                />
                {field.value && field.value !== "" && (
                  <video width="320" height="240" controls style={{ marginTop: '10px', borderRadius: '6px' }}>
                    <source src={field.value} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            );
          }

          if (field.type === 'youtube') {
            return (
              <div key={index}>
                <br />
                <label>YouTube Video Link</label>
                <input
                  type="url"
                  placeholder="Enter YouTube video URL"
                  value={field.value}
                  onChange={(e) => updateFieldValue(index, e.target.value)}
                />
                {field.value && field.value !== "" && extractYouTubeID(field.value) && (
                  <iframe
                    width="320"
                    height="180"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(field.value)}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
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
