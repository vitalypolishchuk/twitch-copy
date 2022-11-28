import "../../styles/Channels.css";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProfiles } from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }
  componentDidMount() {
    window.addEventListener("resize", this.renderProfiles.bind(this));
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  reduceText(str, num) {
    if (str.length > num) str = str.substring(0, num) + "...";
    return str;
  }
  renderProfiles() {
    if (Object.keys(this.props.profiles).length !== 0) {
      let popularChannels = this.props.profiles.sort(function (a, b) {
        // console.log(a.userData.followers.length);
        return b.userData.followers.length - a.userData.followers.length;
      });

      if (popularChannels.length > 10) {
        popularChannels = popularChannels.filter((channel, id) => {
          return id < 10;
        });
      }
      const renderedChannels = popularChannels.map(({ userData }, id) => {
        if (window.innerWidth < 1200) {
          return (
            <Link key={id} to={`/${userData.userId}`} className="browser-link">
              <div key={id} className="channels-inner-container">
                <img src={userData.userImageUrl} className="channels-img"></img>
              </div>
            </Link>
          );
        } else {
          return (
            <Link key={id} to={`/${userData.userId}`} className="browser-link">
              <div className="channels-inner-container-2">
                <img src={userData.userImageUrl} className="channels-img-2"></img>
                <div className="channels-name-bio">
                  <h5 className="channels-name">{this.reduceText(userData.userName, 15)}</h5>
                  <h5 className="channels-bio">{this.reduceText(userData.bio, 20)}</h5>
                </div>
                <div className="channels-subscribers-num"></div>
              </div>
            </Link>
          );
        }
      });
      if (window.innerWidth < 1200) {
        return <div className="channels-container">{renderedChannels}</div>;
      } else {
        return (
          <div className="channels-container">
            <div className="channels-outer-container">
              <h5 className="popular-channels-text">POPULAR CHANNELS</h5>
              {renderedChannels}
              <div className="popular-channels-follow-favorites-outer">
                <div className="popular-channels-follow-favorites">
                  <div className="popular-channels-follow-favorites-inner">
                    <FontAwesomeIcon className="generic-icon popular-channels-icon" icon={faHeart} />
                    <FontAwesomeIcon className="generic-icon popular-channels-icon-2" icon={faHeart} />
                    <h3 className="popular-channels-follow-favorites-text">Follow your favorites!</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }
  render() {
    return <div className="channels">{this.renderProfiles.call(this)}</div>;
  }
}

const mapStateToProps = (state) => {
  return { profiles: state.profiles.anyProfile };
};

export default connect(mapStateToProps, { fetchProfiles })(Channels);
