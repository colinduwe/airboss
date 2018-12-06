import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, ControlLabel, ListGroupItem, ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import cn from 'classnames';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default class LogItemField extends Component {
  static propTypes = {
    logItem: PropTypes.objectOf(PropTypes.any).isRequired,
    label: PropTypes.string.isRequired,
    indexKey: PropTypes.number,
    logEditNewItem: PropTypes.bool,
    styles: PropTypes.shape({
      navbarEventTitle: PropTypes.string,
      inlineBlock: PropTypes.string,
      upText: PropTypes.string,
      downText: PropTypes.string
    }).isRequired,
    parent: PropTypes.objectOf(PropTypes.any).isRequired,
    patchParent: PropTypes.func.isRequired
  };

  static get defaultProps() {
    return {
      indexKey: 0,
      logEditNewItem: false
    };
  }

  constructor(props, context) {
    super(props, context);

    this.startEdit = this.startEdit.bind(this);
    this.editStatus = this.editStatus.bind(this);
    this.editDate = this.editDate.bind(this);
    this.patchLog = this.patchLog.bind(this);
    this.deleteLog = this.deleteLog.bind(this);
  }

  state = {
    edit: this.props.logEditNewItem,
    logStatus: this.props.logItem.status,
    logDate: moment(this.props.logItem.date)
  };

  startEdit() {
    this.setState({ edit: true });
  }

  stopEdit() {
    this.setState({ edit: false });
  }

  editStatus(e) {
    this.setState({ logStatus: e });
  }

  editDate(date) {
    this.setState({ logDate: date });
  }
  async patchLog() {
    const patchedLog = this.props.parent.log;
    patchedLog[this.props.indexKey].status = this.state.logStatus;
    patchedLog[this.props.indexKey].date = this.state.logDate.format();
    patchedLog.sort((a, b) => a.date.localeCompare(b.date));
    await this.props.patchParent(this.props.parent._id, { log: patchedLog });
    this.setState({ edit: false });
  }

  async deleteLog() {
    const splicedLog = this.props.parent.log;
    splicedLog.splice(this.props.indexKey, 1);
    await this.props.patchParent(this.props.parent._id, { log: splicedLog });
    this.setState({ edit: false });
  }

  render() {
    const {
      logItem, label, indexKey, styles
    } = this.props;
    const { edit, logStatus, logDate } = this.state;
    const status = logItem.status ? 'Up' : 'Down';
    const statusStyleClass = logStatus ? styles.upText : styles.downText;
    const dateString = moment(logItem.date).format('HH:mm (M/D)');
    require('react-datepicker/dist/react-datepicker.css');
    return (
      <ListGroupItem key={indexKey}>
        {!edit && (
          <div>
            <span className={cn(statusStyleClass)}>{`${label} - ${status} ${dateString}   `}</span>
            <span>
              <Button onClick={this.startEdit} style={{ cursor: 'pointer' }} className="glyphicon glyphicon-pencil" />
            </span>
          </div>
        )}
        {edit && (
          <Form inline>
            <FormGroup>
              <ControlLabel className={cn(statusStyleClass)}>{`${label}`}</ControlLabel>{' '}
              <ToggleButtonGroup type="radio" name="status" value={logStatus} onChange={this.editStatus}>
                <ToggleButton value>Up</ToggleButton>
                <ToggleButton value={false}>Down</ToggleButton>
              </ToggleButtonGroup>
            </FormGroup>
            <FormGroup>
              <DatePicker
                selected={logDate}
                onChange={this.editDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="LLL"
                timeCaption="time"
              />
            </FormGroup>
            <Button onClick={this.patchLog} style={{ cursor: 'pointer' }} className="glyphicon glyphicon-ok" />
            <Button onClick={this.deleteLog} style={{ cursor: 'pointer' }} className="glyphicon glyphicon-trash" />
          </Form>
        )}
      </ListGroupItem>
    );
  }
}
