import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import cn from 'classnames';
import { Link } from 'react-router-dom';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import ConfirmModal from 'components/ConfirmModal/ConfirmModal';

export default class AircraftFrequency extends Component {
  static propTypes = {
    thisItem: PropTypes.objectOf(PropTypes.any).isRequired,
    status: PropTypes.bool.isRequired,
    patchItem: PropTypes.func.isRequired,
    aircraftOrFrequency: PropTypes.string.isRequired
  };

  static defaultProps = {
    // user: null
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      confirmShow: false
    };
  }

  confirmLogEntry = async () => {
    const logStatus = !this.props.status;
    const log = this.props.thisItem.log.concat({ status: logStatus, date: new Date() });
    await this.props.patchItem(this.props.thisItem._id, { status: logStatus, log });
    this.setState({ confirmShow: false });
  };

  render() {
    const { thisItem, status, aircraftOrFrequency } = this.props;

    let latestLog = 'empty log';
    if (thisItem.log.length) {
      latestLog = moment(thisItem.log[thisItem.log.length - 1].date).format('HH:mm (M/D)');
    }

    const toggleButtonGroupStatus = status ? 'up' : 'down';

    return (
      <div>
        <Link to={`/${aircraftOrFrequency}/${thisItem._id}`}>{thisItem.name}</Link>
        {aircraftOrFrequency === 'frequencies' &&
          <span>{thisItem.upperBound}-{thisItem.lowerBound} MHz</span>
        }
        <ToggleButtonGroup
          type="radio"
          name="status"
          value={toggleButtonGroupStatus}
          onChange={() => this.setState({ confirmShow: true })}
        >
          <ToggleButton value="up">Up</ToggleButton>
          <ToggleButton value="down">Down</ToggleButton>
        </ToggleButtonGroup>
        <span>{latestLog}</span>
        <ConfirmModal
          show={this.state.confirmShow}
          onHide={() => this.setState({ confirmShow: false })}
          confirmLogEntry={() => this.confirmLogEntry()}
        />
      </div>
    );
  }
}
