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
  buttons: { name: string; link: string; color?: string; textColor?: string }[];
  order: number;
  status: 'active' | 'inactive';
  titleColor?: string;  
  descriptionColor?: string;
}

const Banners: React.FC = () => {
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);


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
  buttons: [{ name: '', link: '', color: '#007BFF', textColor: '#000000' }],
  titleColor: '#000000',
  descriptionColor: '#000000',
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

  useEffect(() => {
  if (newBanner.image) {
    const objectUrl = URL.createObjectURL(newBanner.image);
    setPreviewImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  } else if (editBanner?.image && typeof editBanner.image === 'string') {
    setPreviewImageUrl(editBanner.image);
  } else {
    setPreviewImageUrl(null);
  }
}, [newBanner.image, editBanner]);


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
      buttons: [{ name: '', link: '', color: '#007BFF', textColor: '#000000' }],
      titleColor: '#000000',
      descriptionColor: '#000000',
    });
  };

  const handleRestore = () => {
    setNewBanner({
      image: null,
      title: '',
      description: '',
      buttonCount: 0,
      buttons: [{ name: '', link: '', color: '#007BFF', textColor: '#000000' }],
      titleColor: '#000000',
      descriptionColor: '#000000',
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
  buttons: banner.buttons.map((btn) => ({
    ...btn,
    color: btn.color || '#007BFF',
    textColor: btn.textColor || '#000000',
  })),
  titleColor: banner.titleColor || '#000000',
  descriptionColor: banner.descriptionColor || '#000000',
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

  const handleSubmit = (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (editBanner) {
    // Editing existing banner
    const updatedBanner: Banner = {
      ...editBanner,
      image: newBanner.image ? URL.createObjectURL(newBanner.image) : editBanner.image,
      title: newBanner.title,
      description: newBanner.description,
      buttonCount: newBanner.buttonCount,
      buttons: newBanner.buttons,
      titleColor: newBanner.titleColor,
      descriptionColor: newBanner.descriptionColor,
    };

    setBanners((prev) =>
      prev.map((b) => (b.id === editBanner.id ? updatedBanner : b))
    );
  } else {
    // Creating a new banner
    if (newBanner.image) {
      const newBannerWithId: Banner = {
        id: banners.length + 1,
        image: URL.createObjectURL(newBanner.image),
        title: newBanner.title,
        description: newBanner.description,
        buttonCount: newBanner.buttonCount,
        buttons: newBanner.buttons,
        order: banners.length + 1,
        status: 'active',
        titleColor: newBanner.titleColor,
        descriptionColor: newBanner.descriptionColor,
      };

      setBanners((prevBanners) => [...prevBanners, newBannerWithId]);
    }
  }

  handleCloseModal();
  setShowPreview(false);
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
                      <button
  onClick={() => {
    setPreviewBanner(banner);
    setPreviewImageUrl(typeof banner.image === 'string' ? banner.image : '');
    setShowPreview(true);
    setOpenMenuId(null);
  }}
>
  Preview
</button>
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
            <h2>{editBanner ? 'Edit Banner' : 'Create New Banner'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="banner-form-group">
  <label htmlFor="image">Banner Image</label>
  <input
    type="file"
    id="image"
    name="image"
    accept="image/*"
    onChange={handleImageChange}
    required={!editBanner}
    className="banner-image-input"
  />
{/* //////////////////////////// */}
 {previewImageUrl && (
  <img
    src={previewImageUrl}
    alt="Banner Preview"
    className="banner-image-preview"
  />
)}
{/* //////////////////////////// */}
</div>


  <div className="banner-form-group-inline">
  <div className="banner-form-input-column">
    <label htmlFor="title">Title</label>
    <input
  type="text"
  id="title"
  value={newBanner.title}
  onChange={(e) =>
    setNewBanner((prev) => ({ ...prev, title: e.target.value }))
  }
  required
  style={{ color: newBanner.titleColor }}
/>
  </div>

  <div className="color-picker-group">
    <label className="color-picker-label">Color</label>
    <input
      type="color"
      className="color-picker-input"
      value={newBanner.titleColor}
      onChange={(e) => setNewBanner((prev) => ({ ...prev, titleColor: e.target.value }))}
    />
  </div>
</div>


  <div className="banner-form-group-inline">
  <div className="banner-form-input-column">
    <label htmlFor="description">Description</label>
    <textarea
  id="description"
  className="input-field"
  value={newBanner.description}
  onChange={(e) =>
    setNewBanner((prev) => ({ ...prev, description: e.target.value }))
  }
  required
  style={{ color: newBanner.descriptionColor }}  
/>
  </div>

  <div className="color-picker-group">
    <label className="color-picker-label">Color</label>
    <input
      type="color"
      className="color-picker-input"
      value={newBanner.descriptionColor}
      onChange={(e) => setNewBanner((prev) => ({ ...prev, descriptionColor: e.target.value }))}
    />
  </div>
</div>

  <div className="banner-form-group">
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
    className="banner-button-count-select"
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
                  <div key={index} className="banner-form-group">
                    <label>Button {index + 1}</label>
                    <div className="banner-form-group-inline">
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
  style={{
    flex: 1,
   color: btn.textColor || '#000000',

  }}
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

  <div className="color-picker-group">
    <label className="color-picker-label">BG</label>
    <input
  type="color"
  className="color-picker-input-button-bg"
  value={btn.color || '#007BFF'}
  onChange={(e) => {
    const updatedButtons = [...newBanner.buttons];
    updatedButtons[index].color = e.target.value;
    setNewBanner((prev) => ({ ...prev, buttons: updatedButtons }));
  }}
/>
  </div>

  <div className="color-picker-group">
    <label className="color-picker-label">Text</label>
    <input
  type="color"
  className="color-picker-input-button-text"
  value={btn.textColor || '#000000'}
  onChange={(e) => {
    const updatedButtons = [...newBanner.buttons];
    updatedButtons[index].textColor = e.target.value;
    setNewBanner((prev) => ({ ...prev, buttons: updatedButtons }));
  }}
/>
  </div>
</div>
</div>
 ))}

  <div className="form-actions">
  <button
    type="button"
    onClick={() => setShowPreview(true)}
  >
    Preview Banner
  </button>
  <button type="button" onClick={handleSubmit}>
  {editBanner ? 'Update Banner' : 'Add Banner'}
</button>

  <button type="button" onClick={handleRestore}>
    Restore
  </button>
</div>
  </form>
            
          </div>
        </div>
      )}

      {/* Preview Banner Modal */}
     {showPreview && (previewBanner || newBanner) && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button
        className="close-modal-button"
        onClick={() => {
          setShowPreview(false);
          setPreviewBanner(null);
        }}
      >
        &times;
      </button>

      <h2>Banner Preview</h2>

      {(() => {
        const banner = previewBanner || newBanner;

        return (
          <>
            <div
  className="banner-preview"
  style={{
    backgroundImage: previewImageUrl ? `url(${previewImageUrl})` : 'none',

  }}
>
  <div className="banner-preview-content">
    <h3 style={{ color: banner.titleColor || '#fff' }}>{banner.title}</h3>
    <p style={{ color: banner.descriptionColor || '#fff' }}>{banner.description}</p>
    <div className="banner-preview-buttons">
      {banner.buttons?.map((btn, index) => (
        <a
          key={index}
          href={btn.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: btn.color || '#007bff',
            color: btn.textColor || '#fff',
          }}
        >
          {btn.name}
        </a>
      ))}
    </div>
  </div>
</div>
          </>
        );
      })()}
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
