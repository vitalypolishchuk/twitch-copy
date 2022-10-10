import "../../../../styles/LiveStreams.css";
import React, { createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

class LiveStreams extends React.Component {
  constructor() {
    super();
    this.liveStreamsContainer = React.createRef();
    this.showMore = React.createRef();
    this.showLess = React.createRef();
    this.singleStreamContainer = React.createRef();

    this.state = { icon: "down", showMoreClicked: 0 };
  }
  componentDidMount() {
    this.showMoreOrLessStreams();
    window.addEventListener("resize", this.showMoreOrLessStreams.bind(this));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showMoreClicked !== this.state.showMoreClicked) {
      this.showMoreOrLessStreams();
    }
  }
  showMoreOrLessStreams() {
    const StreamsContainerChildren = this.liveStreamsContainer.current.children.length;
    const StreamsContainerWidth = parseInt(getComputedStyle(this.liveStreamsContainer.current).getPropertyValue("width"));
    const numStreamsOneLine = Math.floor(StreamsContainerWidth < 600 ? 2 : StreamsContainerWidth / (300 + 15));
    const newStreamsDisplay =
      this.state.showMoreClicked === 0 ? numStreamsOneLine : this.state.showMoreClicked * (numStreamsOneLine * 2) + numStreamsOneLine;

    if (newStreamsDisplay === numStreamsOneLine) {
      [...this.liveStreamsContainer.current.children].forEach((child, id) => {
        if (id < newStreamsDisplay) {
          child.classList.remove("none");
        } else {
          child.classList.add("none");
        }
      });
      this.showMore.current.classList.remove("none");
      this.showLess.current.classList.add("none");
    } else if (StreamsContainerChildren > newStreamsDisplay) {
      [...this.liveStreamsContainer.current.children].forEach((child, id) => {
        if (id < newStreamsDisplay) {
          child.classList.remove("none");
        }
      });
    } else {
      [...this.liveStreamsContainer.current.children].forEach((child, id) => {
        if (id < newStreamsDisplay) {
          child.classList.remove("none");
        }
      });
      this.showMore.current.classList.add("none");
      this.showLess.current.classList.remove("none");
    }
  }

  render() {
    return (
      <div className="generic-category live-streams-category-container">
        <h3 className="live-streams-msg">Recommended streams</h3>
        <div ref={this.liveStreamsContainer} className="live-streams-container">
          <div ref={this.singleStreamContainer} className="live-stream"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
          <div className="live-stream none"></div>
        </div>
        <div className="generic-split-line">
          <button
            ref={this.showMore}
            className="display-stream-btn"
            onClick={() => this.setState({ icon: "down", showMoreClicked: this.state.showMoreClicked + 1 })}
          >
            <div className="show-more">
              Show More <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </button>
          <button ref={this.showLess} className="display-stream-btn none" onClick={() => this.setState({ icon: "up", showMoreClicked: 0 })}>
            <div className="show-less">
              Show Less <FontAwesomeIcon icon={faChevronUp} />
            </div>
          </button>
        </div>
      </div>
    );
  }
}

export default LiveStreams;
