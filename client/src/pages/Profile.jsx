import React from 'react'
import {useSelector} from 'react-redux'
import {useRef} from 'react'
import {useState, useEffect} from 'react'
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const {Currentuser} = useSelector(state => state.user)
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
  useEffect(() => {
    if(image){
      handleImageUpload();
    }
  },[image]);
  const handleImageUpload = async () => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
          setImagePercent(rounded(progress));
        }, 
        (error) => {
          console.log(error);
          setImageError(true);
        }, 
        () => {
          console.log('Upload is completed');
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({...formData, profilePicture: downloadURL});
          });
        }
      );
    };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-5'>
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])}/>
        <img src={Currentuser.rest.profilePicture} alt='avatar' className='rounded-full h-24 w-24 mx-auto mt-2 cursor-pointer object-cover' onClick={() => fileRef.current.click()} />
        <p className='text-sm self-center'>
          {imageError? <span className='text-red-700'>Image upload failed (size must be less then 2Mb)</span> : imagePercent > 0 && imagePercent < 100? <span className='text-black'>{`Uploading ${imagePercent}%`}</span> : imagePercent === 100? <span className='text-green-700'>Image uploaded successfully</span> : null}
        </p>
        <input defaultValue={Currentuser.rest.username} type='text' id='username' placeholder='Username' className='bg-slate-100 rounded-lg p-3' />
        <input defaultValue={Currentuser.rest.email} type='email' id='email' placeholder='Email' className='bg-slate-100 rounded-lg p-3' />
        <input type='password' id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3' />
        <button className='bg-slate-800 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>Update</button>
        <div className='flex justify-between'>
          <span className='text-red-700 cursor-pointer'>Delete Account </span>
          <span className='text-red-700 cursor-pointer'>Sign Out </span>
        </div>
      </form>
    </div>
  )
}

export default Profile;