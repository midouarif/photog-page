import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom'
const Oath = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            const res = await fetch('/server/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    name:result.displayName,
                    email:result.email,
                    photo:result.photoURL
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            console.log(data);
            navigate('/')

            
        } catch (error) {
           console.log("could not log with google",error) 
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-600 text-white rounded-lg p-3 uppercase hover:opacity-95 '>continu with google</button>
  )
}

export default Oath