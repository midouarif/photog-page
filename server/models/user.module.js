import { timeStamp } from 'console';
import mongoose from 'mongoose';
const userShema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
        unique: true,
    },
},{timeStamp: true});
const User = mongoose.model('User',userShema);
export default User;