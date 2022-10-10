import "../../../../styles/HeaderVideos.css";
import React, { createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import * as config from "../../../../config.js";

class HeaderVideos extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayVideoHeader: Math.floor(config.numHeaderVideos / 2) };
    this.leftArrowBtn = createRef();
    this.rightArrowBtn = createRef();
  }

  displayInnerContainer() {
    const containers = [];
    for (let i = 0; i < config.numHeaderVideos; i++) {
      const styles = this.containerStyles.call(this, i);
      const singleContainer = (
        <div className={`inner-container inner-container-${i + 1}`} key={i} style={styles}>
          container {i}
        </div>
      );
      containers.push(singleContainer);
    }

    return containers;
  }

  containerStyles(containerNum) {
    var zIndex;
    var height;
    var left;
    var display;
    if (containerNum === this.state.displayVideoHeader) {
      zIndex = "1";
      height = "100%";
      left = "0";
    } else {
      zIndex = "0";
      height = 100 - 20 * Math.abs(containerNum - this.state.displayVideoHeader) + "%";
      display = Math.abs(containerNum - this.state.displayVideoHeader) > 2 ? "none" : "block";
      left = 7 * (containerNum - this.state.displayVideoHeader) + "%";
    }
    return { zIndex: zIndex, height: height, left: left, display: display };
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
      console.log("here");
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

export default HeaderVideos;
