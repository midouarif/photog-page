import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser'; // Correct import


dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

const app = express();
app.use(express.json());
app.use(cookieParser()); // Use cookieParser directly
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
app.use('/server/user',userRoute);
app.use('/server/auth',authRoute);

app.use((err,req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});
