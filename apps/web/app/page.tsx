"use client";

import { useRef } from 'react'
import VideoPlayer from './components/VideoPlayer';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

export default function Home() {
  const videoSrc = 'http://localhost:3000/public/videos/130b39ac-3b6f-4ada-8848-204774b04ff0/output.m3u8';

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
