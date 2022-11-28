import "../../../../styles/StreamShow.css";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import flv from "flv.js";
import { fetchStream, fetchOneProfile, editProfile, fetchUserStreams, fetchProfiles } from "../../../../actions";

class StreamShow extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = { broadcasting: false, following: false, isMyChannel: false };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchStream(id);
    this.buildPlayer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.streams.oneStream !== this.props.streams.oneStream) {
      this.props.fetchOneProfile(this.props.streams.oneStream.userId);
    }
    if (Object.values(prevProps.profile.myProfile)[0] !== Object.values(this.props.profile.myProfile)[0]) {
      this.updateMyProfile();
      this.setState({ following: this.checkIfFollowing() });
    }
    if (prevProps.profile.oneProfile !== this.props.profile.oneProfile) {
      this.getStreamsInfo();
      this.updateMyProfile();
      this.setState({ following: this.checkIfFollowing() });
    }
    this.buildPlayer();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.player.destroy();
  }
  async updateMyProfile() {
    if (this.props.profile.myProfile.id === this.props.profile.oneProfile.id) {
      this.setState({ isMyChannel: true });
    }
  }
  async getStreamsInfo() {
    await this.props.fetchUserStreams(this.props.profile.oneProfile.userData.userId);
  }
  buildPlayer() {
    if (this.player || !this.props.streams.oneStream) {
      return;
    }

    const { id } = this.props.match.params;
    this.player = flv.createPlayer({
      type: "flv",
      url: `http://localhost:8000/live/${id}.flv`,
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();

    this.interval = setInterval(this.checkIfBroadcasting.bind(this), 3000);
  }
  checkIfBroadcasting() {
    if (this.player._receivedCanPlay) {
      clearInterval(this.interval);
      this.setState({ broadcasting: true });
    }
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
  async onFollowClick() {
    if (this.state.following) {
      const indexOfFollower = this.props.profile.oneProfile.userData.followers.indexOf(this.props.profile.myProfile.id);
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
  renderProfileInfo() {
    if (this.props.profile.oneProfile) {
      return (
        <div className="user-profile-info-container">
          <div className="user-profile-logo-profile-name">
            <Link to={"/" + this.props.profile.id}>
              <img className="user-profile-image" src={this.props.profile.oneProfile.userData?.userImageUrl} alt="profile" />
            </Link>
            <div>
              <h2 className="user-profile-name">
                {this.props.profile.oneProfile.userData?.userName} <FontAwesomeIcon icon={faCheck} className="user-profile-verified" />
              </h2>
              <h4 className="user-profile-followers">
                {this.displayFollowers.call(this, this.props.profile.oneProfile.userData?.followers?.length)}
              </h4>
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
      );
    }
    return <div></div>;
  }

  render() {
    return (
      <div className="show-stream-container">
        <video ref={this.videoRef} className="show-stream-video-player" controls />
        {this.renderProfileInfo.call(this)}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return { streams: state.streams, profile: state.profiles };
};

export default connect(mapStateToProps, { fetchStream, fetchOneProfile, editProfile, fetchUserStreams, fetchProfiles })(StreamShow);
