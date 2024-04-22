import express from 'express';
import multer from 'multer';
import Client from "../models/client.model.js";
import { uploadClient } from '../controllers/client.controller.js';

// Set up multer storage for storing uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name
  }
});

// Create multer instance with specified storage settings
const upload = multer({ storage: storage });

// Create express router
const router = express.Router();

// Define route handler with middleware
router.post('/upload', upload.single('photo'), uploadClient);

export default router;
