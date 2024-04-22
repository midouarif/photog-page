import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String, // Assuming the photo path will be stored as a string
    }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
