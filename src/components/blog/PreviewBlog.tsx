import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BlogPost } from './Blog'; // Import from Blog.tsx
import '../../css/blog/PreviewBlog.css';

const PreviewBlog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blogData = location.state as BlogPost; // Get blog data from navigation state
  
  // Use empty array as fallback if fields don't exist
  const fields = blogData?.fields ?? [];
  
  console.log("PreviewBlog received data:", blogData);

  const extractYouTubeID = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : '';
  };

  const handleBackToEdit = () => {
    // Navigate back to edit with the current blog data
    navigate('/createeditblog', { state: blogData });
  };

  const handlePublish = () => {
    // Make sure we have a tempId to track this specific blog
    const blogToPublish = {
      ...blogData,
      tempId: blogData.tempId || Date.now() // Use existing tempId or create new one
    };
    
    console.log("Publishing blog with data:", blogToPublish);
    
    // Navigate to blog listing with the blog data in state
    navigate('/blog', { 
      state: { newBlog: blogToPublish }
    });
  };
  
  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">{blogData.title}</h1>
      </div>

      <div className="blog-content">
        {fields.map((field, index) => {
          if (field.type === 'image') {
            return (
              <div key={index} className="content-image">
                <img src={field.value} alt={`Blog content ${index}`} />
              </div>
            );
          }

          if (field.type === 'content') {
            return (
              <div key={index} className="content-text">
                <div dangerouslySetInnerHTML={{ __html: field.value }} />
              </div>
            );
          }

          if (field.type === 'video') {
            return (
              <div key={index} className="content-video">
                <video controls width="100%" style={{ marginBottom: '20px', borderRadius: '8px' }}>
                  <source src={field.value} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }

          if (field.type === 'youtube') {
            const videoId = extractYouTubeID(field.value);
            return videoId ? (
              <div key={index} className="content-youtube" style={{ marginBottom: '20px' }}>
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : null;
          }

          return null;
        })}
      </div>

      {/* Action Buttons */}
      <div className="preview-actions" style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={handlePublish} className="publish-button">
          Publish
        </button>
        <button onClick={handleBackToEdit} className="edit-button" style={{ marginLeft: '20px' }}>
          Back to Edit
        </button>
      </div>
    </div>
  );
};

export default PreviewBlog;