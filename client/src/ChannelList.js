import React from 'react';
import PropTypes from 'prop-types';

const ChannelList = (props) => {
  const channels = props.list.map(chnl => (
    <option value={chnl.name} key={chnl._id}>{chnl.name}</option>
  ));
  return (
    <div className="ChannelSection">
      <form>
        <select className="ChannelDropdown" value={props.currChannel} onChange={props.handleChangeChannel}>
          <option value="">Select a Channel</option>
          {channels}
        </select>
      </form>
      <button type="button" className="AddButton Button" onClick={() => { props.handleAddChannel(); }}>+</button>
      <button type="button" className="DelButton Button" onClick={() => { props.handleDeleteChannel(); }}>-</button>
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
