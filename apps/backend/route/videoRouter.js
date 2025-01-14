import express from 'express';
import VideoHandler from '../handlers/videoHandler.js';
import { upload } from '../middlewares/multer.js';

export const videoRouter = express.Router();

videoRouter.get('/api/get-video', VideoHandler.getVideo)
videoRouter.post('/api/upload-video', upload.single('video'), VideoHandler.uploadVideo)
