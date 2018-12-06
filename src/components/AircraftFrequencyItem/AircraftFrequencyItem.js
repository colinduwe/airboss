import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';
import AircraftFrequency from './AircraftFrequency';
// import AircraftFrequencyEdition from './AircraftFrequencyEdition';

export default class AircraftFrequencyItem extends Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    /* styles: PropTypes.shape({
      controlBtn: PropTypes.string
    }).isRequired, */
    patchItem: PropTypes.func.isRequired,
    // exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    thisItem: PropTypes.objectOf(PropTypes.any).isRequired,
    status: PropTypes.bool.isRequired,
    aircraftOrFrequency: PropTypes.string.isRequired
  };

  static defaultProps = {
    user: null
  };

  state = {
    editing: {}
  };

  startEdit = exercise => {
    this.setState({
      editing: {
        ...this.state.editing,
        [exercise._id]: true
      }
    });
  };

  stopEdit = exercise => {
    this.setState({
      editing: {
        ...this.state.editing,
        [exercise._id]: null
      }
    });
  };

  render() {
    const {
      user, patchItem, thisItem, status, aircraftOrFrequency
    } = this.props;
    const { editing } = this.state;

    const inEdition = editing[thisItem._id];

    return (
      <ListGroupItem className="media" key={thisItem._id}>
        <div className="media-body">
          {inEdition ? (
            <span>Oops I killed AircraftFrequencyEdition</span>
          ) : (
            <AircraftFrequency
              thisItem={thisItem}
              status={status}
              user={user}
              // styles={styles}
              startEdit={this.startEdit}
              patchItem={patchItem}
              aircraftOrFrequency={aircraftOrFrequency}
            />
          )}
        </div>
      </ListGroupItem>
    );
  }
}
