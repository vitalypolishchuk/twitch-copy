import "../../../../styles/Content.css";
import React from "react";

import HeaderVideos from "./HeaderVideos";
import LiveCategory from "./LiveCategory";
import LiveStreams from "./LiveStreams";

class Content extends React.Component {
  render() {
    return (
      <div className="content">
        <HeaderVideos />
        <LiveCategory categoryHeader="Live channels we think you'll like" />
        <LiveCategory categoryHeader="Recommended streams" />
      </div>
    );
  }
}

export default Content;
