import React, { useState, useEffect } from 'react';
import '../../css/blog/CreateEditBlog.css';
import CKEditorWrapper from './CKEditorWrapper';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaLink, FaFileAlt } from 'react-icons/fa';

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

  const [imageFields, setImageFields] = useState<string[]>(['']); // Start with one image field
  const [contentEditors, setContentEditors] = useState<string[]>(['']); // Start with one content editor
  const [linkFields, setLinkFields] = useState<string[]>([]); // Start with no link fields
  const [fieldOrder, setFieldOrder] = useState<string[]>(['image', 'content']); // Start with image and content fields already
  const navigate = useNavigate();
  useEffect(() => {
    if (initialData) {
      const { id, images, links, ...rest } = initialData;
      setFormData({
        ...rest,
        images: images || [],
        links: links || [],
      });
      setImageFields(images || []);
      setLinkFields(links || []);
    }
  }, [initialData]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      const updatedImages = [...imageFields];
      updatedImages[index] = imageUrl;
      setImageFields(updatedImages);
    }
  };

  const handleAddImageField = () => {
    setImageFields([...imageFields, '']); // Add a new empty image field
    setFieldOrder([...fieldOrder, 'image']); // Track that "image" field was added
  };

  const handleAddContentEditor = () => {
    setContentEditors([...contentEditors, '']); // Add a new content editor
    setFieldOrder([...fieldOrder, 'content']); // Track that "content" field was added
  };

  const handleAddLinkField = () => {
    setLinkFields([...linkFields, '']); // Add a new link input field
    setFieldOrder([...fieldOrder, 'link']); // Track that "link" field was added
  };

  const handleLinkChange = (value: string, index: number) => {
    const updatedLinks = [...linkFields];
    updatedLinks[index] = value;
    setLinkFields(updatedLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const combinedContent = contentEditors.join('<br><br>');
  
    const blogData = { 
      ...formData, 
      images: imageFields, 
      links: linkFields, 
      content: combinedContent 
    };
  console.log("preview data",blogData);
    onSubmit(blogData); 
    navigate('/previewblog', { state: blogData }); 
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
    setImageFields(['']); // Reset to have at least one image field
    setContentEditors(['']); // Reset content editors
    setLinkFields([]); // Reset link fields (no link input fields initially)
    setFieldOrder(['image', 'content']); // Reset order to show image and content initially
  };

  return (
    <div className="create-blog-page">
      <header className="create-blog-header">
        <h1>{initialData ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
        <button className="back-button" onClick={onClose}>← Back</button>

        <div className="blog-header-actions">
          <button className="icon-button" title="Add Image" onClick={handleAddImageField}>
            <FaImage />
          </button>
          <button className="icon-button" title="Add Content" onClick={handleAddContentEditor}>
            <FaFileAlt />
          </button>
          <button className="icon-button" title="Add Link" onClick={handleAddLinkField}>
            <FaLink />
          </button>
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

        {/* Render fields based on the order in fieldOrder */}
        {fieldOrder.map((field, index) => {
          if (field === 'content') {
            return (
              <div key={index}>
                <label>Content </label>

                <CKEditorWrapper
                
  value=" "
  onChange={(value) => {
    const updatedContentEditors = [...contentEditors];
    updatedContentEditors[index] = value;
    setContentEditors(updatedContentEditors);
  }}
/>
              </div>
            );
          }

          if (field === 'link') {
            return (
              <div key={index}>
                <label>Link</label>
                <input
                  type="url"
                  value={linkFields[index]}
                  onChange={(e) => handleLinkChange(e.target.value, index)} // Handle link input change
                  placeholder="Enter link"
                  required
                />
              </div>
            );
          }

          if (field === 'image') {
            return (
              <div key={index}>
                <label>Upload Image </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)} // Handling image upload
                />
                {imageFields[index] && (
                  <img
                    src={imageFields[index]}
                    alt={`Preview ${index + 1}`}
                    width="200"
                    style={{ marginTop: '10px', borderRadius: '6px' }}
                  />
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
