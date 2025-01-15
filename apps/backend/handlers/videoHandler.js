import fs from 'fs';
import { exec } from "child_process";
import { v4 } from 'uuid';
import path from 'path';
import { videosCollection } from "../db/dbCollections.js";
import { outputFileName } from "../constants/fileName.js";
import { convertToHlsCommand } from "../services/convertVideo.js";
import { errorResponse, paginationResponse, successResponse } from '../dto/response.js';

class VideoHandler {
  static async getVideo(req, res, next) {
    const { chapterId, page = 1, limit = 10 } = req.query;

    if (chapterId) {
      const video = await videosCollection.findOne({
        chapterId: chapterId
      });
  
      res.status(200).json({
        data: video
      });
  
      return;
    }

    // pagination
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const skip = (pageNumber - 1) * pageSize;
  
    const videos = await videosCollection
      .find({})
      .skip(skip)
      .limit(pageSize)
      .toArray();
    
    const total = await videosCollection.countDocuments();

    return paginationResponse(res, videos, {
      total,
      pageNumber,
      pageSize,
    })
  }

  static async deleteVideo(req, res, next) {
    const { chapterId } = req.body;
  
    if (!chapterId) {
      return errorResponse(res, 400, 'Chapter ID is required');
    }
  
    try {
      const deleteResult = await videosCollection.deleteOne({ chapterId });
  
      if (!deleteResult.deletedCount) {
        return errorResponse(res, 404, 'video not found or already deleted');
      }
  
      return successResponse(res, 200, 'video deleted successfully', { chapterId });
    } catch (error) {
      console.error('Error deleting video:', error);
      
      return errorResponse(res, 500, 'unexpected error occurred while deleting the video', {
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack, // Avoid exposing stack trace in production
      });
    }
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
