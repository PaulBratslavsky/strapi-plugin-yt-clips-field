import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import styled from "styled-components";

const YouTubePlayerWrapper = styled(YouTube)`
  .youtube-iframe {
    border-radius: 25px;
    overflow: hidden;
  }
`;

const YouTubePlayer = ({ videoId, callback, videoData }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clipStart, setClipStart] = useState(videoData?.start || 0);
  const [clipEnd, setClipEnd] = useState(videoData?.end || 0);
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
    callback(clipStart, currentTime)
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

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      controls: 0,
    }
  };

  return (
    <div>
      <YouTubePlayerWrapper
        iframeClassName={"youtube-iframe"}
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
        onProgress={onProgress}
        opts={opts}
      />
      {!clipEnd && <input style={{ width: "100%" }} type="range" min="0" max={player?.getDuration()} value={currentTime} onChange={onSeekBarChange} disabled={clipEnd} />}

      <div style={{ display: "flex", justifyContent: "center" }}>

        {!clipEnd && <>
          <button type="button" onClick={isPlaying ? pauseVideo : playVideo} >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={restartVideo}>Restart</button>
        </>}



        {!clipStart && <button type="button" onClick={() => setStart(currentTime)}>Set Start: {clipStart && formatTime(clipStart) || formatTime(currentTime)}</button>}
        {clipStart && !clipEnd && <button type="button" onClick={() => setEnd(currentTime)}>Set End: {clipEnd && formatTime(clipEnd) || formatTime(currentTime)}</button>}

        {clipEnd && <> <button type="button" onClick={playClip}>Play Clip</button><button type="button" onClick={reset}>Reset</button>
        </>}

      </div>
    </div>
  );
};

export default YouTubePlayer;
