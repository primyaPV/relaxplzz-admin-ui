import React, { useState } from 'react';
import logo1 from '../../logo.svg';
import logo2 from '../../assets/site-logo-white-2.webp';
import '../../css/gallery/Link.css';

interface LinkItem {
  id: number;
  url: string;
  logo?: string | ArrayBuffer | null;
}

const Link: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: 1, url: 'https://www.google.com',logo:logo1},
    { id: 2, url: 'https://www.youtube.com',logo:logo2},
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState<{ url: string; logo: string | ArrayBuffer | null }>({
    url: '',
    logo: null,
  });

  const handleCreateLink = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLink((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLinkWithId: LinkItem = { ...newLink, id: links.length + 1 } as LinkItem;
    setLinks((prev) => [...prev, newLinkWithId]);
    setNewLink({ url: '', logo: null });
    setIsModalOpen(false);
  };

  const handleRestore = () => {
    setNewLink({ url: '', logo: null });
  };

  return (
    <div className="link-page">
      <header className="link-header">
        <h1>Link Page</h1>
        <button className="create-link-button" onClick={handleCreateLink}>
          <i className="fas fa-plus"></i>
        </button>
      </header>

      <div className="link-table-container">
        <table className="link-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>URL</th>
              <th>Logo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, index) => (
              <tr key={link.id}>
                <td>{index + 1}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </td>
                <td>
                  {link.logo && (
                    <img
                      src={link.logo.toString()}
                      alt="logo"
                      width="32"
                      height="32"
                      style={{ borderRadius: '4px', objectFit: 'cover' }}
                    />
                  )}
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={() => setIsModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2>Create New Link</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  type="text"
                  name="url"
                  value={newLink.url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="logo">Upload Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  required
                />
                {newLink.logo && (
                  <div className="preview-logo">
                    <img
                      src={newLink.logo.toString()}
                      alt="Preview"
                      width="64"
                      height="64"
                      style={{ marginTop: '10px', borderRadius: '6px' }}
                    />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit">Add Link</button>
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

export default Link;
