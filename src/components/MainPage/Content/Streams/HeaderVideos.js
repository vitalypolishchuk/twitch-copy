import "../../../../styles/HeaderVideos.css";
import React, { createRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchAnyProfile, fetchStreams } from "../../../../actions";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import * as config from "../../../../config.js";

class HeaderVideos extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayVideoHeader: Math.floor(config.numHeaderVideos / 2) };
    this.leftArrowBtn = createRef();
    this.rightArrowBtn = createRef();
  }
  popularStreams() {
    const streamsArr = Object.values(this.props.streams.allStreams);
    streamsArr.sort((a, b) => b.likes - a.likes);
    return streamsArr;
  }
  displayInnerContainer() {
    if (Object.keys(this.props.streams.allStreams).length !== 0) {
      const streams = Object.values(this.props.streams.allStreams);
      const sortedStreams = this.popularStreams();

      const containers = [];
      for (let i = 0; i < config.numHeaderVideos; i++) {
        const streamId = streams.findIndex((stream) => {
          return stream === sortedStreams[i];
        });
        const styles = this.containerStyles.call(this, i);
        const singleContainer = (
          <div className={`inner-container inner-container-${i + 1}`} key={i} style={styles}>
            <Link to={`/streams/${streamId + 1}`} className="inner-container-video-player" style={{ height: "100" }}>
              <img className="inner-container-video-player-img" src={sortedStreams[i].thumbnail} />
            </Link>
          </div>
        );
        containers.push(singleContainer);
      }

      return containers;
    }
  }

  containerStyles(containerNum) {
    var zIndex;
    var height;
    var left;
    var display;
    if (containerNum === this.state.displayVideoHeader) {
      zIndex = "3";
      height = "100%";
      left = "0";
    } else {
      zIndex = 2 - Math.abs(containerNum - 2);
      height = 100 - 20 * Math.abs(containerNum - this.state.displayVideoHeader) + "%";
      display = Math.abs(containerNum - this.state.displayVideoHeader) > 2 ? "none" : "block";
      left = 7 * (containerNum - this.state.displayVideoHeader) + "%";
    }
    return { zIndex: zIndex, height: height, left: left, display: display, transition: "0.3s linear all" };
  }
  onLeftArrowClick() {
    if (this.state.displayVideoHeader === 0) return;
    this.setState({ displayVideoHeader: this.state.displayVideoHeader - 1 });
    if (this.state.displayVideoHeader === 0) this.leftArrowBtn.current.style.display = "none";
  }
  onRightArrowClick() {
    this.leftArrowBtn.current.style.display = "inline-block";
    if (this.state.displayVideoHeader === config.numHeaderVideos - 1) return;
    this.setState({ displayVideoHeader: this.state.displayVideoHeader + 1 });
  }
  componentDidUpdate() {
    if (this.state.displayVideoHeader === 0) {
      this.leftArrowBtn.current.style.display = "none";
    } else if (this.state.displayVideoHeader === config.numHeaderVideos - 1) {
      this.rightArrowBtn.current.style.display = "none";
    } else {
      this.leftArrowBtn.current.style.display = "inline-block";
      this.rightArrowBtn.current.style.display = "inline-block";
    }
  }

  render() {
    return (
      <div className="outer-container">
        <FontAwesomeIcon
          ref={this.leftArrowBtn}
          onClick={this.onLeftArrowClick.bind(this, "left")}
          className="header-videos-arrow arrow-left"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          ref={this.rightArrowBtn}
          onClick={this.onRightArrowClick.bind(this, "right")}
          className="header-videos-arrow arrow-right"
          icon={faAngleRight}
        />
        <div className="header-videos-container">{this.displayInnerContainer()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { profiles: state.profiles, streams: state.streams };
};

export default connect(mapStateToProps, { fetchAnyProfile })(HeaderVideos);
