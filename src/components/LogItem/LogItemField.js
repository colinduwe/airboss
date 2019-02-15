import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  ControlLabel,
  ListGroupItem,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  FormControl,
  HelpBlock
} from 'react-bootstrap';
import cn from 'classnames';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import ConfirmModal from 'components/ConfirmModal/ConfirmModal';

const moment = extendMoment(Moment);

export default class LogItemField extends Component {
  static propTypes = {
    logItem: PropTypes.objectOf(PropTypes.any).isRequired,
    label: PropTypes.string.isRequired,
    indexKey: PropTypes.number,
    styles: PropTypes.shape({
      navbarEventTitle: PropTypes.string,
      inlineBlock: PropTypes.string,
      upText: PropTypes.string,
      downText: PropTypes.string
    }).isRequired,
    parent: PropTypes.objectOf(PropTypes.any).isRequired,
    patchParent: PropTypes.func.isRequired,
    exercise: PropTypes.shape({
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired
    }).isRequired
  };

  static get defaultProps() {
    return {
      indexKey: 0
    };
  }

  constructor(props, context) {
    super(props, context);

    this.startEdit = this.startEdit.bind(this);
    this.editStatus = this.editStatus.bind(this);
    this.editDate = this.editDate.bind(this);
    this.patchLog = this.patchLog.bind(this);
    this.deleteLog = this.deleteLog.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  state = {
    edit: this.props.logItem.inEdit,
    logStatus: this.props.logItem.status,
    logDate: moment(this.props.logItem.date).isValid() ? moment(this.props.logItem.date) : null,
    logTime: moment(this.props.logItem.time).isValid() ? this.props.logItem.time : '',
    logTimePristine: this.props.logItem.time === '',
    validRange: moment.range(moment(this.props.exercise.startDate), moment(this.props.exercise.endDate)),
    confirmShow: false,
    confirmFunc: '',
    dateFocused: false
  };

  getTimeValidationState() {
    if (this.state.logTimePristine) return null;
    const valid = moment(this.state.logTime, 'HH:mm', true).isValid();
    if (!valid) return 'error';
    return null;
  }

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

  handleTimeChange(e) {
    this.setState({ logTime: e.target.value, logTimePristine: false });
  }

  async patchLog() {
    const patchedLog = this.props.parent.log;
    patchedLog[this.props.indexKey].status = this.state.logStatus;
    patchedLog[this.props.indexKey].date = this.state.logDate;
    patchedLog[this.props.indexKey].inEdit = false;
    patchedLog.sort((a, b) => a.date.localeCompare(b.date));
    await this.props.patchParent(this.props.parent._id, { log: patchedLog });
    this.setState({
      edit: false,
      confirmShow: false
    });
  }

  async deleteLog() {
    const splicedLog = this.props.parent.log;
    splicedLog.splice(this.props.indexKey, 1);
    await this.props.patchParent(this.props.parent._id, { log: splicedLog });
  }

  render() {
    const {
      logItem, label, indexKey, styles
    } = this.props;
    const {
      edit, logStatus, logDate, dateFocused, validRange
    } = this.state;
    const status = logItem.status ? 'Up' : 'Down';
    const statusStyleClass = logStatus ? styles.upText : styles.downText;
    const dateString = moment(logItem.date).format('HH:mm (M/D)');
    require('react-datepicker/dist/react-datepicker.css');
    console.log(validRange);
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
          <div>
            <Form>
              <FormGroup>
                <ControlLabel className={cn(statusStyleClass)}>{`${label}`}</ControlLabel>{' '}
                <ToggleButtonGroup type="radio" name="status" value={logStatus} onChange={this.editStatus}>
                  <ToggleButton value>Up</ToggleButton>
                  <ToggleButton value={false}>Down</ToggleButton>
                </ToggleButtonGroup>
              </FormGroup>
              <FormGroup>
                <SingleDatePicker
                  date={logDate} // momentPropTypes.momentObj or null
                  onDateChange={date => this.setState({ logDate: date })} // PropTypes.func.isRequired
                  focused={dateFocused} // PropTypes.bool
                  onFocusChange={({ focused }) => this.setState({ dateFocused: focused })} // PropTypes.func.isRequired
                  id="log_item_date" // PropTypes.string.isRequired,
                  required
                  isOutsideRange={day => !day.within(validRange)}
                />
              </FormGroup>
              <FormGroup controlId="logTime" validationState={this.getTimeValidationState()}>
                <ControlLabel>Time</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.logTime}
                  placeholder="16:30"
                  onChange={this.handleTimeChange}
                />
                <FormControl.Feedback />
                <HelpBlock>A valid time is required</HelpBlock>
              </FormGroup>
              <Button
                onClick={() =>
                  this.setState({
                    confirmShow: true,
                    confirmFunc: 'patchLog'
                  })
                }
                style={{ cursor: 'pointer' }}
                className="glyphicon glyphicon-ok"
              />
              <Button
                onClick={() =>
                  this.setState({
                    confirmShow: true,
                    confirmFunc: 'deleteLog'
                  })
                }
                className="glyphicon glyphicon-trash"
              />
            </Form>
            <ConfirmModal
              show={this.state.confirmShow}
              onHide={() => this.setState({ confirmShow: false })}
              confirmLogEntry={() => this[this.state.confirmFunc]()}
            />
          </div>
        )}
      </ListGroupItem>
    );
  }
}
