import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { v4 } from 'uuid';
import path, { dirname } from 'path';
import { exec } from 'child_process';
import { upload } from './middlewares/multer.js'
import db from './db/conn.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const chapters = {};
const PORT = 8080;
const app = express();
const corsOptions = {
  origin: "*",
}
app.use(cors(corsOptions));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

const videosCollection = db.collection('videos');

app.post("/upload", upload.single('video'), (req, res) => {
  const chapterId = v4();
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const videoPath = req.file.path;
  const outputDir = `public/videos/${chapterId}`;
  const outputFileName = 'output.m3u8';
  const outputPath = path.join(outputDir, outputFileName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const command = `ffmpeg -i ${videoPath} \
    -map 0:v -c:v libx264 -crf 23 -preset medium -g 48 \
    -hls_time 10 -hls_playlist_type vod -hls_segment_filename '${outputDir}/%03d.ts' ${outputPath}`;

  exec(command, (error) => {
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
});

app.get("/getVideo", (req, res) => {
  res.send(req.query.chapterId);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
