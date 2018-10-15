// ImageForm.js
import React from 'react';
import PropTypes from 'prop-types';

const ImageForm = props => (
  <form onSubmit={props.uploadImage}>
    <label>Upload an image url: </label>
    <input
        type="text"
        name = "imageFile"
        value = {props.imagefile}
        onChange={props.handleChangeImage} 
    />
    <button type="upload">Upload</button>
  </form>
);

ImageForm.uploadHandler = {

};

ImageForm.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  handleChangeImage: PropTypes.func.isRequired,
  //imageFile: PropTypes.string ,
//   author: PropTypes.string,
};

ImageForm.defaultProps = {
  imageFile: null,
//   author: '',
};

export default ImageForm;
