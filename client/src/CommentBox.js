// CommentBox.js
import React, { Component } from 'react';
import 'whatwg-fetch';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import ChannelList from './ChannelList';
import Popup from './popup';
import './CommentBox.css';

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      author: '',
      text: '',
      channel: '',
      channel_list: [] // holds a list of available channels
    };
    this.pollInterval = null;
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    this.loadChannelsFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 2000);
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

// ******** Channels functions *********
  loadChannelsFromServer = () => {
    // fetch returns a promise. If you are not familiar with promises, see
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    fetch('/api/channels')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ channel_list: res.data });
      });
  }


  onChangeChannel = (e) => {
    e.preventDefault();
    this.setState({
        data: [],
        author: '',
        text: '',
        channel: e.target.value
    });
  }

// this will be rewritten to display a pop up with text input for a new channel to be created
// http://minutemailer.github.io/react-popup/
  onAddChannel = () => {
    Popup.plugins().prompt('', 'New Channel Name', function (name) {
        if (!name) return;
        else if (this.state.channel_list.filter(e => e.name === name).length > 0) {
          this.setState({
              data: [],
              author: '',
              text: '',
              channel: name
          });
        }
        else fetch('/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        }).then(res => res.json()).then((res) => {
          if (!res.success) this.setState({ error: res.error.message || res.error });
          else {
            this.loadChannelsFromServer();
            this.setState({
                data: [],
                author: '',
                text: '',
                channel: name,
                error: null
            });
          }
        });

    }.bind(this));
  }

  onDeleteChannel = () => {
    const chnl = this.state.channel;
    if (chnl === '') return;
    this.setState({
        data: [],
        author: '',
        text: '',
        channel: ''
    });
    fetch(`api/channels/${chnl}`, { method: 'DELETE' })
      .then(res => res.json()).then((res) => {
        if (!res.success) this.setState({ error: res.error });
        this.loadChannelsFromServer();
      });
  }


// ******** Comments functions **********
  loadCommentsFromServer = () => {
    if (!this.state.channel) return; // can only show comments if a channel is selected
    // fetch returns a promise. If you are not familiar with promises, see
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    fetch(`/api/comments/${this.state.channel}`)
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
  }


  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }



  onUpdateComment = (id) => {
    const oldComment = this.state.data.find(c => c._id === id);
    if (!oldComment) return;
    this.setState({
        author: oldComment.author,
        text: oldComment.text,
        updateId: id
    });
  }

  onDeleteComment = (id) => {
    const i = this.state.data.findIndex(c => c._id === id);
    const data = [
      ...this.state.data.slice(0, i),
      ...this.state.data.slice(i + 1),
    ];
    this.setState({ data });
    fetch(`api/comments/${id}`, { method: 'DELETE' })
      .then(res => res.json()).then((res) => {
        if (!res.success) this.setState({ error: res.error });
      });
  }

  submitComment = (e) => {
    e.preventDefault();
    const { author, text, channel, updateId } = this.state;
    if (!author || !text || !channel) return;
    if (updateId) {
      this.submitUpdatedComment();
    } else {
      this.submitNewComment();
    }
  }

  submitNewComment = () => {
    const { author, text, channel } = this.state;
    const data = [
      ...this.state.data,
      {
        author,
        text,
        channel,
        _id: Date.now().toString(),
        updatedAt: new Date(),
        createdAt: new Date()
      },
    ];
    this.setState({ data });
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text, channel }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ author: '', text: '', error: null });
    });
  }

  submitUpdatedComment = () => {
    const { author, text, updateId } = this.state;
    fetch(`/api/comments/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ author: '', text: '', updateId: null });
    });
  }

  render() {
    return (
      <div className="container">
        <div className="comments">
          <Popup />
          <ChannelList
             currChannel = {this.state.channel}
             list = {this.state.channel_list}
             handleChangeChannel = {this.onChangeChannel}
             handleAddChannel = {this.onAddChannel}
             handleDeleteChannel = {this.onDeleteChannel}
          />
          <h2>Comments:</h2>
          <CommentList
            data={this.state.data}
            handleDeleteComment={this.onDeleteComment}
            handleUpdateComment={this.onUpdateComment}
          />
        </div>
        <div className="form">
            <CommentForm
                author={this.state.author}
                text={this.state.text}
								submitComment={this.submitComment}
                handleChangeText={this.onChangeText}
            />
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default CommentBox;
