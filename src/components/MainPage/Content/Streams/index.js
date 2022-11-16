import React from "react";
import { connect } from "react-redux";

import { fetchStreams } from "../../../../actions";
import { deleteStream } from "../../../../actions";
import HeaderVideos from "./HeaderVideos";
import LiveCategory from "./LiveCategory";

class Content extends React.Component {
  deleteStream(id) {
    this.props.deleteStream(id);
  }
  componentDidMount() {
    // this.deleteStream.call(this, 10);
    this.props.fetchStreams();
  }
  render() {
    return (
      <div>
        <HeaderVideos />
        <LiveCategory categoryHeader="Live channels we think you'll like" content={this.props.streams} />
        <LiveCategory categoryHeader="Recommended streams" content={this.props.streams} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { streams: Object.values(state.streams.allStreams) };
};

export default connect(mapStateToProps, { fetchStreams, deleteStream })(Content);
