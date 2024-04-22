import React, { useState, useEffect , useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import { signOut } from '../redux/user/userSlice';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { getDownloadURL } from 'firebase/storage';

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
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])}/>
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
          <span onClick={handleDeleteAcc} className='text-red-700 cursor-pointer'>Delete Account</span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
