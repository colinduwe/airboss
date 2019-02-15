import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListGroupItem,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Button
} from 'react-bootstrap';
import ConfirmModal from 'components/ConfirmModal/ConfirmModal';
import FormErrors from 'components/Forms/FormErrors';
import cn from 'classnames';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
// import { HORIZONTAL_ORIENTATION, VERTICAL_ORIENTATION } from 'react-dates/constants';

const moment = extendMoment(Moment);

export default class LogEdition extends Component {
  static propTypes = {
    item: PropTypes.objectOf(PropTypes.any).isRequired,
    label: PropTypes.string.isRequired,
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    patchLogEntry: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    deleteLogEntry: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    styles: PropTypes.shape({
      navbarEventTitle: PropTypes.string,
      inlineBlock: PropTypes.string,
      upText: PropTypes.string,
      downText: PropTypes.string,
      listGroupItem: PropTypes.string
    }).isRequired
  };
  constructor(props) {
    super(props);

    this.editStatus = this.editStatus.bind(this);
    this.editDate = this.editDate.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.getTimeValidationState = this.getTimeValidationState.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  state = {
    status: this.props.item.status,
    date: moment(this.props.item.date).isValid() ? moment(this.props.item.date) : null,
    time: moment(this.props.item.time, 'HH:mm', true).isValid() ? this.props.item.time : '',
    logTimePristine: this.props.item.time === '',
    pristine: true,
    validRange: moment.range(moment(this.props.exercise.startDate), moment(this.props.exercise.endDate)),
    confirmShow: false,
    confirmFunc: '',
    dateFocused: false,
    // Form error validation
    formErrors: { status: '', date: '', time: '' },
    statusValid: false,
    dateValid: false,
    timeValid: false
  };

  getTimeValidationState() {
    if (this.state.logTimePristine) return null;
    const valid = moment(this.state.time, 'HH:mm', true).isValid();
    if (!valid) return 'error';
    return null;
  }

  getValidationState(fieldName) {
    if (this.state.pristine) {
      return null;
    }
    switch (fieldName) {
      case 'status':
        return this.state.statusValid !== false ? null : 'error';
      case 'date':
        return this.state.dateValid !== false ? null : 'error';
      case 'time':
        return this.state.timeValid !== false ? null : 'error';
      default:
        return null;
    }
  }

  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.formErrors;
    let { statusValid, dateValid, timeValid } = this.state;

    switch (fieldName) {
      case 'status':
        statusValid = value !== null;
        fieldValidationErrors.status = statusValid ? '' : 'status is invalid';
        break;
      case 'date':
        dateValid = moment(value).within(this.state.validRange);
        fieldValidationErrors.date = dateValid ? '' : ' is invalid';
        break;
      case 'time':
        timeValid = moment(value, 'HH:mm', true).isValid();
        fieldValidationErrors.time = timeValid ? '' : ' not a valid time';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        statusValid,
        dateValid,
        timeValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({ formValid: this.state.statusValid && this.state.dateValid && this.state.timeValid });
  }

  editStatus(status) {
    this.setState({ status, pristine: false }, () => {
      this.validateField('status', status);
    });
  }

  editDate(date) {
    this.setState({ date, pristine: false }, () => {
      this.validateField('date', date);
    });
  }

  handleTimeChange(e) {
    const { value } = e.target;
    this.setState({ time: value, pristine: false }, () => {
      this.validateField('time', value);
    });
  }

  render() {
    const { item, label, styles } = this.props;
    const {
      status, date, time, dateFocused, validRange, confirmShow
    } = this.state;
    // const statusText = status ? 'Up' : 'Down';
    const statusStyleClass = status ? styles.upText : styles.downText;
    require('react-datepicker/dist/react-datepicker.css');

    return (
      <ListGroupItem className={cn('media', styles.listGroupItem)} key={this.props.item._id}>
        <div>
          <Form horizontal>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
            </div>
            <FormGroup validationState={this.getValidationState('status')}>
              <ControlLabel className={cn(statusStyleClass)}>{`${label}`}</ControlLabel>{' '}
              <ToggleButtonGroup type="radio" name="status" value={status} onChange={this.editStatus}>
                <ToggleButton value>Up</ToggleButton>
                <ToggleButton value={false}>Down</ToggleButton>
              </ToggleButtonGroup>
            </FormGroup>
            <FormGroup validationState={this.getValidationState('date')}>
              <SingleDatePicker
                date={date} // momentPropTypes.momentObj or null
                onDateChange={newDate => this.editDate(newDate)} // PropTypes.func.isRequired
                focused={dateFocused} // PropTypes.bool
                onFocusChange={({ focused }) => this.setState({ dateFocused: focused })} // PropTypes.func.isRequired
                id="log_item_date" // PropTypes.string.isRequired,
                required
                isOutsideRange={day => !day.within(validRange)}
              />
            </FormGroup>
            <FormGroup controlId="logTime" validationState={this.getValidationState('time')}>
              <ControlLabel>Time</ControlLabel>
              <FormControl type="time" value={time} placeholder="16:30" onChange={this.handleTimeChange} />
              <FormControl.Feedback />
            </FormGroup>
            <Button
              onClick={() =>
                this.setState({
                  confirmShow: true,
                  confirmFunc: 'patchLogEntry'
                })
              }
              style={{ cursor: 'pointer' }}
              className="glyphicon glyphicon-ok"
              disabled={this.state.pristine || !this.state.formValid}
            />
            <Button
              onClick={() =>
                this.setState({
                  confirmShow: true,
                  confirmFunc: 'deleteLogEntry'
                })
              }
              className="glyphicon glyphicon-trash"
            />
          </Form>
          <ConfirmModal
            show={confirmShow}
            onHide={() => this.setState({ confirmShow: false })}
            confirmLogEntry={() =>
              this.props[this.state.confirmFunc]({
                _id: item._id,
                status,
                date,
                time
              })
            }
          />
        </div>
      </ListGroupItem>
    );
  }
}
