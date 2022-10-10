import "../../../../styles/LiveCategory.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

class LiveCategory extends React.Component {
  constructor() {
    super();
    this.liveCategoryContainer = React.createRef();
    this.showMore = React.createRef();
    this.showLess = React.createRef();
    this.singleElementContainer = React.createRef();

    this.state = { icon: "down", showMoreClicked: 0 };
  }
  componentDidMount() {
    this.showMoreOrLessElements();
    window.addEventListener("resize", this.showMoreOrLessElements.bind(this));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showMoreClicked !== this.state.showMoreClicked) {
      this.showMoreOrLessElements();
    }
  }
  showMoreOrLessElements() {
    const elementsContainerChildren = this.liveCategoryContainer.current.children.length;
    const elementsContainerWidth = parseInt(getComputedStyle(this.liveCategoryContainer.current).getPropertyValue("width"));
    const numElementsOneLine = Math.floor(elementsContainerWidth < 600 ? 2 : elementsContainerWidth / (240 + 11));
    const newElementsDisplay =
      this.state.showMoreClicked === 0 ? numElementsOneLine : this.state.showMoreClicked * (numElementsOneLine * 2) + numElementsOneLine;

    if (newElementsDisplay === numElementsOneLine) {
      [...this.liveCategoryContainer.current.children].forEach((child, id) => {
        if (id < newElementsDisplay) {
          child.classList.remove("none");
        } else {
          child.classList.add("none");
        }
      });
      this.showMore.current.classList.remove("none");
      this.showLess.current.classList.add("none");
    } else if (elementsContainerChildren > newElementsDisplay) {
      [...this.liveCategoryContainer.current.children].forEach((child, id) => {
        if (id < newElementsDisplay) {
          child.classList.remove("none");
        }
      });
    } else {
      [...this.liveCategoryContainer.current.children].forEach((child, id) => {
        if (id < newElementsDisplay) {
          child.classList.remove("none");
        }
      });
      this.showMore.current.classList.add("none");
      this.showLess.current.classList.remove("none");
    }
  }

  render() {
    return (
      <div className="generic-category live-elements-category-container">
        <h3 className="section-msg">{this.props.categoryHeader}</h3>
        <div ref={this.liveCategoryContainer} className="live-elements-container">
          <div ref={this.singleElementContainer} className="live-element"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
          <div className="live-element none"></div>
        </div>
        <div className="generic-split-line">
          <button
            ref={this.showMore}
            className="display-elements-btn"
            onClick={() => this.setState({ icon: "down", showMoreClicked: this.state.showMoreClicked + 1 })}
          >
            <div className="show-more">
              Show More <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </button>
          <button ref={this.showLess} className="display-elements-btn none" onClick={() => this.setState({ icon: "up", showMoreClicked: 0 })}>
            <div className="show-less">
              Show Less <FontAwesomeIcon icon={faChevronUp} />
            </div>
          </button>
        </div>
      </div>
    );
  }
}

export default LiveCategory;
