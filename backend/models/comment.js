// model/comment.js
// import dependency
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const CommentsSchema = new Schema({
  author: String,
  text: String,
  channel: String, // gives which channel comment is part of
	//imageFile: String, // not sure what this should be...
}, { timestamps: true });

// export our module to use in server.js
export default mongoose.model('Comment', CommentsSchema);
