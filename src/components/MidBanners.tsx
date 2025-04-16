import React, { useState } from 'react';
import mid1 from '../assets/mid1.jpeg';
import mid2 from '../assets/mid2.jpeg';
import mid3 from '../assets/mid3.jpeg';
import '../css/MidBanners.css';

interface MidBanner {
  id: number;
  image: string;
  order: number;
  status: 'active' | 'inactive'; 
}

const MidBanners: React.FC = () => {
  const [midBanners, setMidBanners] = useState<MidBanner[]>([
    { id: 1, image: mid1, order: 1, status: 'active' },
    { id: 2, image: mid2, order: 2, status: 'inactive' },
    { id: 3, image: mid3, order: 3, status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMidBanner, setNewMidBanner] = useState({
    image: null as File | null,
  });

  const handleCreateMidBanner = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewMidBanner({ image: null });
  };

  const handleRestore = () => {
    setNewMidBanner({ image: null });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewMidBanner((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMidBanner.image) {
      const newMidBannerWithId: MidBanner = {
        id: midBanners.length + 1,
        image: URL.createObjectURL(newMidBanner.image),
        order: 1, // Default order
        status: 'active', // Default status (you can change this logic)
      };
      setMidBanners((prevMidBanners) => [...prevMidBanners, newMidBannerWithId]);
      handleCloseModal();
    }
  };

  return (
    <div className="midbanners-page">
      <header className="midbanners-header">
        <h1>Mid Banners Management</h1>
        <button className="create-midbanner-button" onClick={handleCreateMidBanner}>
        <i className="fas fa-plus"></i>
        </button>
      </header>

      <div className="midbanners-table-container">
        <table className="midbanners-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Image</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {midBanners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.id}</td>
                <td>
                  <img
                    src={banner.image}
                    alt={`Mid Banner ${banner.id}`}
                    className="midbanner-image"
                    width="100"
                    height="60"
                  />
                </td>
                <td>
                  <select
                    className="form-select order-select"
                    value={banner.order}
                    style={{
                      width: '56px',
                      fontSize: '10px',
                      padding: '2px',
                      paddingRight: '12px',
                      textAlign: 'center',
                      marginLeft: '20px',
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </td>
                <td>
                  <select value={banner.status} style={{ width: '100px' }}>
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

      {/* Modal for creating new mid-banner */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal-button"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h2>Create New Mid Banner</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="image">Mid Banner Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit">Add Mid Banner</button>
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

export default MidBanners;
