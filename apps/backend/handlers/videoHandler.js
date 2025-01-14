import { exec } from "child_process";
import { videosCollection } from "../db/dbCollections.js";
import fs from 'fs';
import { v4 } from 'uuid';
import path from 'path';
import { outputFileName } from "../constants/fileName.js";
import { convertToHlsCommand } from "../services/convertVideo.js";

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
  
    // get all videos
    const videos = await videosCollection.find({}).toArray();
    res.status(200).json({
      data: videos
    });
  }

  static async uploadVideo(req, res, next) {
    const chapterId = v4();
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const videoPath = req.file.path;
    const outputDir = `public/videos/${chapterId}`;
    const outputPath = path.join(outputDir, outputFileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    exec(convertToHlsCommand(videoPath, outputDir, outputPath), (error) => {
      if (error) {
        console.error(`Error executing ffmpeg command: ${error.message}`);
        return res.status(500).send('Error processing video');
      }

    videosCollection.insertOne({
      chapterId,
      videoPath: outputPath,
      createdAt: new Date()
    }, (err, result) => {
      if (err) {
        console.error('Error saving video details to MongoDB', err);
        return res.status(500).send('Error saving video details');
      }
    });
    
    res.status(200).send({ chapterId, videoPath: outputPath });
  });
  }
}

export default VideoHandler;
