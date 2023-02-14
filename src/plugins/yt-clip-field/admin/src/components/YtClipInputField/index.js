import React, { useState } from "react";
import { JSONInput } from "@strapi/design-system";

import styled from "styled-components";
import YouTubePlayer from '../YouTubePlayer';

const JSONInputWrapper = styled(JSONInput)`
  width: 100%;
  cursor: default;
`;

const SliderWithInputs = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5000);

  const handleStartChange = (event) => {
    const newStart = parseInt(event.target.value);
    if (newStart < end) {
      setStart(newStart);
    }
  };

  const handleEndChange = (event) => {
    const newEnd = parseInt(event.target.value);
    if (newEnd > start) {
      setEnd(newEnd);
    }
  };

  return (
    <div>
      <input type="range" min={0} max={10000} value={start} onChange={handleStartChange} />
      <input type="number" value={start} onChange={handleStartChange} />
      <input type="range" min={0} max={10000} value={end} onChange={handleEndChange} />
      <input type="number" value={end} onChange={handleEndChange} />
    </div>
  );
};


export default function YtClipInputField({ value, name, onChange }) {

  const [videoData, setVideoData] = React.useState(JSON.stringify({
    videoId: "",
    videoUrl: "",
    name: "",
    start: 0,
    end: 100,
  }));

  return (
    <> 
    <YouTubePlayer  videoId={"RFk8ZmIDrFM"} videoUrl={"https://www.youtube.com/watch?v=RFk8ZmIDrFM"} />

      <JSONInputWrapper
        name={name}
        value={value !== "null" ? value : videoData}
        onChange={(json) => {
          onChange({ target: { name, value: json } });
        }}
      />

      <SliderWithInputs />

    </>
  );
}