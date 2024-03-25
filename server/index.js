import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

const app = express();
app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
app.use('/server/user',userRoute);
app.use('/server/auth',authRoute);