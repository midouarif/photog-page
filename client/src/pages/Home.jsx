import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import html2pdf from 'html2pdf.js'; // Import html2pdf library
import './Home.css';

const Home = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedClient, setUploadedClient] = useState(null);
  const [photoDataURL, setPhotoDataURL] = useState(null);
  const [qrCodeDataURL, setQRCodeDataURL] = useState(null);

  useEffect(() => {
    if (uploadedClient) {
      // Convert photo URL to data URL
      fetch(uploadedClient.photo)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            setPhotoDataURL(reader.result);
          };
          reader.readAsDataURL(blob);
        });

      // Convert QR code URL to data URL
      fetch(uploadedClient.qrCode)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            setQRCodeDataURL(reader.result);
          };
          reader.readAsDataURL(blob);
        });
    }
  }, [uploadedClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!/^\d{9}$/.test(cardNumber)) {
        alert('Invalid Card Number.');
        return;
      }

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('cardNumber', cardNumber);

      if (selectedFile) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + selectedFile.name;
        const storageRef = ref(storage, "clientPhotos/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => {
            console.error('Error uploading file:', error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              formData.append('photoURL', downloadURL);

              // Send form data to the backend
              sendFormData(formData);
            });
          }
        );
      } else {
        sendFormData(formData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the client');
    }
  };

  const sendFormData = async (formData) => {
    try {
      const response = await axios.post('/server/client/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedClient(response.data.client);

      setFirstName('');
      setLastName('');
      setCardNumber('');
      setSelectedFile(null);
      setUploadProgress(0);

      alert('Client added successfully');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while adding the client');
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const downloadAsPDF = () => {
    const element = document.getElementById('clientInfo');
    html2pdf().from(element).save();
  };

  return (
    <>
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Add a client</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='bg-slate-100 p-3 rounded-lg' />
        <input type='text' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className='bg-slate-100 p-3 rounded-lg' />
        <input type='text' placeholder='Card Number' value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className='bg-slate-100 p-3 rounded-lg' />
        <input type='file' onChange={handleFileChange} className='bg-slate-100 p-3 rounded-lg' />
        {uploadProgress > 0 && <p className='text-black'>{`Uploading ${uploadProgress}%`}</p>}
        <button type='submit' className="pushable">
          <span className="shadow"></span>
          <span className="edge"></span>
          <span className="front">Submit</span>
        </button>
      </form>
    </div>
    {uploadedClient && (
      <div className='flex-grow mt-5 flex items-center justify-center' id="clientInfo">
        <div className="bg-gray-200 rounded-lg p-3 flex items-center shadow-lg">
          <div className='mr-8'>
            {/* Display Client Photo */}
            {photoDataURL && <img src={photoDataURL} alt='Client Photo' className='rounded-md h-52 w-52 mx-auto mt-2 cursor-pointer object-cover' />}
          </div>
          <div className="flex flex-col justify-center">
            <div>
              <p className="text-lg font-semibold text-black mb-2">Client Information</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-black"><strong>First Name:</strong> {uploadedClient.firstName}</p>
                  <p className="text-black"><strong>Last Name:</strong> {uploadedClient.lastName}</p>
                </div>
                <div>
                  <p className="text-black"><strong>Card Number:</strong> {uploadedClient.cardNumber}</p>
                  <p className="text-black"><strong>Unique Code:</strong> {uploadedClient.uniqueCode}</p>
                </div>
              </div>
            </div>
            {/* Display QR code */}
            {qrCodeDataURL && (
              <div className="mt-4">
                <p className="text-lg font-semibold text-black mb-2">QR Code</p>
                <img src={qrCodeDataURL} alt='QR Code' className='rounded-md h-24 w-24 mx-auto mt-2 cursor-pointer object-cover' />
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {uploadedClient && (
      <div className="flex justify-center mt-5">
       <button onClick={downloadAsPDF} className="button relative py-2 px-4 outline-none flex justify-center items-center cursor-pointer bg-gray-500 rounded-lg text-white font-light text-sm uppercase transition duration-300 ease-in-out overflow-hidden transform hover:rotate-3">
  <span className="button__text relative z-10">Download PDF</span>
  <span className="button__icon absolute inset-0 w-full h-full bg-gray-300 rounded-lg opacity-0 transition duration-150 ease-in-out transform translate-x-full"></span>
  <span className="button__icon absolute inset-0 w-full h-full bg-gray-300 rounded-lg opacity-0 transition duration-150 ease-in-out transform translate-x-full scale-110"></span>
</button>


      </div>
    )}
    </>
  );
};

export default Home;
