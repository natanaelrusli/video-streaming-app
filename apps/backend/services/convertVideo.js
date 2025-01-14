export const convertToHlsCommand = (videoPath, outputDir, outputPath) => `ffmpeg -i ${videoPath} \
    -map 0:v -c:v libx264 -crf 23 -preset medium -g 48 \
    -hls_time 10 -hls_playlist_type vod -hls_segment_filename '${outputDir}/%03d.ts' ${outputPath}`;