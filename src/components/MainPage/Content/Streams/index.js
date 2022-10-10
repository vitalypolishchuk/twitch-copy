import React from "react";

import HeaderVideos from "./HeaderVideos";
import LiveCategory from "./LiveCategory";

class Content extends React.Component {
  render() {
    return (
      <div>
        <HeaderVideos />
        <LiveCategory categoryHeader="Live channels we think you'll like" />
        <LiveCategory categoryHeader="Recommended streams" />
      </div>
    );
  }
}

export default Content;
