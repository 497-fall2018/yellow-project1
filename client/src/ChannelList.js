import React from 'react';
import PropTypes from 'prop-types';

const ChannelList = (props) => {
  const channels = props.list.map(chnl => (
    <option value={chnl.name} key={chnl._id}>{chnl.name}</option>
  ));
  return (
    <div>
      <form>
        <select value={props.currChannel} onChange={props.handleChangeChannel}>
          <option value="">Select a Channel</option>
          {channels}
        </select>
      </form>
      <button type="button" onClick={() => { props.handleAddChannel(); }}>Add</button>
      <button type="button" onClick={() => { props.handleDeleteChannel(); }}>Remove</button>
    </div>
  );
};

ChannelList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    updatedAt: PropTypes.date,
    createdAt: PropTypes.date
  })),
  currChannel: PropTypes.string,
  handleChangeChannel: PropTypes.func.isRequired,
  handleAddChannel: PropTypes.func.isRequired,
  handleDeleteChannel: PropTypes.func.isRequired,
};

ChannelList.defaultProps = {
  list: [],
};

export default ChannelList;
