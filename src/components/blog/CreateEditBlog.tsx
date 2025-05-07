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
  tempId?: number; // Optional temporary ID for tracking
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
  // Default form structure
  const defaultForm = {
    title: '',
    date: new Date().toISOString().slice(0, 10),
    author: '',
    status: 'active' as 'active' | 'inactive',
    fields: [
      { type: 'image' as const, value: '' },
      { type: 'content' as const, value: '<p>Default content goes here...</p>' },
    ],
  };

  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(defaultForm);
  const navigate = useNavigate();
  const location = useLocation();

  // Debugging - log what's coming in
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Initial data:", initialData);
  }, [location.state, initialData]);

  useEffect(() => {
    // First try to use location state (from navigation)
    if (location.state) {
      console.log("Setting form data from location state");
      const blogData = location.state as BlogPost;
      // Preserve the ID but remove it from form data
      const { id, ...rest } = blogData;
      setFormData({
        ...rest,
        date: rest.date || new Date().toISOString().slice(0, 10),
      });
    } 
    // Then try to use initialData (from props)
    else if (initialData) {
      console.log("Setting form data from initialData");
      const { id, ...rest } = initialData;
      setFormData({
        ...rest,
        date: rest.date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [location.state, initialData]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    if (field === 'status') {
      // Ensure status is always typed correctly
      const statusValue = value === 'inactive' ? 'inactive' : 'active';
      setFormData((prev) => ({ ...prev, [field]: statusValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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
  
    // Check that all image fields have a value
    const imageFields = formData.fields.filter((f) => f.type === 'image');
    const allImagesUploaded = imageFields.every((f) => f.value && f.value.trim() !== '');
  
    if (imageFields.length > 0 && !allImagesUploaded) {
      alert('Please upload all required images.');
      return;
    }
  
    const blogWithTempId = {
      ...formData,
      status: formData.status as 'active' | 'inactive',
      tempId: Date.now(),
    };
  
    onSubmit(blogWithTempId);
    navigate('/previewblog', { state: blogWithTempId });
  };

  const handleReset = () => {
    setFormData(defaultForm);
  };

  return (
    <div className="create-blog-page">
      <header className="create-blog-header">
        <h1>{location.state || initialData ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
        <button className="back-button" onClick={() => {
          onClose();
          navigate('/blog');
        }}>← Back</button>
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
                <label>
  Upload Image <span style={{ color: 'red' }}>*</span>
</label>
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