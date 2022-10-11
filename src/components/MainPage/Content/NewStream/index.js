import "../../../../styles/NewStream.css";
import React from "react";
import { Field, reduxForm } from "redux-form";

class CreateStream extends React.Component {
  renderError(meta) {
    if (meta.touched && meta.error) {
      return (
        <div className="error-container">
          <h5>{meta.error}</h5>
        </div>
      );
    }
  }
  renderInput(formProps) {
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
            style={{ height: "min(10vw, 80px)" }}
          />
          <p className="generic-input-length new-stream-input-length">
            {formProps.input.value.length}/{formProps.maxLength}
          </p>
          {this.renderError(formProps.meta)}
        </div>
      </div>
    );
  }
  renderInputCategory(formProps) {
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
  }
  onSubmit(formValues) {
    // console.log(formValues);
  }
  render() {
    return (
      <div className="new-stream">
        <div className="new-stream-center">
          <h3 className="section-msg">Create New Stream</h3>
          <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Field name="title" component={this.renderInput.bind(this)} label="Title" maxLength="140" placeholder="Enter a title" />
            <Field
              name="description"
              component={this.renderInput.bind(this)}
              label="Description"
              maxLength="140"
              placeholder="Provide a description"
            />
            <Field
              name="category"
              component={this.renderInputCategory.bind(this)}
              label="Category"
              maxLength="10"
              placeholder="Search for a category"
            />
            <div style={{ textAlign: "center" }}>
              <button className="generic-btn main-color-btn">Create Stream</button>
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
  if (!formValues.category) {
    errors.category = "You must enter a category";
  }
  return errors;
};

export default reduxForm({ form: "streamCreate", validate: validate })(CreateStream);
