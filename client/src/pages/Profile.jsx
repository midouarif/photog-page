import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import { signOut } from '../redux/user/userSlice';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { getDownloadURL } from 'firebase/storage';
import './profile.css';

const Profile = () => {
  const { Currentuser } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: Currentuser.fullName,
    username: Currentuser.username,
    email: Currentuser.email,
    location: Currentuser.location,
    password: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation dialog
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
  }, [image]);

  const handleImageUpload = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, "profilePic/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${Currentuser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAcc = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${Currentuser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/server/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
        <img src={formData.profilePicture || Currentuser.profilePicture} alt='avatar' className='rounded-full h-24 w-24 mx-auto mt-2 cursor-pointer object-cover' onClick={() => fileRef.current.click()} />
        <p className='text-sm self-center'>
          {imageError ? <span className='text-red-700'>Image upload failed (size must be less than 2Mb)</span> : imagePercent > 0 && imagePercent < 100 ? <span className='text-black'>{`Uploading ${imagePercent}%`}</span> : imagePercent === 100 ? <span className='text-green-700'>Image uploaded successfully</span> : null}
        </p>
        <input defaultValue={formData.fullName} type='text' id='fullName' placeholder='Full Name' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <input defaultValue={formData.username} type='text' id='username' placeholder='Username' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <input defaultValue={formData.email} type='email' id='email' placeholder='Email' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <input defaultValue={formData.location} type='text' id='location' placeholder='Location' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <input type='password' id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <button className='bg-slate-800 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>Update</button>
        <div className='flex justify-between'>
        <button onClick={() => setShowConfirmation(true)}
  class="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
>
  <svg
    stroke="currentColor"
    viewBox="0 0 24 24"
    fill="none"
    class="h-5 w-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
    ></path>
  </svg>

  Delete
</button>

<button onClick={handleSignOut}
  class="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
>
  Sign Out
</button>

        </div>
      </form>
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="modal">
          <div className="card">
            <button className="exit-button" onClick={() => setShowConfirmation(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.485 2 2 6.485 2 12s4.485 10 10 10 10-4.485 10-10S17.515 2 12 2zm4.293 15.707a1 1 0 0 1-1.414 0L12 13.414l-3.879 3.879a1 1 0 1 1-1.414-1.414L10.586 12 6.707 8.121a1 1 0 1 1 1.414-1.414L12 10.586l3.879-3.879a1 1 0 0 1 1.414 1.414L13.414 12l3.879 3.879a1 1 0 0 1 0 1.414z"/>
              </svg>
            </button>
            <div className="card-content">
              <div className="card-heading">Delete Account</div>
              <div className="card-description">Are you sure you want to delete your account?</div>
              <div className="card-button-wrapper">
                <button onClick={handleDeleteAcc} className="card-button primary">Yes</button>
                <button onClick={() => setShowConfirmation(false)} className="card-button secondary">No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
