import "../../styles/JoinMsg.css";
import React from "react";

class JoinMsg extends React.Component {
  render() {
    return (
      <div className="join-msg-container">
        <div className="join-msg-center-container">
          <div className="img-and-message">
            <img alt="twitch logo" className="join-msg-img" src="https://static.twitchcdn.net/assets/coolcat-edacb6fbd813ce2f0272.png" />
            <h3 className="join-msg-header">
              Join the Twitch Community!
              <span className="additional-msg">Discover the best Livestreams anywhere.</span>
            </h3>
          </div>
          <button className="join-msg-btn generic-btn">Sign Up</button>
        </div>
      </div>
    );
  }
}

export default JoinMsg;
