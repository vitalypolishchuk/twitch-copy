import "../../../../styles/ProfileEdit.css";
import React from "react";
import { Field, formValues, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { fetchProfiles, fetchMyProfile, editMyProfile } from "../../../../actions";

import ProfileAddLinks from "./ProfileAddLinks";

class ProfileEdit extends React.Component {
  renderInput(formProps) {
    return (
      <div>
        <div className="label_input">
          <textarea
            autoComplete="off"
            maxLength={formProps.maxLength}
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
          <p className="generic-input-length new-stream-input-length">
            {formProps.input.value.length}/{formProps.maxLength}
          </p>
        </div>
      </div>
    );
  }
  async onSubmit(formValues) {
    await this.props.fetchMyProfile(this.props.myProfile.userId);
    const editedProfile = { id: this.props.myProfile.userId, userData: this.props.myProfile };
    editedProfile.userData.userName = formValues.name ?? editedProfile.userData.userName;
    editedProfile.userData.bio = formValues.bio ?? editedProfile.userData.bio;
    await this.props.editMyProfile(editedProfile.id, editedProfile);
    await this.props.fetchProfiles();
  }
  render() {
    return (
      <div className="edit-profile-outer-container">
        <h4 className="edit-profile-main-title">Profile Settings</h4>
        <p className="edit-profile-subtitle">Change identifying details for your account</p>
        <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
          <div className="edit-profile-settings-container edit-profile-username-outer-container">
            <div className="edit-profile-generic-container">
              <h4 className="edit-profile-username-title">UserName</h4>
              <div>
                <Field name="name" component={this.renderInput} maxLength="14" placeholder="Enter a name" height="min(3vw, 24px)" />
              </div>
            </div>
          </div>
          <div className="edit-profile-settings-container edit-profile-bio-container">
            <div className="edit-profile-generic-container">
              <h4 className="edit-profile-username-title">Bio</h4>
              <div>
                <Field name="bio" component={this.renderInput} maxLength="300" placeholder="Enter a bio" height="min(9vw, 72px)" />
              </div>
            </div>
          </div>
          <div className="edit-profile-settings-container edit-profile-btn-outer-container">
            <div className="edit-profile-generic-container edit-profile-btn-container">
              <button action="submit" className="generic-btn main-color-btn">
                Save Changes
              </button>
            </div>
          </div>
        </form>
        <ProfileAddLinks myProfile={this.props.myProfile} />
      </div>
    );
  }
}

const formWrapped = reduxForm({ form: "editProfile" })(ProfileEdit);

const mapStateToProps = function (state) {
  return { myProfile: state.profiles.myProfile.userData };
};

export default connect(mapStateToProps, { fetchProfiles, fetchMyProfile, editMyProfile })(formWrapped);
