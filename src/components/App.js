import "../styles/EnvironmentVars.css";
import "../styles/GenericStyles.css";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { fetchProfiles } from "../actions";

import NavigationBar from "./MainPage/NavigationBar";
import Channels from "./MainPage/Channels";
import Streams from "./MainPage/Content/Streams";
import NewStream from "./MainPage/Content/NewStream";
import StreamDelete from "./MainPage/Content/StreamDelete";
import StreamEdit from "./MainPage/Content/StreamEdit";
import JoinMsg from "./MainPage/JoinMsg";
import UserProfile from "./MainPage/Content/UserProfile/ProfilePage";
import ProfileEdit from "./MainPage/Content/UserProfile/ProfileEdit";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchProfiles();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.profiles.anyProfile.length !== this.props.profiles.anyProfile.length) {
      this.props.fetchProfiles();
    }
  }
  renderProfiles() {
    if (this.props.profiles.anyProfile.length === undefined) return <div></div>;

    return this.props.profiles.anyProfile.map((profile, index) => {
      return <Route path={`/${profile.id}`} key={index} exact component={UserProfile} />;
    });
  }
  render() {
    return (
      <div>
        <BrowserRouter>
          <NavigationBar />
          <div
            className="channels-and-content"
            style={
              this.props.isSignedIn
                ? { height: "calc(100vh - min(10vw, 50px)", outline: "1px solid green" }
                : { height: "calc(100vh - min(10vw, 50px) - min(12vw, 60px))", outline: "1px solid green" }
            }
          >
            <Channels />
            <div className="content">
              <Route path="/" exact component={Streams} />
              <Route path="/streams/create" exact component={NewStream} />
              <Route path="/streams/edit" exact component={StreamEdit} />
              <Route path="/streams/delete" exact component={StreamDelete} />
              {this.renderProfiles.call(this)}
              <Route path="/profile/edit" exact component={ProfileEdit} />
            </div>
          </div>
          <JoinMsg />
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return { isSignedIn: state.auth.isSignedIn, profiles: state.profiles };
};

export default connect(mapStateToProps, { fetchProfiles })(App);
