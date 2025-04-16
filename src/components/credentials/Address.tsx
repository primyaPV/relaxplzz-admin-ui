import React, { useState } from 'react';
import '../../css/Address.css';

interface AddressType {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  phoneNumbers: string[];
}

const Address: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressType[]>([
    {
      id: 1,
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      phoneNumbers: ["123-456-7890"],
    },
    {
      id: 2,
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      phoneNumbers: ["987-654-3210", "111-222-3333"],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [editAddressId, setEditAddressId] = useState<number | null>(null);

  const [newAddress, setNewAddress] = useState<Omit<AddressType, 'id'>>({
    street: '',
    city: '',
    state: '',
    zip: '',
    phoneNumbers: [''],
  });

  const handleCreateAddress = () => {
    setEditAddressId(null); 
    setNewAddress({ street: '', city: '', state: '', zip: '', phoneNumbers: [''] });
    setIsModalOpen(true);
  }

  const handleEdit = (address: AddressType) => {
    setEditAddressId(address.id);
    setNewAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phoneNumbers: [...address.phoneNumbers],
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === "phoneNumbers" && typeof index === 'number') {
      const updatedPhones = [...newAddress.phoneNumbers];
      updatedPhones[index] = value;
      setNewAddress((prev) => ({ ...prev, phoneNumbers: updatedPhones }));
    } else {
      setNewAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddPhoneField = () => {
    setNewAddress((prev) => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editAddressId !== null) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editAddressId ? { ...addr, ...newAddress } : addr
        )
      );
    } else {
      const newAddressWithId: AddressType = {
        ...newAddress,
        id: addresses.length + 1,
      };
      setAddresses((prev) => [...prev, newAddressWithId]);
    }

    setIsModalOpen(false);
    setEditAddressId(null);
    setNewAddress({ street: '', city: '', state: '', zip: '', phoneNumbers: [''] });
  };

  const handleRestore = () => {
    setNewAddress({ street: '', city: '', state: '', zip: '', phoneNumbers: [''] });
  };

  const confirmDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deleteTargetId !== null) {
      setAddresses(addresses.filter(addr => addr.id !== deleteTargetId));
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="address-page">
      <header className="address-header">
        <h1>Address Page</h1>
        <button className="create-address-button" onClick={handleCreateAddress}>
          <i className="fas fa-plus"></i>
        </button>
      </header>
      <div className="address-table-container">
        <table className="address-table">
          <thead>
            <tr>
              <th>Street</th>
              <th>City</th>
              <th>State</th>
              <th>Zip Code</th>
              <th>Phone Numbers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.id}>
                <td>{address.street}</td>
                <td>{address.city}</td>
                <td>{address.state}</td>
                <td>{address.zip}</td>
                <td>{address.phoneNumbers.join(', ')}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(address)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete-button" onClick={() => confirmDelete(address.id)}>
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
            <h2>{editAddressId !== null ? 'Edit Address' : 'Create New Address'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Street</label>
                <input type="text" name="street" value={newAddress.street} onChange={handleInputChange} required />
              </div>
              <div className="form-group"><label>City</label>
                <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} required />
              </div>
              <div className="form-group"><label>State</label>
                <input type="text" name="state" value={newAddress.state} onChange={handleInputChange} required />
              </div>
              <div className="form-group"><label>Zip</label>
                <input type="text" name="zip" value={newAddress.zip} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Phone Numbers</label>
                {newAddress.phoneNumbers.map((phone, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>
                    <input
                      type="text"
                      name="phoneNumbers"
                      value={phone}
                      onChange={(e) => handleInputChange(e, index)}
                      required
                    />
                    {index === newAddress.phoneNumbers.length - 1 && (
                      <button type="button" onClick={handleAddPhoneField}>
                        <i className="fas fa-plus"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="submit">{editAddressId !== null ? 'Save Changes' : 'Add Address'}</button>
                <button type="button" onClick={handleRestore}>Restore</button>
              </div>
            </form>
          </div>
        </div>
      )}

{deleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content1 confirm-modal">
            <h3>Do you want to delete this address?</h3>
            <div className="form-actions">
              <button className="delete-confirm" onClick={handleDelete}>Yes</button>
              <button className="cancel-button" onClick={() => setDeleteConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
