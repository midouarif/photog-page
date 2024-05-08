import Client from "../models/client.model.js";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library

export const uploadClient = async (req, res, next) => {
  const { firstName, lastName, cardNumber, photoURL } = req.body;

  try {
    // Check if a client with the same card number already exists
    const existingClient = await Client.findOne({ cardNumber });
    if (existingClient) {
      return res.status(400).json({ message: "Client with this card number already exists!" });
    }

    // Generate a unique UUID for the photo
    const uniqueCode = uuidv4().replace(/-/g, '').slice(0, 22);

    // Generate QR code URL using the unique code
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uniqueCode}`;

    // Create a new instance of the Client model with the provided data
    const newClient = new Client({ firstName, lastName, cardNumber, photo: photoURL, uniqueCode, qrCode: qrCodeURL });

    // Save the new client data to the database
    await newClient.save();

    // Return a success response
    return res.status(201).json({ message: "Client created successfully!", client: newClient });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};
