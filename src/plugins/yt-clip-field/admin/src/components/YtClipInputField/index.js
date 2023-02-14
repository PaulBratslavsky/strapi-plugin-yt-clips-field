import React, { useState } from "react";
import { JSONInput } from "@strapi/design-system";

import styled from "styled-components";
import YouTubePlayer from '../YouTubePlayer';

const JSONInputWrapper = styled(JSONInput)`
  width: 100%;
  cursor: default;
`;

export default function YtClipInputField({ value, name, onChange }) {

  const [videoData, setVideoData] = React.useState(value ? JSON.parse(value) : null);
  const [videoUrl, setVideoUrl] = React.useState("https://www.youtube.com/watch?v=RFk8ZmIDrFM");
  const [videoId, setVideoId] = React.useState("RFk8ZmIDrFM");

  function handleVideoDataChange(start, end) {
    setVideoData({
      ...videoData,
      start,
      end,
    });
  }
  const data = videoData ? JSON.stringify(videoData) : value;



  return (
    <div>
      <YouTubePlayer
        videoId={videoId}
        videoUrl={videoUrl}
        callback={handleVideoDataChange}
        videoData={videoData}
      />

      <JSONInputWrapper
        name={name}
        value={data}
        disabled
        onChange={(json) => {
          console.log(json, "json")
          onChange({ target: { name, value: json } });
        }}
      />


    </div>
  );
}