"use client";

import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

type VideoPlayerProps = {
    options: {
        autoplay: boolean;
        controls: boolean;
        responsive: boolean;
        fluid: boolean;
        sources: {
            src: string;
            type: string;
        }[];
    },
    onReady: (player: Player) => void;
}

export const VideoPlayer = ({ options, onReady }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {

        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('vjs-big-play-centered');
            if (videoRef.current) {
                videoRef.current.appendChild(videoElement);
            }

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                if (onReady) {
                    onReady(player)
                };
            });


            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [onReady, options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className='rounded-xl overflow-hidden'>
            <div ref={videoRef} />
        </div>
    );
}

export default VideoPlayer;