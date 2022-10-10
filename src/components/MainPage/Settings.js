import "../../styles/Settings.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSliders } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.settingsContainer = React.createRef();
    this.settingsProfileContainer = React.createRef();
    this.settingsList = React.createRef();
    this.logOutBtn = React.createRef();
  }
  componentDidMount() {
    document.addEventListener(
      "mousedown",
      function (event) {
        if (!this.settingsContainer.current.contains(event.target)) {
          this.settingsContainer.current.classList.add("hidden");
        }
      }.bind(this)
    );
  }
  onLogOut() {
    this.props.signOut();
  }
  handleClickToCloseSettings(event) {
    if (
      this.settingsProfileContainer.current.contains(event.target) ||
      this.settingsList.current.contains(event.target) ||
      this.logOutBtn.current.contains(event.target)
    ) {
      this.settingsContainer.current.classList.add("hidden");
    }
  }
  showOrHideSettings() {
    this.settingsContainer.current.classList.toggle("hidden");
  }
  render() {
    return (
      <div className={`${this.props.isSignedIn ? "" : "none"}`}>
        <div className="settings-logo">
          <div className="profile-image-container">
            <img
              onClick={this.showOrHideSettings.bind(this)}
              className="profile-image"
              src={this.props.userData?.userImageUrl ? this.props.userData?.userImageUrl : ""}
              alt="Profile"
            />
          </div>
        </div>
        <div ref={this.settingsContainer} className="settings-container hidden">
          <Link to="/" className="browser-link" onClick={this.handleClickToCloseSettings.bind(this)}>
            <div ref={this.settingsProfileContainer} className="settings-profile-container">
              <img
                className="settings-profile-image"
                src={this.props.userData?.userImageUrl ? this.props.userData?.userImageUrl : ""}
                alt="Profile"
              />
              <div className="settings-profile-info">
                <h4 className="settings-profile-name">{this.props.userData?.userName ? this.props.userData?.userName : ""}</h4>
                <h5 className="settings-profile-email">{this.props.userData?.userEmail ? this.props.userData?.userEmail : ""}</h5>
              </div>
            </div>
          </Link>
          <div ref={this.settingsList} className="settings-list" onClick={this.handleClickToCloseSettings.bind(this)}>
            <Link to="/streams/create" className="browser-link">
              <button className="new-stream-btn settings-list-item">
                <FontAwesomeIcon className="generic-icon settings-icons" icon={faCirclePlus} />
                <h4>Create stream</h4>
              </button>
            </Link>
            <Link to="/streams/edit" className="browser-link" onClick={this.handleClickToCloseSettings.bind(this)}>
              <button className="edit-stream-btn settings-list-item">
                <FontAwesomeIcon className="generic-icon settings-icons" icon={faSliders} />
                <h4>Edit stream</h4>
              </button>
            </Link>
          </div>
          <button ref={this.logOutBtn} onClick={this.onLogOut.bind(this)} className="logout generic-btn">
            Log Out
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn, userData: state.auth.userData };
};

export default connect(mapStateToProps, { signOut })(Settings);
