import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import PaginationComponent from './PaginationComponent';
import RowsPerPageSelect from './RowsPerPageSelect';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('firstName');
  const [formError, setFormError] = useState('');

  // Update the URL template literals correctly
  const API_URL = 'https://contact-management-mini-feature-of-a-crm-mfte.onrender.com';

  useEffect(() => {
    axios.get(`${API_URL}/contacts`)
      .then(response => setContacts(response.data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, company, jobTitle } = formData;

    if (!firstName || !lastName || !email || !phone || !company || !jobTitle) {
      setFormError('Please fill in all fields.');
      return;
    }

    // Separate duplicate check for email and phone
    const existingEmail = contacts.find(contact => contact.email === email);
    const existingPhone = contacts.find(contact => contact.phone === phone);

    if (existingEmail) {
      setFormError('A contact with this email already exists.');
      return;
    }

    if (existingPhone) {
      setFormError('A contact with this phone number already exists.');
      return;
    }

    setFormError('');

    if (isEditing) {
      updateContact();
    } else {
      addNewContact();
    }
  };

  const addNewContact = () => {
    axios.post(`${API_URL}/contacts`, formData)
      .then(response => {
        setContacts(prevContacts => [...prevContacts, response.data]);
        clearForm();
      })
      .catch(error => console.error('Error adding contact:', error));
  };

  const updateContact = () => {
    axios.put(`${API_URL}/contacts/${currentContactId}`, formData)
      .then(response => {
        setContacts(contacts.map(contact =>
          contact._id === currentContactId ? response.data : contact
        ));
        clearForm();
      })
      .catch(error => console.error('Error updating contact:', error));
  };

  const clearForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '' });
    setIsEditing(false);
    setCurrentContactId(null);
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setIsEditing(true);
    setCurrentContactId(contact._id);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/contacts/${id}`)
      .then(() => setContacts(contacts.filter(contact => contact._id !== id)))
      .catch(error => console.error('Error deleting contact:', error));
  };

  const handleSortRequest = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const sortedContacts = contacts.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const displayedContacts = sortedContacts.slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage);

  return (
    <Container>
      <h1>Contact Management</h1>
      <ContactForm 
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        formError={formError}
        isEditing={isEditing}
      />
      <RowsPerPageSelect
        contactsPerPage={contactsPerPage}
        handleRowsPerPageChange={(e) => setContactsPerPage(parseInt(e.target.value, 10))}
      />
      <ContactList
        contacts={displayedContacts}
        handleSortRequest={handleSortRequest}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <PaginationComponent
        count={Math.ceil(contacts.length / contactsPerPage)}
        currentPage={currentPage}
        onPageChange={(_, newPage) => setCurrentPage(newPage)}
      />
    </Container>
  );
};

export default App;
