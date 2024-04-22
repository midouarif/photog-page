import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

const Home = () => {
  // State variables for input values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State variable for selected file

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create form data object
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('cardNumber', cardNumber);
      formData.append('photo', selectedFile); // Append selected file to form data

      // Send a POST request to the server with client data and image
      const response = await axios.post('/server/client/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type for file upload
        }
      });

      console.log(response.data); // Log the response from the server

      // Reset input fields after successful submission
      setFirstName('');
      setLastName('');
      setCardNumber('');
      setSelectedFile(null);

      alert('Client added successfully'); // Display a success message to the user
    } catch (error) {
      console.error('Error:', error); // Log any errors
      alert('An error occurred while adding the client'); // Display an error message to the user
    }
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Add a client</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='bg-slate-100 p-3 rounded-lg' />
        <input type='text' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className='bg-slate-100 p-3 rounded-lg' />
        <input type='text' placeholder='Card Number' value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className='bg-slate-100 p-3 rounded-lg' />
        <input type='file' onChange={handleFileChange} className='bg-slate-100 p-3 rounded-lg' /> {/* File input field */}
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Submit</button>
      </form>
    </div>
  );
};

export default Home;
