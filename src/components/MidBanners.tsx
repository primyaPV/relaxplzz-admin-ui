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

const MidBanners: React.FC = () => {
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
  const [newMidBanner, setNewMidBanner] = useState({
    image: null as File | null,
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
  
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setNewMidBanner((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMidBanner.image) {
      const newEntry: MidBanner = {
        id: midBanners.length + 1,
        image: URL.createObjectURL(newMidBanner.image),
        title: newMidBanner.title,
        description: newMidBanner.description,
        buttonCount: newMidBanner.buttonCount,
        buttons: newMidBanner.buttons,
        order: 1,
        status: 'active',
      };
      setMidBanners((prev) => [...prev, newEntry]);
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
          width="100"
          height="60"
        />
      </td>
      <td>{banner.title}</td>
      <td>{banner.description}</td>
      <td>{banner.buttonCount}</td>
      <td>
  {banner.buttons.map((btn, idx) => (
    <div key={idx} className="hover-wrapper" style={{ position: "relative", marginBottom: "10px" }}>
      <strong style={{ cursor: "pointer", fontSize: "14px" }}>{btn.name}</strong>
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
      <td>
                  <button className="edit-button"><i className="fas fa-edit"></i></button>
                  <button className="delete-button"><i className="fas fa-trash-alt"></i></button>
                </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
     
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={handleCloseModal}>×</button>
            <h2>Create Mid Banner</h2>

            <form onSubmit={handleSubmit}>
            <div className="form-group">
  <label htmlFor="title">Title</label>
  <input
    type="text"
    id="title"
    value={newMidBanner.title}
    onChange={(e) => setNewMidBanner((prev) => ({ ...prev, title: e.target.value }))}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="description">Description</label>
  <textarea
    id="description"
    rows={3}
    value={newMidBanner.description}
    onChange={(e) => setNewMidBanner((prev) => ({ ...prev, description: e.target.value }))}
    maxLength={100}
    required
  />
</div>

              <div className="form-group">
                <label htmlFor="image">Banner Image</label>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
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
                    setNewMidBanner((prev) => ({ ...prev, buttonCount: count, buttons: updated }));
                  }}
                >
                  {[0, 1, 2].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {newMidBanner.buttonCount > 0 && newMidBanner.buttons.map((btn, index) => (
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
                        setNewMidBanner((prev) => ({ ...prev, buttons: updated }));
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
                        setNewMidBanner((prev) => ({ ...prev, buttons: updated }));
                      }}
                      required
                      style={{ flex: 2 }}
                    />
                  </div>
                </div>
              ))}

              <div className="form-actions">
                <button type="submit">Add Banner</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MidBanners;
