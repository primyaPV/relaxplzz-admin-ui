import React, { useState } from 'react';
import image1 from '../../assets/banner1.jpeg';
import video1 from '../../assets/video1.mp4'; // Example video asset
import '../../css/gallery/ImageVideo.css';

interface ImageVideo1 {
  id: number;
  media: string;
  title: string;
  type: 'image' | 'video';
  status: 'active' | 'inactive';
}

const ImageVideo: React.FC = () => {
  const [mediaList, setMediaList] = useState<ImageVideo1[]>([
    { id: 1, media: image1, title: 'Banner 1', type: 'image', status: 'active' },
    { id: 2, media: video1, title: 'Banner 2', type: 'video', status: 'inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMedia, setNewMedia] = useState({
    title: '',
    media: null as File | null,
    type: 'image' as 'image' | 'video',
  });

  const handleCreateMedia = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewMedia({ title: '', media: null, type: 'image' });
  };

  const handleRestore = () => {
    setNewMedia({ title: '', media: null, type: 'image' });
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewMedia((prev) => ({ ...prev, media: file }));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewMedia((prev) => ({ ...prev, type: e.target.value as 'image' | 'video' }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedia((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedia.media && newMedia.title) {
      const newMediaItem: ImageVideo1 = {
        id: mediaList.length + 1,
        media: URL.createObjectURL(newMedia.media), // For file uploads
        title: newMedia.title,
        type: newMedia.type,
        status: 'active', // Default status
      };
      setMediaList((prevList) => [...prevList, newMediaItem]);
      handleCloseModal();
    }
  };

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Image and Video Management</h1>
        <button className="create-gallery-button" onClick={handleCreateMedia}>
        <i className="fas fa-plus"></i>
        </button>
      </header>

      <div className="gallery-table-container">
        <table className="gallery-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Title</th>
              <th>Type</th> {/* Added Type column */}
              <th>Media</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.type === 'image' ? 'Image' : 'Video'}</td> {/* Display type as 'Image' or 'Video' */}
                <td>
                  {item.type === 'image' ? (
                    <img
                      src={item.media}
                      alt={`Media ${item.id}`}
                      className="gallery-image"
                      width="100"
                      height="60"
                    />
                  ) : (
                    <video width="100" height="60" controls>
                      <source src={item.media} type="video/mp4" />
                    </video>
                  )}
                </td>
                <td>
                  <select value={item.status} style={{ width: '100px' }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <button className="edit-button">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete-button">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating new media */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={handleCloseModal}>
              ×
            </button>
            <h2>Create New Media</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMedia.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Media Type</label>
                <select
                  id="type"
                  name="type"
                  value={newMedia.type}
                  onChange={handleTypeChange}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="media">Select Media</label>
                <input
                  type="file"
                  id="media"
                  name="media"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit">Add Media</button>
                <button type="button" onClick={handleRestore}>
                  Restore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageVideo;
