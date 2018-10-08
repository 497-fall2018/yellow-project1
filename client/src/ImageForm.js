// ImageForm.js
import React from 'react';
import PropTypes from 'prop-types';

const ImageForm = props => (
  <form onSubmit={props.submitComment}>
    <label>Upload and image: </label> 
    <input type="file"/>
    <button type="upload">Upload</button>
  </form>
);

ImageForm.propTypes = {
//   uploadImage: PropTypes.func.isRequired,
//   author: PropTypes.string,
};

ImageForm.defaultProps = {
  image: '',
  author: '',
};

export default ImageForm;