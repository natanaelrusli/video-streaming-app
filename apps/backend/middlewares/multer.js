import multer from "multer";
import { errorResponse } from "../dto/response.js";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    cb(null, uploadDir); // Specify the directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Set a unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['video/mp4', 'video/x-matroska', 'video/webm', 'video/ogg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MKV, WEBM, and OGG are allowed.'));
    }
  },
}).single('video');

export const uploadFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return errorResponse(res, 400, err.message);
    } else if (err) {
      return errorResponse(res, 500, 'An unknown error occurred when uploading');
    }
    
    next()
  })
}

