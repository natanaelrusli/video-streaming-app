const express = require('express');
const cors = require('cors');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const { exec } = require('child_process');
const upload = require('./middlewares/multer');

const chapters = {};
const PORT = 3000;
const app = express();
const corsOptions = {
  origin: "*",
}
app.use(cors(corsOptions));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single('video'), (req, res) => {
  const chapterId = uuid.v4();
  const videoPath = req.file.path;
  const outputDir = `public/videos/${chapterId}`;
  const outputFileName = 'output.m3u8';
  const outputPath = path.join(outputDir, outputFileName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const command = `ffmpeg -i ${videoPath} \
    -map 0:v -c:v libx264 -crf 23 -preset medium -g 48 \
    -map 0:v -c:v libx264 -crf 28 -preset fast -g 48 \
    -map 0:v -c:v libx264 -crf 32 -preset fast -g 48 \
    -map 0:a -c:a aac -b:a 128k \
    -hls_time 10 -hls_playlist_type vod -hls_flags independent_segments -report \
    -f hls ${outputPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`ffmpeg exec error: ${error}`);
        return res.status(500).json({ error: 'Failed to convert video to HLS format' });
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    const videoUrl = `public/videos/${chapterId}/${outputFileName}`;
    chapters[chapterId] = { videoUrl, title: req.body.title, description: req.body.description };
    res.status(201)
    .json({
      success: true,
      message: 'Video uploaded and converted to HLS.',
      chapterId 
    });
  });
});

app.get('/getVideo', (req, res) => {
  const { chapterId } = req.query;
  console.log(chapters);
  if (!chapters[chapterId]) {
    return res.status(404).json({ error: "chapter not found" });
  }

  const { title, videoUrl } = chapters[chapterId];
  console.log(title, " ", chapters[chapterId]);
  res.json({ title: title, url: videoUrl });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
