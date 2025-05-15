import React, { useEffect, useRef, useState } from 'react';
import banner1 from '../../src/assets/banner1.jpeg';
import banner2 from '../../src/assets/banners2.jpeg';
import banner3 from '../../src/assets/banners3.jpeg';
import '../../src/css/Banners.css';

interface Banner {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonCount: number;
  buttons: { name: string; link: string }[];
  order: number;
  status: 'active' | 'inactive';
  titleColor?: string;  // Optional color for the title
  descriptionColor?: string;  // Optional color for the description
  buttonColor?: string; // background color
 buttonTextColor?: string; // text color
}

const Banners: React.FC = () => {
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      image: banner1,
      title: 'First Banner',
      description: 'This is the first banner.',
      buttonCount: 1,
      buttons: [{ name: 'Learn More', link: 'https://example.com/learn-more' }],
      order: 1,
      status: 'active',
    },
    {
      id: 2,
      image: banner2,
      title: 'Second Banner',
      description: 'This is the second banner.',
      buttonCount: 2,
      buttons: [
        { name: 'Buy Now', link: 'https://example.com/buy-now' },
        { name: 'Details', link: 'https://example.com/details' },
      ],
      order: 2,
      status: 'inactive',
    },
    {
      id: 3,
      image: banner3,
      title: 'Third Banner',
      description: 'This is the third banner.',
      buttonCount: 2,
      buttons: [
        { name: 'Read More', link: 'https://example.com/read' },
        { name: 'Subscribe', link: 'https://example.com/subscribe' },
      ],
      order: 3,
      status: 'active',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
  image: null as File | null,
  title: '',
  description: '',
  buttonCount: 0,
  buttons: [{ name: '', link: '' }],
  titleColor: '#000000',
  descriptionColor: '#000000',
  buttonColor: '#007BFF',        // Default background color
  buttonTextColor: '#ffffff',    // Default text color
});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuEl = actionMenuRef.current;
      const modalEl = document.querySelector('.modal-overlay');

      const clickedInsideMenu = menuEl?.contains(event.target as Node);
      const clickedInsideModal = modalEl?.contains(event.target as Node);

      // Only close the menu if clicked outside BOTH menu and modal
      if (!clickedInsideMenu && !clickedInsideModal) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Open the modal to create a new banner
  const handleCreateBanner = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditBanner(null);
    setNewBanner({
      image: null,
      title: '',
      description: '',
      buttonCount: 0,
      buttons: [{ name: '', link: '' }],
      titleColor: '#000000',
      descriptionColor: '#000000',
      buttonColor: '#ffffff',
      buttonTextColor: '#000000',
    });
  };

  const handleRestore = () => {
    setNewBanner({
      image: null,
      title: '',
      description: '',
      buttonCount: 0,
      buttons: [{ name: '', link: '' }],
      titleColor: '#000000',
      descriptionColor: '#000000',
      buttonColor: '#ffffff',
      buttonTextColor: '#000000',
    });
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewBanner((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditBanner(banner);
    setIsModalOpen(true);
    setNewBanner({
      image: null,
      title: banner.title,
      description: banner.description,
      buttonCount: banner.buttonCount,
      buttons: [...banner.buttons],
      titleColor: '#000000',
      descriptionColor: '#000000',
      buttonColor: '#ffffff',
      buttonTextColor: banner.buttonTextColor || '#000000',
    });
  };

  const handleDelete = (banner: Banner) => {
    setBannerToDelete(banner);
  };

  const confirmDelete = () => {
    if (bannerToDelete) {
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setBannerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setBannerToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editBanner) {
      // Edit existing banner
      const updatedBanner: Banner = {
  ...editBanner,
  image: newBanner.image ? URL.createObjectURL(newBanner.image) : editBanner.image,
  title: newBanner.title,
  description: newBanner.description,
  buttonCount: newBanner.buttonCount,
  buttons: newBanner.buttons,
  titleColor: newBanner.titleColor,
  descriptionColor: newBanner.descriptionColor,
  buttonColor: newBanner.buttonColor,
  buttonTextColor: newBanner.buttonTextColor,
};


      setBanners((prev) =>
        prev.map((b) => (b.id === editBanner.id ? updatedBanner : b))
      );
    } else {
      // Create new banner
      if (newBanner.image) {
        const newBannerWithId: Banner = {
  id: banners.length + 1,
  image: URL.createObjectURL(newBanner.image),
  title: newBanner.title,
  description: newBanner.description,
  buttonCount: newBanner.buttonCount,
  buttons: newBanner.buttons,
  order: 1,
  status: 'active',
  titleColor: newBanner.titleColor,
  descriptionColor: newBanner.descriptionColor,
  buttonColor: newBanner.buttonColor,
  buttonTextColor: newBanner.buttonTextColor,
};

        setBanners((prevBanners) => [...prevBanners, newBannerWithId]);
      }
    }

    handleCloseModal();
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
              <th>Title</th>
              <th>Description</th>
              <th>Buttons Count</th>
              <th>Buttons</th>
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
                <td>{banner.title}</td>
                <td>{banner.description}</td>
                <td>{banner.buttonCount}</td>
                <td>
                  {banner.buttons.map((btn, idx) => (
                    <div key={idx} className="hover-wrapper" style={{ position: 'relative', marginBottom: '10px' }}>
                      <strong style={{ cursor: 'pointer', fontSize: '14px' }}>{btn.name}</strong>
                      <div className="hover-content">
                        <a href={btn.link} target="_blank" rel="noopener noreferrer">{btn.link}</a>
                      </div>
                    </div>
                  ))}
                </td>
                <td>
                  <select className="form-select order-select" value={banner.order}>
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select value={banner.status}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>

                <td className="banner-action-cell">
                  <button
                    className="banner-menu-button"
                    onClick={() => setOpenMenuId(openMenuId === banner.id ? null : banner.id)}
                  >
                    ⋮
                  </button>

                  {openMenuId === banner.id && (
                    <div className="banner-action-menu" ref={actionMenuRef}>
                      <button onClick={() => { handleEdit(banner); setOpenMenuId(null); }}>Edit</button>
                      <button onClick={() => { handleDelete(banner); setOpenMenuId(null); }}>Delete</button>
                      <button onClick={() => { setPreviewBanner(banner); setOpenMenuId(null); }}>Preview</button>
                    </div>
                  )}
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
                 required={!editBanner} // required only when creating
                  />

                  {newBanner.image && (
                   <img
                    src={URL.createObjectURL(newBanner.image)}
                      alt="Banner Preview"
                       style={{
                       marginTop: '10px',
                      width: '80%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                         borderRadius: '6px',
                        border: '1px solid #ccc',
                         }}
                          />
                         )}
                          </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newBanner.title}
                  onChange={(e) =>
                    setNewBanner((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
                <div className="form-group">
                  <label>Title Color</label>
                  <input
                    type="color"
                    value={newBanner.titleColor}
                    onChange={(e) =>
                      setNewBanner((prev) => ({ ...prev, titleColor: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newBanner.description}
                  onChange={(e) =>
                    setNewBanner((prev) => ({ ...prev, description: e.target.value }))
                  }
                  required
                />
                <div className="form-group">
                  <label>Description Color</label>
                  <input
                    type="color"
                    value={newBanner.descriptionColor}
                    onChange={(e) =>
                      setNewBanner((prev) => ({ ...prev, descriptionColor: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="buttonCount">Buttons Count</label>
                <select
                  id="buttonCount"
                  value={newBanner.buttonCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    const updatedButtons = Array.from({ length: count }, (_, i) =>
                      newBanner.buttons[i] || { name: '', link: '' }
                    );
                    setNewBanner((prev) => ({
                      ...prev,
                      buttonCount: count,
                      buttons: updatedButtons,
                    }));
                  }}
                >
                  {[0, 1, 2].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>

              {newBanner.buttonCount > 0 &&
                newBanner.buttons.map((btn, index) => (
                  <div key={index} className="form-group">
                    <label>Button {index + 1}</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Name"
                        value={btn.name}
                        onChange={(e) => {
                          const updatedButtons = [...newBanner.buttons];
                          updatedButtons[index].name = e.target.value;
                          setNewBanner((prev) => ({ ...prev, buttons: updatedButtons }));
                        }}
                        required
                        style={{ flex: 1 }}
                      />
                      <input
                        type="url"
                        placeholder="Link"
                        value={btn.link}
                        onChange={(e) => {
                          const updatedButtons = [...newBanner.buttons];
                          updatedButtons[index].link = e.target.value;
                          setNewBanner((prev) => ({ ...prev, buttons: updatedButtons }));
                        }}
                        required
                        style={{ flex: 2 }}
                      />
                      <div className="form-group">
  <label>Button Background Color</label>
  <input
    type="color"
    value={newBanner.buttonColor}
    onChange={(e) =>
      setNewBanner((prev) => ({ ...prev, buttonColor: e.target.value }))
    }
  />
</div>

<div className="form-group">
  <label>Button Text Color</label>
  <input
    type="color"
    value={newBanner.buttonTextColor}
    onChange={(e) =>
      setNewBanner((prev) => ({ ...prev, buttonTextColor: e.target.value }))
    }
  />
</div>

                    </div>
                  </div>
                ))}

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

      {/* Preview Banner Modal */}
      {previewBanner && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={() => setPreviewBanner(null)}>
              ×
            </button>
            <h2>Banner Preview</h2>
            <img
              src={previewBanner.image}
              alt="Preview"
              style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
            />
            <h3 style={{ color: previewBanner?.titleColor || '#000' }}>
  {previewBanner?.title}
</h3>
<p style={{ color: previewBanner?.descriptionColor || '#000' }}>
  {previewBanner?.description}
</p>
{previewBanner?.buttons?.map((btn, index) => (
  <a
  key={index}
  href={btn.link}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: 'inline-block',
    padding: '8px 16px',
    margin: '5px',
    background: previewBanner?.buttonColor || '#007BFF',
    color: previewBanner?.buttonTextColor || '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
  }}
>
  {btn.name}
</a>

))}
          </div>
        </div>
      )}

      {/* Delete Banner Confirmation Modal */}
      {bannerToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <h3>Are you sure you want to delete this banner?</h3>
            <p><strong>{bannerToDelete.title}</strong></p>
            <div className="form-actions">
              <button className="delete-confirm" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
