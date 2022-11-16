import "../../../../styles/ProfileEdit.css";
import React from "react";
import { Field, formValues, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { fetchMyProfile, editMyProfile, fetchProfiles } from "../../../../actions";
import ProfileEditLinks from "./ProfileEditLinks";

class ProfileAddLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { linkAdded: false };
  }
  renderInputLink(formProps) {
    return (
      <div>
        <div className="label_input">
          <textarea
            autoComplete="off"
            maxLength={formProps.maxLength ?? "524288"}
            className="generic-input add-stream-input"
            onChange={formProps.input.onChange}
            value={formProps.input.value}
            placeholder={formProps.placeholder}
            style={{
              height: `${formProps.height}`,
              backgroundColor: `${
                formProps.meta.touched && formProps.meta.error
                  ? "rgb(255, 223, 223)"
                  : getComputedStyle(document.documentElement).getPropertyValue("--dark-white")
              }`,
            }}
          />
          <p className={formProps.maxLength ? "generic-input-length new-stream-input-length" : "none"}>
            {formProps.input.value.length}/{formProps.maxLength}
          </p>
        </div>
      </div>
    );
  }
  async onSubmitLink(formValues) {
    // update profile
    await this.props.fetchMyProfile(this.props.myProfile.userId);
    if (this.props.myProfile.socialLinks.length > 4) return;

    // post this info into profile
    const socialLinks = {};
    for (const [key, value] of Object.entries(formValues)) {
      socialLinks[key] = value;
    }
    const editedProfile = { id: this.props.myProfile.userId, userData: this.props.myProfile };
    editedProfile.userData.socialLinks.push(socialLinks);
    await this.props.editMyProfile(editedProfile.id, editedProfile);
    await this.props.fetchMyProfile(this.props.myProfile.userId);
    await this.props.fetchProfiles();
    this.setState({ linkAdded: true });
  }
  displayLinkMsg() {
    if (this.state.linkAdded) {
      setTimeout(() => {
        this.setState({ linkAdded: false });
      }, 5000);
      return (
        <div className="edit-profile-display-msg-link">
          <div className="edit-profile-display-msg-link-inner-container">
            <FontAwesomeIcon className="generic-icon settings-icons edit-profile-display-msg-link-icon" icon={faCircleCheck} />
            <h5 className="edit-profile-display-msg-link-text">Social Link added Successfully</h5>
          </div>
        </div>
      );
    } else {
      return (
        <div className="edit-profile-display-msg-link hidden">
          <div className="edit-profile-display-msg-link-inner-container">
            <FontAwesomeIcon className="generic-icon settings-icons edit-profile-display-msg-link-icon" icon={faCircleCheck} />
            <h5 className="edit-profile-display-msg-link-text">Social Link added Successfully</h5>
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <div style={{ position: "relative" }}>
        <div>
          <h4 className={this.props.myProfile?.socialLinks?.length > 4 ? "none" : "edit-profile-main-title"}>Social Links</h4>
          <p className={this.props.myProfile?.socialLinks?.length > 4 ? "none" : "edit-profile-subtitle"}>
            Add up to 5 social links that will display on your channel profile. Viewers will also be able to search for you by these handles.
          </p>
          <div className="edit-profile-social-links-container">
            <form
              className={this.props.myProfile?.socialLinks?.length > 4 ? "none" : ""}
              onSubmit={this.props.handleSubmit(this.onSubmitLink.bind(this))}
            >
              <div className=" edit-profile-username-outer-container">
                <div className="edit-profile-generic-container">
                  <h4 className="edit-profile-username-title">Link Title</h4>
                  <div>
                    <Field
                      name="linkTitle"
                      component={this.renderInputLink}
                      maxLength="20"
                      placeholder="Enter a link title"
                      height="min(3vw, 24px)"
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="edit-profile-generic-container">
                  <h4 className="edit-profile-username-title">Link Url</h4>
                  <div>
                    <Field name="linkURL" component={this.renderInputLink} placeholder="Enter a link URL" height="min(3vw, 24px)" />
                  </div>
                </div>
              </div>
              <div className="edit-profile-btn-outer-container">
                <div className="edit-profile-generic-container edit-profile-btn-container">
                  <button action="submit" className="generic-btn main-color-btn">
                    Add
                  </button>
                </div>
              </div>
            </form>
            <ProfileEditLinks myProfile={this.props.myProfile} />
          </div>
        </div>
        {this.displayLinkMsg.call(this)}
      </div>
    );
  }
}
const isValidHttpUrl = function (string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const validate = (formValues) => {
  const errors = {};
  if (!formValues.linkTitle) {
    errors.linkTitle = "You must enter a link title";
  }
  if (!formValues.linkURL) {
    errors.linkURL = "You must enter a link URL";
  }
  if (formValues.linkURL && !isValidHttpUrl(formValues.linkURL)) {
    errors.linkURL = "Incorrect URL format!";
  }
  return errors;
};

const formWrapped = reduxForm({ form: "addProfileLinks", validate: validate })(ProfileAddLinks);

const mapStateToProps = function (state) {
  return { myProfile: state.profiles.myProfile.userData };
};

export default connect(mapStateToProps, { fetchMyProfile, editMyProfile, fetchProfiles })(formWrapped);
