import "../styles/GoogleAuth.css";
import React from "react";
import { connect } from "react-redux";
import {
  signIn,
  signOut,
  fetchMyProfile,
  fetchProfilesIds,
  fetchAnyProfile,
  createProfile,
  fetchProfiles,
  createId,
  logOutProfile,
} from "../actions";

class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", async () => {
      await window.gapi.client.init({
        clientId: "840461133840-b1hk498kltr2naet2dqtkbd3357uhcil.apps.googleusercontent.com",
        scope: "email",
        plugin_name: "twitch_stream",
      });
      this.auth = window.gapi.auth2.getAuthInstance();
      this.onAuthChange(this.auth.isSignedIn.get());
      this.auth.isSignedIn.listen(this.onAuthChange.bind(this));
    });
  }
  componentDidUpdate() {
    if (this.props.isSignedIn === false) this.onSignOutClick();
  }
  async fetchIds() {
    await this.props.fetchProfilesIds();
    const ids = this.props.profiles.profilesIds.map(({ userId }) => {
      return userId;
    });
    await this.props.fetchAnyProfile(ids);
  }
  async checkUserProfile(userData) {
    await this.props.fetchProfilesIds();
    const profilesIds = this.props.profiles.profilesIds;
    for (const idObj of profilesIds) {
      if (userData.userId === idObj.userId) {
        this.props.fetchMyProfile(userData.userId);
        return;
      }
    }
    await createProfile({ id: userData.userId, userData });
    await createId({ userId: userData.userId });
    await this.props.fetchMyProfile(userData.userId);
    await this.props.fetchProfiles();
  }
  onAuthChange(isSignedIn) {
    if (isSignedIn) {
      const userData = {
        userId: this.auth.currentUser.get().getBasicProfile().getId(),
        userName: this.auth.currentUser.get().getBasicProfile().getName(),
        userImageUrl: this.auth.currentUser.get().getBasicProfile().getImageUrl(),
        userEmail: this.auth.currentUser.get().getBasicProfile().getEmail(),
      };
      // const userData = {
      //   userId: "109188102515895788739",
      //   userName: "Vitaly",
      //   userImageUrl: "https://lh3.googleusercontent.com/a-/ACNPEu9G7J3HYjbpaRlS0IULi0kF8MoZfIRAHBtSl-JyLw=s96-c",
      //   userEmail: "vetal.polishuk@gmail.com",
      // };
      userData.bio = "";
      userData.followers = [];
      userData.socialLinks = [];
      this.checkUserProfile.call(this, userData);
      this.props.signIn(userData);
    } else {
      this.props.logOutProfile();
      this.props.signOut();
    }
  }

  onSignInClick() {
    this.auth.signIn();
  }

  onSignOutClick() {
    this.auth.signOut();
  }

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return (
        <div>
          <button className="login generic-btn">Waiting</button>
          <button className="signup generic-btn">Waiting</button>
        </div>
      );
    } else if (this.props.isSignedIn) {
      return "";
    } else {
      return (
        <div>
          <button onClick={this.onSignInClick.bind(this)} className="login dark-white-btn generic-btn">
            Log In
          </button>
          <button onClick={this.onSignInClick.bind(this)} className="main-color-btn generic-btn">
            Sign Up
          </button>
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn, userData: state.auth.userData, profiles: state.profiles };
};

export default connect(mapStateToProps, { signIn, signOut, fetchMyProfile, fetchProfilesIds, fetchAnyProfile, fetchProfiles, logOutProfile })(
  GoogleAuth
);
