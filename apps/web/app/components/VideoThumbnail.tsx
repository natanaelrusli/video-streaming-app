"use client";

import Player from "video.js/dist/types/player";
import VideoPlayer from "./VideoPlayer";
import { useRef } from "react";

type VideoThumbnailProps = {
  videoUrl?: string;
  autoPlay?: boolean;
  thumbnailUrl: string;
};

const VideoThumbnail = ({ videoUrl, autoPlay, thumbnailUrl }: VideoThumbnailProps) => {
  const videoSrc =
    videoUrl || "http://localhost:8080/public/videos/c18e9e2c-0fa0-4fd0-a2e3-6deb77a3de4b/output.m3u8";

  const playerRef = useRef<Player | null>(null);

  const videoJsOptions = {
    autoplay: autoPlay || false,
    controls: false,
    responsive: true,
    fluid: true,
    muted: true,
    sources: [
      {
        src: videoSrc,
        type: "application/x-mpegURL",
      },
    ],
    poster: thumbnailUrl,
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;
    console.log("ready");
  };

  // TODO: show thumbnail poster again when paused
  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play()
      } else {
        playerRef.current.pause();
      }
    }
  };
  

  return (
    <div className="w-auto max-w-[400px] cursor-pointer" onMouseEnter={handlePlayPause} onMouseLeave={handlePlayPause}>
      <div className="mb-2">
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
      </div>

      <div className="flex flex-col justify-between">
        <p className="text-lg font-bold">Video Title</p>
        <div>
          <p className="text-sm text-gray-700">Author</p>
          <p className="text-sm text-gray-700">Play count</p>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
