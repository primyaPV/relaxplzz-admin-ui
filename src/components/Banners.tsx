import React, { useState } from 'react';
import banner1 from '../../src/assets/banner1.jpeg';
import banner2 from '../../src/assets/banners2.jpeg';
import banner3 from '../../src/assets/banners3.jpeg';
import '../../src/css/Banners.css';

interface Banner {
  id: number;
  image: string;
  order: number;
  status: 'active' | 'inactive';  // status should be either 'active' or 'inactive'
}

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, image: banner1, order: 1, status: 'active' },
    { id: 2, image: banner2, order: 2, status: 'inactive' },
    { id: 3, image: banner3, order: 3, status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    image: null as File | null,
  });

  // Open the modal to create a new banner
  const handleCreateBanner = () => {
    setIsModalOpen(true);
  };

  // Close the modal and reset new banner state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewBanner({ image: null });
  };

  // Restore button handler to clear the image field
  const handleRestore = () => {
    setNewBanner({ image: null }); // Reset image state to null
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewBanner((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle form submission to add a new banner
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBanner.image) {
      const newBannerWithId: Banner = {
        id: banners.length + 1,
        image: URL.createObjectURL(newBanner.image),
        order: 1, // Default order
        status: 'active', // Default status (you can change this logic)
      };
      setBanners((prevBanners) => [...prevBanners, newBannerWithId]);
      handleCloseModal();
    }
  };

  return (
    <div className="banners-page">
      <header className="banners-header">
        <h1>Banners Management</h1>
        <button className="create-banner-button" onClick={handleCreateBanner}>
        <i className="fas fa-plus"></i>
        </button>
      </header>

      <div className="banners-table-container">
        <table className="banners-table">
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
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.id}</td>
                <td>
                  <img
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    className="banner-image"
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

      {/* Modal for creating new banner */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal-button"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h2>Create New Banner</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="image">Banner Image</label>
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
                <button type="submit">Add Banner</button>
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

export default Banners;
