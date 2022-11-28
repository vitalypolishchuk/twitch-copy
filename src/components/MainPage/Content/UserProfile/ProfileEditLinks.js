import "../../../../styles/ProfileEdit.css";
import React from "react";
import { Field, formValues, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchMyProfile, editMyProfile, fetchProfiles } from "../../../../actions";

class ProfileEditLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editSocialLink: false, updateSocialLinks: false };
  }
  getDomainName(url) {
    const linkURL = new URL(url);
    return linkURL.hostname;
  }
  async onDeleteClick(index) {
    await this.props.fetchMyProfile(this.props.myProfile.userId);
    const editedProfile = { id: this.props.myProfile.userId, userData: this.props.myProfile };
    editedProfile.userData.socialLinks.splice(index, 1);
    await this.props.editMyProfile(editedProfile.id, editedProfile);
    await this.props.fetchMyProfile(this.props.myProfile.userId);
  }
  async onSubmitEditLink(formValues) {
    if (formValues.linkTitleEdit || formValues.linkURLEdit) {
      await this.props.fetchMyProfile(this.props.myProfile.userId);
      const editedProfile = { id: this.props.myProfile.userId, userData: this.props.myProfile };
      editedProfile.userData.socialLinks[this.state.editSocialLink].linkTitle =
        formValues.linkTitleEdit ?? editedProfile.userData.socialLinks[this.state.editSocialLink].linkTitle;
      editedProfile.userData.socialLinks[this.state.editSocialLink].linkURL =
        formValues.linkURLEdit ?? editedProfile.userData.socialLinks[this.state.editSocialLink].linkURL;
      await this.props.editMyProfile(editedProfile.id, editedProfile);
      await this.props.fetchMyProfile(this.props.myProfile.userId);
      this.setState({ editSocialLink: false });
    }
  }
  editSocialLinkInput(formProps) {
    return (
      <input
        autoComplete="off"
        maxLength={formProps.maxLength ?? "524288"}
        className="generic-input add-stream-input"
        onChange={formProps.input.onChange}
        defaultValue={formProps.defaultValue}
        placeholder={formProps.placeholder}
        style={{
          height: `${formProps.height}`,
          borderRadius: "0.25rem",
          backgroundColor: `${
            formProps.meta.touched && formProps.meta.error
              ? "rgb(255, 223, 223)"
              : getComputedStyle(document.documentElement).getPropertyValue("--dark-white")
          }`,
        }}
      />
    );
  }
  renderSocialLinks() {
    if (this.props.myProfile) {
      const renderedLinks = this.props.myProfile.socialLinks.map(({ linkURL, linkTitle }, id) => {
        if (id === this.state.editSocialLink) {
          const linkURLDomain = this.getDomainName(linkURL);
          return (
            <div className="edit-social-links-inner-container" key={id}>
              <div className="edit-social-link-icon-container">
                <FontAwesomeIcon className="generic-icon edit-social-link-icon" icon={faSort} />
              </div>
              <div className="edit-social-links-info-edit-container">
                <form className="edit-social-link-form" onSubmit={this.props.handleSubmit(this.onSubmitEditLink.bind(this))}>
                  <div className="edit-social-link-form-inner">
                    <Field
                      name="linkTitleEdit"
                      component={this.editSocialLinkInput}
                      maxLength="20"
                      defaultValue={linkTitle}
                      height="min(6vw, 30px)"
                    />
                    <Field name="linkURLEdit" component={this.editSocialLinkInput} defaultValue={linkURL} height="min(6vw, 30px)" />
                  </div>
                  <div className="edit-social-link-save-cancel-btns">
                    <button action="submit" className="generic-btn main-color-btn">
                      Save
                    </button>
                    <button onClick={() => this.setState({ editSocialLink: false })} className="generic-btn main-color-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        } else {
          const linkURLDomain = this.getDomainName(linkURL);
          return (
            <Draggable key={id} draggableId={id.toString()} index={id}>
              {(provided) => (
                <div className="edit-social-links-inner-container" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <div className="edit-social-link-icon-container">
                    <FontAwesomeIcon className="generic-icon edit-social-link-icon" icon={faSort} />
                  </div>
                  <div className="edit-social-links-info-container">
                    <div className="edit-social-link-img-container">
                      <img
                        className="edit-social-link-img"
                        src={"https://s2.googleusercontent.com/s2/favicons?domain=" + linkURLDomain}
                        alt="linkImg"
                      />
                    </div>
                    <div className="edit-social-links-url-name-container">
                      <h5 className="edit-social-links-name">{linkTitle}</h5>
                      <h5 className="edit-social-links-url">{linkURL}</h5>
                    </div>
                    <div className="edit-social-links-edit-delete-container">
                      <FontAwesomeIcon
                        className="generic-icon edit-social-link-icon edit-social-link-icon-edit-btn"
                        icon={faPen}
                        onClick={() => {
                          this.setState({ editSocialLink: id });
                        }}
                      />
                      <FontAwesomeIcon
                        className="generic-icon edit-social-link-icon edit-social-link-icon-delete-btn"
                        icon={faTrash}
                        onClick={this.onDeleteClick.bind(this, id)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          );
        }
      });
      return renderedLinks;
    }
  }
  async handleOnDragEnd(result) {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    await this.props.fetchMyProfile(this.props.myProfile.userId);
    const editedProfile = { id: this.props.myProfile.userId, userData: this.props.myProfile };
    const [reorderedItem] = editedProfile.userData.socialLinks.splice(sourceIndex, 1);
    editedProfile.userData.socialLinks.splice(destinationIndex, 0, reorderedItem);
    this.setState({ updateSocialLinks: true });

    await this.props.editMyProfile(editedProfile.id, editedProfile);
    await this.props.fetchMyProfile(this.props.myProfile.userId);
  }
  render() {
    return (
      <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
        <Droppable droppableId="socialLinks">
          {(provided) => (
            <div className="draggable-container" ref={provided.innerRef} {...provided.draggableProps}>
              {this.renderSocialLinks.call(this)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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

  if (formValues.linkURLEdit && !isValidHttpUrl(formValues.linkURLEdit)) {
    errors.linkURLEdit = "Incorrect URL format!";
  }
  return errors;
};

const formWrapped = reduxForm({ form: "editProfileLinks", validate: validate })(ProfileEditLinks);

const mapStateToProps = function (state) {
  return { myProfile: state.profiles.myProfile.userData };
};

export default connect(mapStateToProps, { fetchMyProfile, editMyProfile, fetchProfiles })(formWrapped);
