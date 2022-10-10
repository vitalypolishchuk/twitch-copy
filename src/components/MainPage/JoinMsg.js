import "../../styles/JoinMsg.css";
import React from "react";
import { connect } from "react-redux";
import { signIn } from "../../actions";

class JoinMsg extends React.Component {
  constructor(props) {
    super(props);
    this.joinMsgContainer = React.createRef();
  }
  componentDidUpdate() {
    if (this.props.isSignedIn) this.joinMsgContainer.current.classList.add("none");
    else if (!this.props.isSignedIn) this.joinMsgContainer.current.classList.remove("none");
  }
  onSignUp() {
    // add log in here
  }
  render() {
    return (
      <div ref={this.joinMsgContainer} className="join-msg-container">
        <div className="join-msg-center-container">
          <div className="img-and-message">
            <img alt="twitch logo" className="join-msg-img" src="https://static.twitchcdn.net/assets/coolcat-edacb6fbd813ce2f0272.png" />
            <h3 className="join-msg-header">
              Join the Twitch Community!
              <span className="additional-msg">Discover the best Livestreams anywhere.</span>
            </h3>
          </div>
          <button className="join-msg-btn generic-btn" onClick={this.onSignUp.bind(this)}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn })(JoinMsg);
