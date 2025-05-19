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
      { type: 'content' as const, value: '' },
    ],
  };

  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(defaultForm);
  const [resetKey, setResetKey] = useState(Date.now());
  const navigate = useNavigate();
  const location = useLocation();

  // Debugging - log what's coming in
  // useEffect(() => {
  //   console.log("Location state:", location.state);
  //   console.log("Initial data:", initialData);
  // }, [location.state, initialData]);

  useEffect(() => {
    setResetKey(Date.now());
  }, [location.state]);

  useEffect(() => {
    const blogData = (location.state as BlogPost) || initialData;
  
    if (blogData) {
      const { id, ...rest } = blogData;
      const fields = Array.isArray(rest.fields) && rest.fields.length > 0
        ? rest.fields
        : defaultForm.fields;
  
      setFormData({
        ...defaultForm,  // Ensures all default keys are present
        ...rest,
        fields,
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
      fields: [...prev.fields, { type: 'content', value: '' }],
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
    // Only ask for confirmation if replacing an existing image
    if (formData.fields[index].value) {
      const confirmed = window.confirm('Are you sure you want to change this image?');
      if (!confirmed) return;
    }

    const imageUrl = URL.createObjectURL(e.target.files[0]);
    updateFieldValue(index, imageUrl);
  }
};


  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {

  if (e.target.files && e.target.files[0]) {
    const videoUrl = URL.createObjectURL(e.target.files[0]);
    updateFieldValue(index, videoUrl);
  }
 if (formData.fields[index].value) {
      const confirmed = window.confirm('Are you sure you want to change this video?');
      if (!confirmed) return;
    }

};


  const updateFieldValue = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedFields = [...prev.fields];
      if (updatedFields[index]) {
        updatedFields[index] = { ...updatedFields[index], value };
      }
      return { ...prev, fields: updatedFields };
    });
  };

  const extractYouTubeID = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
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
    setResetKey(Date.now()); 
  };

  return (
    <div className="create-blog-page" key={resetKey}>
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
  console.log("Rendering field:", field.type, field.value);

  if (field.type === 'image') {
    return (
      <div key={index}>
        <br></br>
        <label>
          Upload Image <span style={{ color: 'red' }}>*</span>
        </label>
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

  if (field.type === 'content') {
    return (
      <div key={index}>
        <br></br>
        <label>Content</label>
        <br></br>
        <CKEditorWrapper
          value={field.value || ""}
          onChange={(value) => updateFieldValue(index, value)}
        />
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
      {field.value && (
        <video
          key={field.value} 
          width="320"
          height="240"
          controls
          style={{ marginTop: '10px', borderRadius: '6px' }}
        >
          <source src={field.value} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}


  if (field.type === 'youtube') {
    const youtubeID = extractYouTubeID(field.value);
    return (
      <div key={index}>
        <br></br>
        <label>YouTube Video Link</label>
        <br></br>
        <input
  type="url"
  placeholder="Enter YouTube video URL"
  value={field.value}
  onChange={(e) => {
    const newValue = e.target.value;
    if (field.value && field.value !== newValue) {
      if (!window.confirm('Are you sure you want to change this YouTube link?')) return;
    }
    updateFieldValue(index, newValue);
  }}
/>
        {youtubeID && (
          <iframe
            width="320"
            height="180"
            src={`https://www.youtube.com/embed/${youtubeID}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ marginTop: '10px', borderRadius: '6px' }}
          ></iframe>
        )}
      </div>
    );
  }

  return null;
})}

        <div className="form-actions" >
          <button type="submit" >Preview & Publish</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditBlog;