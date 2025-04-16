import React, { useState } from 'react';
import '../../css/enquiry/EnquiryList.css';

const EnquiryList: React.FC = () => {
const [editEnquiryId, setEditEnquiryId] = useState<number | null>(null);
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      subject: 'General Inquiry',
      message: 'I would like to know more about your services.',
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      subject: 'Support',
      message: 'I’m having trouble logging into my account.',
    },
  ]);

  const handleCreateEnquiry = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: number) => {
    const enquiryToEdit = enquiries.find((enq) => enq.id === id);
    if (enquiryToEdit) {
      setFormData(enquiryToEdit);
      setEditEnquiryId(id);
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setEnquiries((prev) => prev.filter((enq) => enq.id !== deleteTargetId));
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEnquiryId !== null) {
      // Editing existing enquiry
      setEnquiries((prev) =>
        prev.map((enq) =>
          enq.id === editEnquiryId ? { ...formData, id: editEnquiryId } : enq
        )
      );
    } else {
      // Creating new enquiry
      const newEnquiry = { ...formData, id: enquiries.length + 1 };
      setEnquiries((prev) => [...prev, newEnquiry]);
    }
  
    setIsModalOpen(false);
    setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    setEditEnquiryId(null);
  };
  

  const handleReset = () => {
    setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
  };

  const filteredEnquiries = enquiries.filter((enquiry) =>
    Object.values(enquiry).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="enquiry-list-page">
      <header className="enquiry-list-header">
        <h1>Enquiry List</h1>
        <input
          type="text"
          placeholder="Search enquiries..."
          className="enquiry-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="create-enquiry-button" onClick={handleCreateEnquiry}>
          <i className="fas fa-plus"></i>
        </button>
      </header>

      <div className="enquiry-list-table-container">
        <table className="enquiry-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.fullName}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.phone}</td>
                <td>{enquiry.subject}</td>
                <td>{enquiry.message}</td>
                <td>
                <button className="edit-button" onClick={() => handleEdit(enquiry.id)}>
                <i className="fas fa-edit"></i>
                </button>
                <button className="delete-button" onClick={() => handleDeleteClick(enquiry.id)}>
                <i className="fas fa-trash-alt"></i>
                </button>
            </td>
              </tr>
            ))}
            {filteredEnquiries.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={() => setIsModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2>{editEnquiryId !== null ? 'Edit Enquiry' : 'Enquiry Form'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit">
  {editEnquiryId !== null ? 'Save Changes' : 'Submit Enquiry'}
</button>
                <button type="button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{deleteConfirmOpen && (
  <div className="modal-overlay">
    <div className="modal-content1 confirm-modal">
      <h3>Do you want to delete this enquiry?</h3>
      <div className="form-actions">
        <button className="delete-confirm" onClick={confirmDelete}>Yes</button>
        <button className="cancel-button" onClick={() => setDeleteConfirmOpen(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default EnquiryList;
