import "../../../../styles/NewStream.css";
import React from "react";
import { Field, formValues, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import _ from "lodash";
import { createStream, fetchStreams } from "../../../../actions";

const getCurrentDate = function () {
  const curDate = new Date();
  return curDate;
};

const renderInput = function (formProps) {
  return (
    <div>
      <div className="label_input">
        <label className="generic-input-label">{formProps.label}</label>
        <textarea
          autoComplete="off"
          maxLength={formProps.maxLength}
          className="generic-input add-stream-input"
          onChange={formProps.input.onChange}
          value={formProps.input.value}
          placeholder={formProps.placeholder}
          style={{
            height: "min(10vw, 80px)",
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
};

const renderInputCategory = function (formProps) {
  return (
    <div className="label_input">
      <label className="generic-input-label">{formProps.label}</label>
      <div className="category-input-container">
        <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" className="category_input_svg">
          <g>
            <path
              fillRule="evenodd"
              d="M13.192 14.606a7 7 0 111.414-1.414l3.101 3.1-1.414 1.415-3.1-3.1zM14 9A5 5 0 114 9a5 5 0 0110 0z"
              clipRule="evenodd"
            ></path>
          </g>
        </svg>
        <textarea
          autoComplete="off"
          maxLength={formProps.maxLength}
          className="add-stream-input category-input"
          onChange={formProps.input.onChange}
          value={formProps.input.value}
          placeholder={formProps.placeholder}
          style={{ height: "100%", paddingTop: "min(0.9vw, 7px)" }}
        />
      </div>
      <p className="generic-input-length new-stream-input-length">
        {formProps.input.value.length}/{formProps.maxLength}
      </p>
    </div>
  );
};

const renderInputImage = function (formProps) {
  return (
    <div>
      <div className="label_input">
        <label className="generic-input-label">{formProps.label}</label>
        <input
          autoComplete="off"
          className="generic-input add-stream-input"
          onChange={formProps.input.onChange}
          value={formProps.input.value}
          placeholder={formProps.placeholder}
          style={{
            height: "min(4vw, 30px)",
            backgroundColor: `${
              formProps.meta.touched && formProps.meta.error
                ? "rgb(255, 223, 223)"
                : getComputedStyle(document.documentElement).getPropertyValue("--dark-white")
            }`,
          }}
        />
      </div>
    </div>
  );
};

const isValidHttpUrl = function (string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
const setThumbnail = function (formValues) {
  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }
  if (isImage(formValues.thumbnail)) return;
  formValues.thumbnail = "https://i.imgur.com/DLBj8bt.png";
};

class CreateStream extends React.Component {
  async onSubmit(formValues) {
    formValues.userId = this.props.profile.myProfile.id;
    // formValues.date = getCurrentDate();
    setThumbnail(formValues);
    formValues.date = getCurrentDate();
    formValues.likes = 0;
    await this.props.createStream(formValues);
    await this.props.fetchStreams();
    const streams = Object.values(this.props.streams.allStreams);
    const streamId = streams.findIndex((stream) => stream.title === formValues.title);
    window.open(streamId + 2);
  }
  render() {
    return (
      <div className="new-stream">
        <div className="new-stream-center">
          <h3 className="section-msg">Create New Stream</h3>
          <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
            <Field name="title" component={renderInput} label="Title" maxLength="140" placeholder="Enter a title" />
            <Field name="description" component={renderInput} label="Description" maxLength="140" placeholder="Provide a description" />
            <Field name="thumbnail" component={renderInputImage} label="Thumbnail" placeholder="Provide a thumbnail link" />
            <Field name="category" component={renderInputCategory} label="Category" maxLength="10" placeholder="Search for a category" />
            <div style={{ textAlign: "center" }}>
              <button action="submit" className="generic-btn main-color-btn">
                Create Stream
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const validate = (formValues) => {
  const errors = {};
  if (!formValues.title) {
    errors.title = "You must enter a title";
  }
  if (!formValues.description) {
    errors.description = "You must enter a description";
  }
  if (formValues.thumbnail) {
    if (!isValidHttpUrl(formValues.thumbnail)) {
      errors.thumbnail = "Incorrect URL format!";
    }
  }
  return errors;
};

const formWrapped = reduxForm({ form: "streamCreate", validate: validate })(CreateStream);

const mapStateToProps = function (state) {
  return { profile: state.profiles, streams: state.streams };
};

export default connect(mapStateToProps, { createStream, fetchStreams })(formWrapped);
