import React, { useState, useEffect, useCallback } from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ videoId, videoUrl }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clipStart, setClipStart] = useState(null);
  const [clipEnd, setClipEnd] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onStateChange = (event) => {
    if (event.data === 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const onProgress = (event) => {
    setCurrentTime(event.playedSeconds);
  };

  const playVideo = () => {
    player.playVideo();
  };

  const pauseVideo = () => {
    player.pauseVideo();
  };

  const restartVideo = () => {
    setCurrentTime(0);
    player.seekTo(0);
    player.playVideo();
  };

  const setStart = () => {
    setClipStart(currentTime);
    player.pauseVideo();
  }

  const setEnd = () => {
    // calculate if end is before start if so set new start
    setClipEnd(currentTime);
    player.pauseVideo();
  }

  const reset = () => {
    setClipStart(null);
    setClipEnd(null);
    setCurrentTime(0);
  }


  const onSeekBarChange = (event) => {
    const time = event.target.value;
    if (time < clipStart) return;
    setCurrentTime(time);
    player.seekTo(time);
  };

  const playClip = () => {
    if (clipStart && clipEnd) {
      player.seekTo(clipStart);
      player.playVideo();
      setInterval(() => {
        setCurrentTime(player?.getCurrentTime() || 0);
      }, 1000);
      setTimeout(pauseVideo, (clipEnd - clipStart) * 1000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(player?.getCurrentTime() || 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [player]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div>
      <YouTube videoId={videoId} onReady={onReady} onStateChange={onStateChange} onProgress={onProgress} />
      <input style={{ width: "100%" }} type="range" min="0" max={player?.getDuration()} value={currentTime} onChange={onSeekBarChange} disabled={clipEnd} />

      <div style={{ display: "flex", justifyContent: "center" }}>

        {!clipEnd && <>
          <button onClick={isPlaying ? pauseVideo : playVideo} >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={restartVideo}>Restart</button>
        </>}



        {!clipStart && <button onClick={() => setStart(currentTime)}>Set Start: {clipStart && formatTime(clipStart) || formatTime(currentTime)}</button>}
        {clipStart && !clipEnd && <button onClick={() => setEnd(currentTime)}>Set End: {clipEnd && formatTime(clipEnd) || formatTime(currentTime)}</button>}

        {clipEnd && <> <button onClick={reset}>Reset</button>
          <button onClick={playClip}>Play Clip</button></>}

      </div>
    </div>
  );
};

export default YouTubePlayer;
