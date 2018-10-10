// ImageForm.js
import React from 'react';
import PropTypes from 'prop-types';

const ImageForm = props => (
  <form onSubmit={props.uploadImage}>
    <label>Upload an image: </label> 
    <input 
        type="file"
        name = "imagefile"
        // value = {props.imagefile}
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
  imagefile: PropTypes.string ,
//   author: PropTypes.string,
};

ImageForm.defaultProps = {
  imagefile: '',
//   author: '',
};

export default ImageForm;