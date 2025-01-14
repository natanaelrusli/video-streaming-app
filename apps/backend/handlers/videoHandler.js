import fs from 'fs';
import { exec } from "child_process";
import { v4 } from 'uuid';
import path from 'path';
import { videosCollection } from "../db/dbCollections.js";
import { outputFileName } from "../constants/fileName.js";
import { convertToHlsCommand } from "../services/convertVideo.js";
import { errorResponse, successResponse } from '../dto/response.js';

class VideoHandler {
  static async getVideo(req, res, next) {
    if (req.query.chapterId) {
      const video = await videosCollection.findOne({
        chapterId: req.query.chapterId
      });
  
      res.status(200).json({
        data: video
      });
  
      return;
    }
  
    const videos = await videosCollection.find({}).toArray();
    res.status(200).json({
      data: videos
    });
  }

  static async uploadVideo(req, res, next) {
    const chapterId = v4();
    const { title } = req.body;

    if (!title) return errorResponse(res, 400, 'title is required');
    if (!req.file) return errorResponse(res, 400, 'No file uploaded');

    const videoPath = req.file.path;
    const outputDir = `public/videos/${chapterId}`;
    const outputPath = path.join(outputDir, outputFileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    exec(convertToHlsCommand(videoPath, outputDir, outputPath), (error) => {
      if (error) return errorResponse(res, 500, error.message)

      videosCollection.insertOne({
        chapterId,
        videoPath: outputPath,
        createdAt: new Date()
      }, (err) => {
        if (err) return errorResponse(res, 500, 'Error saving video details', err);
      });
    
      return successResponse(res, 200, 'Video uploaded successfully', {
        chapterId,
        videoPath: outputPath,
        createdAt: new Date()
      })
    });
  }
}

export default VideoHandler;
