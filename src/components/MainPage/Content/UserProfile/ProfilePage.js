import "../../../../styles/ProfilePage.css";
import React, { createRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { fetchUserStreams, editProfile, fetchProfiles, fetchOneProfile, fetchMyProfile } from "../../../../actions";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.userVideosContainer = createRef();
    this.userVideosContainer2 = createRef();
    this.state = { clicks: 0, clicks2: 0, moreClicks: true, following: false, isMyChannel: false };
    this.arrowRight = createRef();
    this.arrowLeft = createRef();
    this.arrowRight2 = createRef();
    this.arrowLeft2 = createRef();
  }
  componentDidMount() {
    this.updateUserProfile();
    this.stylesForVideosList.call(this);
    window.addEventListener("resize", this.stylesForVideosList.bind(this));
    this.stylesForVideosList2.call(this);
    window.addEventListener("resize", this.stylesForVideosList2.bind(this));
    if (this.userVideosContainer.current) {
      this.userVideosContainer.current.addEventListener("transitionend", this.onTransition.bind(this));
    }
    if (this.userVideosContainer2.current) {
      this.userVideosContainer2.current.addEventListener("transitionend", this.onTransition2.bind(this));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (Object.values(prevProps.profile.myProfile)[0] !== Object.values(this.props.profile.myProfile)[0]) {
      this.updateMyProfile();
      this.setState({ following: this.checkIfFollowing() });
    }
    if (prevProps.profile.oneProfile !== this.props.profile.oneProfile) {
      this.getStreamsInfo();
      this.updateMyProfile();
      this.setState({ following: this.checkIfFollowing() });
    }
    if (prevState.clicks < this.state.clicks) {
      this.stylesForVideosList("right");
    } else if (prevState.clicks > this.state.clicks) {
      this.stylesForVideosList("left");
    } else if (prevState.clicks === this.state.clicks) {
      this.stylesForVideosList();
    }
    if (prevState.clicks2 < this.state.clicks2) {
      this.stylesForVideosList2("right");
    } else if (prevState.clicks2 > this.state.clicks2) {
      this.stylesForVideosList2("left");
    } else if (prevState.clicks2 === this.state.clicks2) {
      this.stylesForVideosList2();
    }
  }
  async updateUserProfile() {
    const id = window.location.pathname;
    const newId = id.split("/")[1];
    await this.props.fetchOneProfile(newId);
  }
  async updateMyProfile() {
    if (this.props.profile.myProfile.id === this.props.profile.oneProfile.id) {
      this.setState({ isMyChannel: true });
    }
  }
  async getStreamsInfo() {
    await this.props.fetchUserStreams(this.props.profile.oneProfile.userData.userId);
  }
  // checkIfMyChannel() {
  //   console.log(this.props.profile.myProfile.id, this.props.profile.oneProfile.id);
  //   return this.props.profile.myProfile.id === this.props.profile.oneProfile.id;
  // }
  reduceTitle(str) {
    if (str.length > 53) str = str.substring(0, 50) + "...";
    return str;
  }
  displayFollowers(num, digits = 1) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    if (num === 0) return "no followers";
    // if (item === "0") return "no followers yet";
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol + " followers" : "0";
  }
  checkIfFollowing() {
    if (this.props.profile.myProfile && this.props.profile.oneProfile.userData?.followers?.length) {
      const follower = this.props.profile.oneProfile.userData.followers.find((accId) => {
        return accId === this.props.profile.myProfile.userData?.userId;
      });
      if (follower) return true;
      return false;
    } else {
      return false;
    }
  }
  async onFollowClick() {
    if (this.state.following) {
      const indexOfFollower = this.props.profile.oneProfile.userData.followers.indexOf(this.props.profile.myProfile.id);
      console.log(indexOfFollower);
      if (indexOfFollower > -1) {
        // only splice array when item is found
        this.props.profile.oneProfile.userData.followers.splice(indexOfFollower, 1); // 2nd parameter means remove one item only
        const editedProfile = { id: this.props.profile.oneProfile.userData.userId, userData: this.props.profile.oneProfile.userData };
        await editProfile(this.props.profile.oneProfile.userData.userId, editedProfile);
        this.setState({ following: this.checkIfFollowing.call(this) });
        await this.props.fetchProfiles();
      }
    } else {
      await this.props.fetchOneProfile(this.props.profile.oneProfile.userData.userId);
      const editedProfile = { id: this.props.profile.oneProfile.userData.userId, userData: this.props.profile.oneProfile.userData };
      editedProfile.userData.followers.push(this.props.profile.myProfile.id);
      await editProfile(this.props.profile.oneProfile.userData.userId, editedProfile);
      await this.props.fetchProfiles();
      this.setState({ following: this.checkIfFollowing.call(this) });
    }
  }
  recentStreams() {
    if (this.props.userStreams.length) {
      const streams = [];
      const sortedStreams = [];
      for (const stream of this.props.userStreams) {
        streams.push({ date: new Date(stream.date), stream: stream });
      }
      streams.sort((a, b) => b.date - a.date);
      for (const stream of streams) {
        sortedStreams.push(stream.stream);
      }
      return this.renderList.call(this, sortedStreams);
    }
  }
  popularStreams() {
    if (this.props.userStreams.length) {
      const streams = [];
      const sortedStreams = [];
      for (const stream of this.props.userStreams) {
        sortedStreams.push(stream);
      }
      sortedStreams.sort((a, b) => b.likes - a.likes);

      return this.renderList.call(this, sortedStreams);
    }
  }
  onTransition() {
    const sizeOfContainer = parseInt(getComputedStyle(this.userVideosContainer.current).getPropertyValue("width"));
    const allChildren = [...this.userVideosContainer.current.children];
    const numOfChildren = allChildren.length;
    const lastChild = allChildren[numOfChildren - 1];

    const firstChild = allChildren[0];

    const lastChildLeft = parseInt(getComputedStyle(lastChild).getPropertyValue("left"));
    // <= size of the parent
    // if last child is displayed, do not display right arrow
    if (lastChildLeft >= 0 && lastChildLeft <= sizeOfContainer) {
      this.arrowRight.current.style.display = "none";
      // this.setState({ clicks: 0 });
    } else {
      this.arrowRight.current.style.display = "inline-block";
    }

    const firstchildLeft = parseInt(getComputedStyle(firstChild).getPropertyValue("left"));
    // if first child is displayed, do not display left arrow
    if (firstchildLeft >= 0 && firstchildLeft <= sizeOfContainer) {
      this.arrowLeft.current.style.display = "none";
      this.setState({ clicks: 0 });
    } else {
      this.arrowLeft.current.style.display = "inline-block";
    }
  }
  onTransition2() {
    const sizeOfContainer = parseInt(getComputedStyle(this.userVideosContainer2.current).getPropertyValue("width"));
    const allChildren = [...this.userVideosContainer2.current.children];
    const numOfChildren = allChildren.length;
    const lastChild = allChildren[numOfChildren - 1];

    const firstChild = allChildren[0];

    const lastChildLeft = parseInt(getComputedStyle(lastChild).getPropertyValue("left"));
    // <= size of the parent
    // if last child is displayed, do not display right arrow
    if (lastChildLeft >= 0 && lastChildLeft <= sizeOfContainer) {
      this.arrowRight2.current.style.display = "none";
      // this.setState({ clicks: 0 });
    } else {
      this.arrowRight2.current.style.display = "inline-block";
    }

    const firstchildLeft = parseInt(getComputedStyle(firstChild).getPropertyValue("left"));
    // if first child is displayed, do not display left arrow
    if (firstchildLeft >= 0 && firstchildLeft <= sizeOfContainer) {
      this.arrowLeft2.current.style.display = "none";
      this.setState({ clicks2: 0 });
    } else {
      this.arrowLeft2.current.style.display = "inline-block";
    }
  }
  stylesForVideosList(clickHappened = false) {
    // console.log(this.state.clicks);
    if (this.userVideosContainer.current) {
      const allChildren = [...this.userVideosContainer.current.children];
      const numOfChildren = allChildren.length;
      const lastChild = allChildren[numOfChildren - 1];

      const firstChild = allChildren[0];

      // clicks === 0
      if (this.state.clicks === 0) {
        [...this.userVideosContainer.current.children].forEach((child, id) => {
          if (window.innerWidth < 600) {
            child.style.width = "45%";
            child.style.left = 55 * id - this.state.clicks * 110 + "%";
          } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
            child.style.width = "30%";
            child.style.left = 35 * id - this.state.clicks * 105 + "%";
          } else if (window.innerWidth >= 900) {
            child.style.width = "22%";
            child.style.left = 26 * id - this.state.clicks * 104 + "%";
          }
        });
        return;
      } else {
        let leftDisplayedChildId = undefined;
        [...this.userVideosContainer.current.children].forEach((child, id) => {
          const ChildLeft = parseInt(getComputedStyle(child).getPropertyValue("left"));
          if (ChildLeft === 0) leftDisplayedChildId = id;
        });
        if (clickHappened === "right") {
          if (lastChild) {
            // move to the right
            if (window.innerWidth < 600) {
              leftDisplayedChildId += 2;
            } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
              leftDisplayedChildId += 3;
            } else if (window.innerWidth >= 900) {
              leftDisplayedChildId += 4;
            }
          }
        }

        if (clickHappened === "left") {
          if (firstChild) {
            // move to the right
            if (window.innerWidth < 600) {
              leftDisplayedChildId -= 2;
            } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
              leftDisplayedChildId -= 3;
            } else if (window.innerWidth >= 900) {
              leftDisplayedChildId -= 4;
            }
          }
        }

        // Regardless of the clicking
        [...this.userVideosContainer.current.children].forEach((child, id) => {
          if (window.innerWidth < 600) {
            child.style.width = "45%";
            // console.log(getComputedStyle(child).getPropertyValue("left"));
            child.style.left = (id - leftDisplayedChildId) * 55 + "%";
            // console.log("should be", (id - leftDisplayedChildId) * 55 + "%");
            // console.log(child);
          } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
            child.style.width = "30%";
            child.style.left = (id - leftDisplayedChildId) * 35 + "%";
          } else if (window.innerWidth >= 900) {
            child.style.width = "22%";
            child.style.left = (id - leftDisplayedChildId) * 26 + "%";
          }
        });
      }
    }
  }
  stylesForVideosList2(clickHappened = false) {
    // console.log(this.state.clicks);
    if (this.userVideosContainer2.current) {
      const allChildren = [...this.userVideosContainer2.current.children];
      const numOfChildren = allChildren.length;
      const lastChild = allChildren[numOfChildren - 1];

      const firstChild = allChildren[0];

      // clicks === 0
      if (this.state.clicks2 === 0) {
        [...this.userVideosContainer2.current.children].forEach((child, id) => {
          if (window.innerWidth < 600) {
            child.style.width = "45%";
            child.style.left = 55 * id - this.state.clicks2 * 110 + "%";
          } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
            child.style.width = "30%";
            child.style.left = 35 * id - this.state.clicks2 * 105 + "%";
          } else if (window.innerWidth >= 900) {
            child.style.width = "22%";
            child.style.left = 26 * id - this.state.clicks2 * 104 + "%";
          }
        });
        return;
      } else {
        let leftDisplayedChildId = undefined;
        [...this.userVideosContainer2.current.children].forEach((child, id) => {
          const ChildLeft = parseInt(getComputedStyle(child).getPropertyValue("left"));
          if (ChildLeft === 0) leftDisplayedChildId = id;
        });
        if (clickHappened === "right") {
          if (lastChild) {
            // move to the right
            if (window.innerWidth < 600) {
              leftDisplayedChildId += 2;
            } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
              leftDisplayedChildId += 3;
            } else if (window.innerWidth >= 900) {
              leftDisplayedChildId += 4;
            }
          }
        }

        if (clickHappened === "left") {
          if (firstChild) {
            // move to the right
            if (window.innerWidth < 600) {
              leftDisplayedChildId -= 2;
            } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
              leftDisplayedChildId -= 3;
            } else if (window.innerWidth >= 900) {
              leftDisplayedChildId -= 4;
            }
          }
        }

        // Regardless of the clicking
        [...this.userVideosContainer2.current.children].forEach((child, id) => {
          if (window.innerWidth < 600) {
            child.style.width = "45%";
            // console.log(getComputedStyle(child).getPropertyValue("left"));
            child.style.left = (id - leftDisplayedChildId) * 55 + "%";
            // console.log("should be", (id - leftDisplayedChildId) * 55 + "%");
            // console.log(child);
          } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
            child.style.width = "30%";
            child.style.left = (id - leftDisplayedChildId) * 35 + "%";
          } else if (window.innerWidth >= 900) {
            child.style.width = "22%";
            child.style.left = (id - leftDisplayedChildId) * 26 + "%";
          }
        });
      }
    }
  }
  getDomainName(url) {
    const linkURL = new URL(url);
    return linkURL.hostname;
  }
  renderSocialLinks() {
    if (Object.keys(this.props.profile.oneProfile).length !== 0) {
      const renderedSocialLinks = this.props.profile.oneProfile.userData.socialLinks.map(({ linkURL, linkTitle }, id) => {
        const linkURLDomain = this.getDomainName(linkURL);
        return (
          <a href={linkURL} target="_blank" rel="noopener noreferrer" className="user-profile-link browser-link" key={id}>
            <div className="user-profile-link-center">
              <img className="user-profile-link-img" src={"https://s2.googleusercontent.com/s2/favicons?domain=" + linkURLDomain} alt="linkImg" />
              <h5 className="user-profile-link-name">{linkTitle}</h5>
            </div>
          </a>
        );
      });
      return renderedSocialLinks;
    }
    return (
      <div>
        <div className="user-profile-link">
          <div className="user-profile-link-center">
            <img className="user-profile-link-img" src="https://s2.googleusercontent.com/s2/favicons?domain=www.facebook.com" alt="img" />
            <h5 className="user-profile-link-name">Facebook</h5>
          </div>
        </div>
        <div className="user-profile-link">
          <div className="user-profile-link-center">
            <img className="user-profile-link-img" src="https://s2.googleusercontent.com/s2/favicons?domain=www.instagram.com" alt="img" />
            <h5 className="user-profile-link-name">Instagram</h5>
          </div>
        </div>
        <div className="user-profile-link">
          <div className="user-profile-link-center">
            <img className="user-profile-link-img" src="https://s2.googleusercontent.com/s2/favicons?domain=www.instagram.com" alt="img" />
            <h5 className="user-profile-link-name">Instagram</h5>
          </div>
        </div>
        <div className="user-profile-link">
          <div className="user-profile-link-center">
            <img className="user-profile-link-img" src="https://s2.googleusercontent.com/s2/favicons?domain=www.instagram.com" alt="img" />
            <h5 className="user-profile-link-name">Instagram</h5>
          </div>
        </div>
        <div className="user-profile-link">
          <div className="user-profile-link-center">
            <img className="user-profile-link-img" src="https://s2.googleusercontent.com/s2/favicons?domain=www.instagram.com" alt="img" />
            <h5 className="user-profile-link-name">Instagram</h5>
          </div>
        </div>
      </div>
    );
  }
  renderList(streams) {
    return streams.map((stream) => {
      const titleReduced = this.reduceTitle.call(this, stream.title);
      return (
        <div className="user-profile-video" key={stream.id}>
          <div className="live-element-inner-container">
            <div className="live-thumbnail-container">
              <img className="live-thumbnail" src={stream.thumbnail} alt="profile" />
            </div>
            <div className="live-element-info-container">
              <div className="live-element-channel_img-name">
                <Link to={`/${stream.userId}`} className="live-element-img-link">
                  <img
                    className="live-element-profile-image"
                    src={`${this.props.profile.oneProfile.userData.userImageUrl ?? "https://imgur.com/a/iAYBNnL"}`}
                    alt="Profile"
                  />
                </Link>
                <div className="live-element-profile-info">
                  <h4 className="user-stream-element-title">{titleReduced}</h4>
                  <Link to={`/${stream.userId}`} className="live-element-link-profile-name">
                    <h5 className="live-element-profile-name">{`${this.props.profile.oneProfile.userData.userName ?? "waiting"}`}</h5>
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
      <div className="user-profile-main-container">
        <div className="user-profile-info-container">
          <div className="user-profile-logo-profile-name">
            <Link to={`/${window.location.pathname.split("/")[1]}`}>
              <img className="user-profile-image" src={this.props.profile.oneProfile.userData?.userImageUrl} alt="profile" />
            </Link>
            <div>
              <h2 className="user-profile-name">
                {this.props.profile.oneProfile.userData?.userName} <FontAwesomeIcon icon={faCheck} className="user-profile-verified" />
              </h2>
              <h4 className="user-profile-followers">{this.displayFollowers.call(this, this.props.profile.oneProfile.userData?.followers.length)}</h4>
            </div>
          </div>
          <button
            onClick={this.onFollowClick.bind(this)}
            className={`user-profile-follow-btn generic-btn main-color-btn ${this.state.isMyChannel ? "none" : ""}`}
          >
            <FontAwesomeIcon icon={faHeart} className={this.state.following ? "none" : ""} />
            {this.state.following ? "Unfollow" : " Follow"}
          </button>
        </div>
        <div className={`user-profile-edit-channel ${this.state.isMyChannel ? "" : "none"}`}>
          <div className="user-profile-edit-channel-center">
            <span className="user-profile-texts">
              <span className="user-profile-edit-text"> Customize your channel </span>
              <span className="user-profile-edit-text-2">
                Update your stream schedule, add your social links, and manage your channel preferences
              </span>
            </span>
            <Link to="profile/edit" className="live-element-img-link">
              <button className={`user-profile-edit-btn generic-btn main-color-btn ${this.state.isMyChannel ? "" : "none"}`}>Edit</button>
            </Link>
          </div>
        </div>
        <div className="user-profile-bio-container">
          <div className="user-profile-bio-container-center">
            <div className="user-profile-bio-about-container">
              <h3 className="user-profile-bio-about-header">{`About ${this.props.profile.oneProfile.userData?.userName}`}</h3>
              <p className={this.props.profile.oneProfile.userData?.bio ? "user-profile-bio-about-text" : "none"}>
                {this.props.profile.oneProfile.userData?.bio}
              </p>
              <p className={this.props.profile.oneProfile.userData?.bio ? "none" : "user-profile-bio-about-text-none"}>
                {`We don't know much about them, but we're sure ${this.props.profile.oneProfile.userData?.userName} is great.`}
              </p>
            </div>
            <div className="user-profile-bio-links-container"> {this.renderSocialLinks.call(this)}</div>
          </div>
        </div>
        <div className={this.props.userStreams.length ? "none" : "user-profile-no-videos-title-container"}>
          <h4 className="user-profile-no-videos-title">Looks like you don't have any videos yet...</h4>
          <p className="user-profile-no-videos-subtitle">Start streaming so you can customize this page with your content.</p>
          <p className="user-profile-no-videos-subtitle">Videos are a great way to engage with your audience when you're not live!</p>
        </div>
        <h4 className={this.props.userStreams.length ? `user-profile-recent-broadcast-title` : "none"}>Recent Broadcast</h4>
        <div className={this.props.userStreams.length ? `user-profile-videos-outer-container` : "none"}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={`user-profile-videos-arrow user-profile-videos-arrow-left ${this.state.clicks === 0 ? "none" : ""}`}
            ref={this.arrowLeft}
            onClick={() => {
              if (this.state.clicks === 0) return;
              this.setState({ clicks: this.state.clicks - 1 });
            }}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            className="user-profile-videos-arrow user-profile-videos-arrow-right"
            ref={this.arrowRight}
            onClick={() => {
              this.setState({ clicks: this.state.clicks + 1 });
            }}
          />
          <div className="user-profile-videos-container" ref={this.userVideosContainer}>
            {this.recentStreams.call(this)};
          </div>
        </div>
        <h4 className={this.props.userStreams.length ? `user-profile-recent-broadcast-title` : "none"}>Popular Streams</h4>
        <div className={this.props.userStreams.length ? `user-profile-videos-outer-container` : "none"}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={`user-profile-videos-arrow user-profile-videos-arrow-left ${this.state.clicks2 === 0 ? "none" : ""}`}
            ref={this.arrowLeft2}
            onClick={() => {
              if (this.state.clicks2 === 0) return;
              this.setState({ clicks2: this.state.clicks2 - 1 });
            }}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            className="user-profile-videos-arrow user-profile-videos-arrow-right"
            ref={this.arrowRight2}
            onClick={() => {
              this.setState({ clicks2: this.state.clicks2 + 1 });
            }}
          />
          <div className="user-profile-videos-container" ref={this.userVideosContainer2}>
            {this.popularStreams.call(this)};
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { profile: state.profiles, userStreams: state.streams.userStreams, profilesIds: state.profiles.profilesIds };
};

export default connect(mapStateToProps, { fetchUserStreams, fetchProfiles, fetchOneProfile, fetchMyProfile })(Profile);
