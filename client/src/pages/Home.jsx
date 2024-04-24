import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions
import { app } from '../firebase'; // Import Firebase app

const Home = () => {
  // State variables for input values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State variable for selected file
  const [uploadProgress, setUploadProgress] = useState(0); // State variable for upload progress
  const [uploadedClient, setUploadedClient] = useState(null); // State variable for uploaded client data

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create form data object
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('cardNumber', cardNumber);

      // Check if a file is selected
      if (selectedFile) {
        // Upload the selected file to Firebase Storage
        const storage = getStorage(app);
        const fileName = new Date().getTime() + selectedFile.name;
        const storageRef = ref(storage, "clientPhotos/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        // Update upload progress
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => {
            console.error('Error uploading file:', error);
          },
          () => {
            // Upload completed successfully, get download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // Append photoURL to form data
              formData.append('photoURL', downloadURL);

              // Send a POST request to the server with client data and image URL
              sendFormData(formData);
            });
          }
        );
      } else {
        // No file selected, send the form data without photoURL
        sendFormData(formData);
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors
      alert('An error occurred while adding the client'); // Display an error message to the user
    }
  };

  // Function to send form data to the server
  const sendFormData = async (formData) => {
    try {
      // Send a POST request to the server with client data and image URL
      const response = await axios.post('/server/client/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type for file upload
        }
      });

      console.log(response.data); // Log the response from the server

      // Set uploaded client data to state
      setUploadedClient(response.data.client);

      // Reset input fields after successful submission
      setFirstName('');
      setLastName('');
      setCardNumber('');
      setSelectedFile(null);
      setUploadProgress(0);

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
        {uploadProgress > 0 && <p className='text-black'>{`Uploading ${uploadProgress}%`}</p>} {/* Display upload progress */}
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Submit</button>
      </form>

      {/* Display uploaded client data */}
      {uploadedClient && (
  <div className='mt-5 flex items-center'>
    {/* Client Photo */}
    <div className='mr-5'>
      <img src={uploadedClient.photo} alt='Client Photo' className='rounded-md h-40 w-40 mx-auto mt-2 cursor-pointer object-cover' />
    </div>
    {/* Client Information */}
    <div>
      <p><strong>First Name:</strong> {uploadedClient.firstName}</p>
      <p><strong>Last Name:</strong> {uploadedClient.lastName}</p>
      <p><strong>Card Number:</strong> {uploadedClient.cardNumber}</p>
    </div>
  </div>
)}


    </div>
  );
};

export default Home;
