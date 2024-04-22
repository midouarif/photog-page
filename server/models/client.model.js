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
        type: String,
        required: true,
    }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
