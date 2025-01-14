import VideoThumbnail from "./VideoThumbnail";

const VideoGrid = () => {
  return (
    <div className="grid grid-cols-3 w-full gap-3">
      <VideoThumbnail 
        thumbnailUrl="https://i.ytimg.com/vi/77QPuQYtKTY/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDMTgHJC6t2U3jFfeB8t2rbLELp8w"
      />
    </div>
  )
}

export default VideoGrid