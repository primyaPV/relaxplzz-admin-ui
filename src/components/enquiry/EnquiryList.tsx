import React, { useEffect, useRef, useState } from 'react';
import '../../css/enquiry/EnquiryList.css';

const EnquiryList: React.FC = () => {
  const [editEnquiryId, setEditEnquiryId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [headerSearch, setHeaderSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('All Fields');
const [showDropdown, setShowDropdown] = useState(false);
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

const dropdownRef = useRef<HTMLDivElement>(null);

const searchFields = ['All Fields', 'Name', 'Email', 'Phone', 'Subject', 'Date'];

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    date: '',
  });
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      Name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      subject: 'General Inquiry',
      message: 'I would like to know more about your services.',
      date: '2025-04-10',
    },
    {
      id: 2,
      Name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      subject: 'Support',
      message: 'I’m having trouble logging into my account.',
      date: '2025-04-12',
    },
  ]);


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
    const currentDate = formData.date || new Date().toISOString().split('T')[0];

    if (editEnquiryId !== null) {
      setEnquiries((prev) =>
        prev.map((enq) =>
          enq.id === editEnquiryId ? { ...formData, id: editEnquiryId, date: currentDate } : enq
        )
      );
    } else {
      const newEnquiry = { ...formData, id: enquiries.length + 1, date: currentDate };
      setEnquiries((prev) => [...prev, newEnquiry]);
    }

    setIsModalOpen(false);
    setFormData({ Name: '', email: '', phone: '', subject: '', message: '', date: '' });
    setEditEnquiryId(null);
  };

  const handleReset = () => {
    setFormData({ Name: '', email: '', phone: '', subject: '', message: '', date: '' });
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const generalMatch = Object.values(enquiry).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    let headerMatch = true;
  
    if (selectedField === 'Date') {
      if (startDate && endDate) {
        headerMatch = enquiry.date >= startDate && enquiry.date <= endDate;
      } else if (startDate) {
        headerMatch = enquiry.date >= startDate;
      } else if (endDate) {
        headerMatch = enquiry.date <= endDate;
      } else {
        headerMatch = true;
      }
    }
  
    return generalMatch && headerMatch;
  });
  
  
  
  

  return (
    <div className="enquiry-list-page">
      <header className="enquiry-list-header">
        <h1>Enquiry List</h1>
        <div className="search-bar-group">
          <div className="search-bar-wrapper" ref={dropdownRef}>
            {/* Dropdown to select search field */}
            <input
              type="text"
              placeholder="Search by field"
              className="enquiry-search-input"
              value={selectedField}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => setHeaderSearch(e.target.value)}
            />
            {showDropdown && (
              <div className="search-dropdown">
                {searchFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="search-dropdown-option"
                    onClick={() => {
                      setSelectedField(field);
                      setHeaderSearch('');
                      setStartDate('');
                      setEndDate('');
                      setShowDropdown(false);
                    }}
                  >
                    {field}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedField === 'Date' ? (
            <div className="date-range-fields">
              <input
              type="date"
                className="enquiry-search-input"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {/* <p>to</p> */}
              <input
                type="date"
                className="enquiry-search-input"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          ) : (
            // Show the general search input for other fields
            <input
              type="text"
              placeholder="Search..."
              className="enquiry-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
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
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredEnquiries.length > 0 ? (
    filteredEnquiries.map((enquiry) => {
      const isEmailOnlySearch = searchTerm &&
        Object.keys(enquiry).every((key) =>
          key === 'email' ||
          !enquiry[key as keyof typeof enquiry]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      return (
        <tr key={enquiry.id}>
          {isEmailOnlySearch ? (
            <>
              <td></td>
              <td style={{ fontWeight: 'bold', color: 'blue' }}>{enquiry.email}</td>
              <td colSpan={5}></td>
            </>
          ) : (
            <>
              <td>{enquiry.Name}</td>
              <td>{enquiry.email}</td>
              <td>{enquiry.phone}</td>
              <td>{enquiry.subject}</td>
              <td>{enquiry.message}</td>
              <td>{enquiry.date}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(enquiry.id)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="delete-button" onClick={() => handleDeleteClick(enquiry.id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </>
          )}
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
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
                <label htmlFor="Name">Full Name</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
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
