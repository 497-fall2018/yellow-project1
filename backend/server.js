// server.js

// first we import our dependencies…
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import { getSecret } from './secrets';
import Channel from './models/channel';
import Comment from './models/comment';

// and create our instances
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

// db config -- set your URI from mLab in secrets.js
mongoose.connect(getSecret('dbUri'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Channel functions
router.get('/channels', (req, res) => {
  Channel.find((err, channels) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: channels });
  });
});

router.post('/channels', (req, res) => {
  const channel = new Channel();
  // body parser lets us use the req.body
  const { name } = req.body;
  if (!channel) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide a channel name.'
    });
  }
  channel.name = name;
  channel.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// update the name of the channel
router.put('/channels/:channelId', (req, res) => {
    const { channelId } = req.params;
    if (!channelId) {
      return res.json({ success: false, error: 'No channel id provided' });
    }
    Channel.findById(channelId, (error, channel) => {
      if (error) return res.json({ success: false, error });
      const { name} = req.body;
      if (name) channel.name = name;
      channel.save(error => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
      });
    });
  });

  router.delete('/channels/:channelId', (req, res) => {
    const { channelId } = req.params;
    if (!channelId) {
      return res.json({ success: false, error: 'No channel id provided' });
    }
    Channel.remove({ _id: channelId }, (error, comment) => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });



// Comments functions
router.get('/comments', (req, res) => {
  Comment.find((err, comments) => { //https://mongoosejs.com/docs/api.html#model_Model.find
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});



router.post('/comments', (req, res) => {
  const comment = new Comment();
  // body parser lets us use the req.body
  const { author, text } = req.body;
  if (!author || !text) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide an author and comment.'
    });
  }
  comment.author = author;
  comment.text = text;
  comment.channel = 'placeholder';
  comment.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.put('/comments/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
      return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.findById(commentId, (error, comment) => {
      if (error) return res.json({ success: false, error });
      const { author, text } = req.body;
      if (author) comment.author = author;
      if (text) comment.text = text;
      comment.save(error => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
      });
    });
  });

  router.delete('/comments/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
      return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.remove({ _id: commentId }, (error, comment) => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
