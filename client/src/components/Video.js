import React, { useEffect, useRef } from "react";
import { StyledVideo } from "../routes/RoomStyles"; // Assuming StyledVideo is exported from RoomStyles.js

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

export default Video;
