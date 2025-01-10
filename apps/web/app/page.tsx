"use client";

import { useRef } from 'react'
import VideoPlayer from './components/VideoPlayer';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

export default function Home() {
  const videoSrc = 'http://localhost:8080/public/videos/c18e9e2c-0fa0-4fd0-a2e3-6deb77a3de4b/output.m3u8';

  const playerRef = useRef<Player | null>(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: videoSrc,
      type: 'application/x-mpegURL'
    }],
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };


  return (
    <>
      <div>
        <h1>Video</h1>
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </>
  )
}
