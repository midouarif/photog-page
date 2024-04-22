import Client from "../models/client.model.js";

export const uploadClient = async (req, res, next) => {
   const { firstName, lastName, cardNumber } = req.body;
   try {
      // Check if a client with the same card number already exists
      const existingClient = await Client.findOne({ cardNumber });
      if (existingClient) {
         return res.status(400).json({ message: "Client with this card number already exists!" });
      }

      // Create a new instance of the Client model with the provided data
      const newClient = new Client({ firstName, lastName, cardNumber });

      // If a file was uploaded, set the photo path in the client object
      if (req.file) {
         newClient.photo = req.file.path;
      }
      
      // Save the new client data to the database
      await newClient.save();
      
      // Return a success response
      return res.status(201).json({ message: "Client created successfully!", client: newClient });
   } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
   }
}
