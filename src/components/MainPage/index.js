import "../../styles/MainPage.css";
import React from "react";
import { connect } from "react-redux";

import NavigationBar from "./NavigationBar";
import Channels from "./Channels";
import Streams from "./Content/Streams";
import JoinMsg from "./JoinMsg";

class MainPage extends React.Component {
  render() {
    return (
      <div className="main-page">
        <NavigationBar />
        <div className="channels-and-content">
          <Channels />
          <Streams />
        </div>
        <JoinMsg />
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps)(MainPage);
