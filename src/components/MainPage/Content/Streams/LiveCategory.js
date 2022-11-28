import "../../../../styles/LiveCategory.css";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAnyProfile } from "../../../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

class LiveCategory extends React.Component {
  constructor() {
    super();
    this.liveCategoryContainer = React.createRef();
    this.showMore = React.createRef();
    this.showLess = React.createRef();

    this.state = { icon: "down", showMoreClicked: 0, renderContent: true };
  }
  componentDidMount() {
    // this.getChannelsInfo.call(this);
    // this.showMoreOrLessElements();
    window.addEventListener("resize", this.showMoreOrLessElements.bind(this));
  }
  componentDidUpdate(prevProps, prevState) {
    this.showMoreOrLessElements();
    if (Object.keys(prevProps.content).length !== Object.keys(this.props.content).length) {
      this.getChannelsInfo.call(this);
    }
  }
  reduceTitle(str) {
    if (str.length > 53) str = str.substring(0, 50) + "...";
    return str;
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
  async getChannelsInfo() {
    const selectedIds = {};
    const ids = this.props.content.map((item) => {
      return item.userId;
    });
    ids.filter((id) => {
      if (id !== selectedIds.userId) {
        selectedIds[`${id}`] = id;
        return id;
      }
    });
    const selectedIdsArray = Object.keys(selectedIds);
    this.props.fetchAnyProfile(selectedIdsArray);
  }
  getChannelInfo(id) {
    if (Array.isArray(this.props.profileInfo)) {
      return this.props.profileInfo.find((profile) => {
        return id === profile.id;
      });
    }
  }
  renderList() {
    return this.props.content.map((item) => {
      const profileInfo = this.getChannelInfo.call(this, item.userId);
      const titleReduced = this.reduceTitle.call(this, item.title);
      return (
        <div className="live-element" key={item.id}>
          <div className="live-element-inner-container">
            <Link to={`streams/${item.id}`} className="live-thumbnail-container">
              <img className="live-thumbnail" src={item.thumbnail} />
            </Link>
            <div className="live-element-info-container">
              <div className="live-element-channel_img-name">
                <Link to={`/${item.userId}`} className="live-element-img-link">
                  <img
                    className="live-element-profile-image"
                    src={`${profileInfo?.userData.userImageUrl ?? "https://imgur.com/a/iAYBNnL"}`}
                    alt="Profile"
                  />
                </Link>
                <div className="live-element-profile-info">
                  <h4 className="live-element-title">{titleReduced}</h4>
                  <Link to={`/${item.userId}`} className="live-element-link-profile-name">
                    <h5 className="live-element-profile-name">{`${profileInfo?.userData.userName ?? "waiting"}`}</h5>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="generic-category live-elements-category-container">
        <h3 className="section-msg">{this.props.categoryHeader}</h3>
        <div ref={this.liveCategoryContainer} className="live-elements-container">
          {this.renderList.call(this)}
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

const mapStateToProps = (state) => {
  return { profileInfo: state.profiles.anyProfile };
};

export default connect(mapStateToProps, { fetchAnyProfile })(LiveCategory);
