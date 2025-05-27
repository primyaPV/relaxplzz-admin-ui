import React, { useState } from 'react';
import mid1 from '../assets/mid1.jpeg';
import mid2 from '../assets/mid2.jpeg';
import mid3 from '../assets/mid3.jpeg';
import '../css/MidBanners.css';

interface MidBanner {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonCount: number;
  buttons: { name: string; link: string }[];
  order: number;
  status: 'active' | 'inactive';
}
interface NewMidBanner {
  image: File | null;
  title: string;
  description: string;
  buttonCount: number;
  buttons: { name: string; link: string }[];
  order: number;
  status: 'active' | 'inactive';
}


const MidBanners: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
const [editBannerId, setEditBannerId] = useState<number | null>(null);

  const [midBanners, setMidBanners] = useState<MidBanner[]>([
    {
      id: 1,
      image: mid1,
      title: 'Mid Banner 1',
      description: 'This is the first mid banner.',
      buttonCount: 1,
      buttons: [{ name: 'Click Me', link: 'https://example.com/1' }],
      order: 1,
      status: 'active',
    },
    {
      id: 2,
      image: mid2,
      title: 'Mid Banner 2',
      description: 'Second banner with two buttons.',
      buttonCount: 2,
      buttons: [
        { name: 'Shop', link: 'https://example.com/shop' },
        { name: 'Info', link: 'https://example.com/info' },
      ],
      order: 2,
      status: 'inactive',
    },
    {
      id: 3,
      image: mid3,
      title: 'Mid Banner 3',
      description: 'Another banner with a single action.',
      buttonCount: 1,
      buttons: [{ name: 'More', link: 'https://example.com/more' }],
      order: 3,
      status: 'active',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMidBanner, setNewMidBanner] = useState<NewMidBanner>({
  image: null,
  title: '',
  description: '',
  buttonCount: 0,
  buttons: [{ name: '', link: '' }],
  order: 1,
  status: 'active',
});

  const handleCreateMidBanner = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewMidBanner({
      image: null,
      title: '',
      description: '',
      buttonCount: 0,
      buttons: [{ name: '', link: '' }],
      order: 1,
      status: 'active',
    });
  };
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

const toggleMenu = (id: number) => {
  setOpenMenuId(openMenuId === id ? null : id);
};

const handleEdit = (id: number) => {
  const bannerToEdit = midBanners.find(b => b.id === id);
  if (bannerToEdit) {
    // For image, convert string URL back to null since we can't set File from URL
    setNewMidBanner({
      image: null,
      title: bannerToEdit.title,
      description: bannerToEdit.description,
      buttonCount: bannerToEdit.buttonCount,
      buttons: bannerToEdit.buttons,
      order: bannerToEdit.order,
      status: bannerToEdit.status,
    });
    setEditBannerId(id);
    setIsEditMode(true);
    setIsModalOpen(true);
    setOpenMenuId(null); // close menu
  }
};


const handleDelete = (id: number) => {
  if (window.confirm('Are you sure you want to delete this banner?')) {
    setMidBanners(prev => prev.filter(b => b.id !== id));
  }
  setOpenMenuId(null); // close menu
};


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setNewMidBanner((prev) => ({ ...prev, image: file }));
    }
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (isEditMode && editBannerId !== null) {
    // Update existing banner
    setMidBanners(prev =>
      prev.map(b => {
        if (b.id === editBannerId) {
          return {
            ...b,
            title: newMidBanner.title,
            description: newMidBanner.description,
            buttonCount: newMidBanner.buttonCount,
            buttons: newMidBanner.buttons,
            order: newMidBanner.order,
            status: newMidBanner.status,
            // If new image uploaded, use new URL else keep old
            image: newMidBanner.image ? URL.createObjectURL(newMidBanner.image) : b.image,
          };
        }
        return b;
      })
    );
  } else {
    // Add new banner
    if (newMidBanner.image) {
      const newEntry: MidBanner = {
        id: midBanners.length + 1,
        image: URL.createObjectURL(newMidBanner.image),
        title: newMidBanner.title,
        description: newMidBanner.description,
        buttonCount: newMidBanner.buttonCount,
        buttons: newMidBanner.buttons,
        order: newMidBanner.order,
        status: newMidBanner.status,
      };
      setMidBanners(prev => [...prev, newEntry]);
    }
  }

  // Reset and close modal
  setIsEditMode(false);
  setEditBannerId(null);
  handleCloseModal();
};


  return (
    <div className="midbanners-page">
      <header className="midbanners-header">
        <h1>Mid Banners Management</h1>
        <button className="create-midbanner-button" onClick={handleCreateMidBanner}>
          +
        </button>
      </header>

      <div className="midbanners-table-container">
        <table className="midbanners-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Button Count</th>
              <th>Buttons</th>
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
                    className="mid-banner-image"
                  />
                </td>
                <td>{banner.title}</td>
                <td>{banner.description}</td>
                <td>{banner.buttonCount}</td>
                <td>
                  {banner.buttons.map((btn, idx) => (
                    <div key={idx} className="hover-wrapper">
                      <strong style={{ cursor: 'pointer', fontSize: '14px' }}>
                        {btn.name}
                      </strong>
                      <div className="hover-content">
                        <a href={btn.link} target="_blank" rel="noopener noreferrer">
                          {btn.link}
                        </a>
                      </div>
                    </div>
                  ))}
                </td>
                <td>
                  <select
  className="order-select"
  value={banner.order}
  onChange={(e) => {
    const order = parseInt(e.target.value);
    setMidBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id
          ? {
              ...b,
              order,
            }
          : b
      )
    );
  }}
>
  {[1, 2, 3, 4].map((num) => (
    <option key={num} value={num}>
      {num}
    </option>
  ))}
</select>

                </td>
                <td>
                  <select
  value={banner.status}
  onChange={(e) => {
    const value = e.target.value as 'active' | 'inactive';
    setMidBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id
          ? {
              ...b,
              status: value,
            }
          : b
      )
    );
  }}
>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>
                </td>
                <td className="actions-cell" style={{ position: 'relative' }}>
  <button
    className="midban-actions-menu-button"
    onClick={() => toggleMenu(banner.id)}
    aria-label="Actions menu"
  >
    ⋮
  </button>
  {openMenuId === banner.id && (
    <div className="midban-actions-dropdown">
      <button onClick={() => handleEdit(banner.id)} className="dropdown-item">
        Edit
      </button>
      <button onClick={() => handleDelete(banner.id)} className="dropdown-item delete">
        Delete
      </button>
    </div>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={handleCloseModal}>
              ×
            </button>
            <h2>{isEditMode ? 'Edit Mid Banner' : 'Create Mid Banner'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newMidBanner.title}
                  onChange={(e) =>
                    setNewMidBanner((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  value={newMidBanner.description}
                  onChange={(e) =>
                    setNewMidBanner((prev) => ({ ...prev, description: e.target.value }))
                  }
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Banner Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="buttonCount">Buttons Count</label>
                <select
                  id="buttonCount"
                  value={newMidBanner.buttonCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    const updated = Array.from({ length: count }, (_, i) =>
                      newMidBanner.buttons[i] || { name: '', link: '' }
                    );
                    setNewMidBanner((prev) => ({
                      ...prev,
                      buttonCount: count,
                      buttons: updated,
                    }));
                  }}
                >
                  {[0, 1, 2].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {newMidBanner.buttonCount > 0 &&
                newMidBanner.buttons.map((btn, index) => (
                  <div key={index} className="form-group">
                    <label>Button {index + 1}</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Name"
                        value={btn.name}
                        onChange={(e) => {
                          const updated = [...newMidBanner.buttons];
                          updated[index].name = e.target.value;
                          setNewMidBanner((prev) => ({
                            ...prev,
                            buttons: updated,
                          }));
                        }}
                        required
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Link"
                        value={btn.link}
                        onChange={(e) => {
                          const updated = [...newMidBanner.buttons];
                          updated[index].link = e.target.value;
                          setNewMidBanner((prev) => ({
                            ...prev,
                            buttons: updated,
                          }));
                        }}
                        required
                        style={{ flex: 2 }}
                      />
                    </div>
                  </div>
                ))}

              <div className="form-actions">
  <button type="submit">{isEditMode ? 'Save Changes' : 'Add Banner'}</button>
  <button type="button" onClick={() => {
    setIsEditMode(false);
    setEditBannerId(null);
    handleCloseModal();
  }}>Cancel</button>
</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MidBanners;
