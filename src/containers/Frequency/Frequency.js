import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import frequencyReducer, * as frequencyActions from 'redux/modules/frequency';
import { withApp } from 'hoc';
import LogItem from 'components/LogItem/LogItem';
import { ToggleButtonGroup, ToggleButton, ListGroup } from 'react-bootstrap';
// import { socket } from 'app';
import NotFound from 'containers/NotFound/NotFound';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ frequency: frequencyReducer });

    const state = getState();
    let id = '';

    if (state.online) {
      const {
        router: { location }
      } = state;
      if (location != null) {
        const pathParts = location.pathname.split('/');
        [, , id] = pathParts;
      }
      return dispatch(frequencyActions.get(id));
    }
  }
})
@connect(
  state => ({
    frequencies: state.frequency.frequencies
  }),
  { ...frequencyActions }
)
@withApp
export default class FrequencyFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    /* user: PropTypes.shape({
      email: PropTypes.string
    }), */
    addAircraft: PropTypes.func.isRequired,
    addFrequency: PropTypes.func.isRequired,
    // patchExercise: PropTypes.func.isRequired,
    // selectExercise: PropTypes.func.isRequired,
    // patchAirplane: PropTypes.func.isRequired,
    // patchFrequency: PropTypes.func.isRequired,
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    aircraft: PropTypes.arrayOf(PropTypes.object).isRequired,
    frequencies: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    // user: null
  };

  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
  }

  state = {
    toggleButtonValue: 'aircraft',
    itemName: '',
    error: null
  };

  /* componentWillMount() {
    console.log('Component Will Mount Prop: ', this.props);
  } */

  componentDidMount() {
    const aircraftService = this.props.app.service('aircraft');
    const frequenciesService = this.props.app.service('frequencies');
    aircraftService.on('created', this.props.addAircraft);
    frequenciesService.on('created', this.props.addFrequency);
    // setImmediate(() => this.scrollToBottom());
  }

  /* componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  } */

  componentWillUnmount() {
    this.props.app.service('aircraft').removeListener('created', this.props.addAircraft);
    this.props.app.service('frequencies').removeListener('created', this.props.addFrequency);
  }

  handleSubmit = async event => {
    event.preventDefault();

    try {
      const itemToAdd = {
        name: this.state.itemName,
        exercise: this.exerciseInput.value
      };
      await this.props.app.service(this.state.toggleButtonValue).create(itemToAdd);
      this.setState({
        itemName: '',
        error: false
      });
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message || false });
    }
  };

  /* scrollToBottom() {
    this.exerciseList.current.scrollTop = this.exerciseList.current.scrollHeight;
  } */

  handleToggle(e) {
    this.setState({ toggleButtonValue: e });
  }

  render() {
    const { exercise, aircraft, frequencies } = this.props;
    const { error } = this.state;

    const styles = require('./Frequency.scss');

    let itemType = aircraft;
    // let patchItem = this.props.patchAirplane;
    if (this.state.toggleButtonValue === 'aircraft') {
      itemType = aircraft;
      // patchItem = this.props.patchAirplane;
    } else {
      itemType = frequencies;
      // patchItem = this.props.patchFrequency;
    }
    console.log(itemType);
    let content;
    if (!exercise._id) {
      content = <NotFound />;
    } else {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper)}>
            <h1 className="text-center">{exercise.text}</h1>
            <ToggleButtonGroup
              type="radio"
              name="aircraftfreqlisttoggle"
              value={this.state.toggleButtonValue}
              onChange={this.handleToggle}
            >
              <ToggleButton value="aircraft">Aircraft</ToggleButton>
              <ToggleButton value="frequencies">Frequencies</ToggleButton>
            </ToggleButtonGroup>
            <div>TODO: ToggleButtonGroup for locations</div>
            <ListGroup>
              {aircraft.log.map(logItem => (
                <LogItem
                  key={logItem.date}
                  styles={styles}
                  // location
                  status={logItem.status}
                  date={logItem.date}
                  patchLog={this.patchLog}
                />
              ))}
            </ListGroup>

            <form onSubmit={this.handleSubmit}>
              <label htmlFor={`add-${this.state.toggleButtonValue}`}>
                <em>Add {this.state.toggleButtonValue}</em>{' '}
              </label>
              <div className={cn('input-group', { 'has-error': error })}>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder={`${this.state.toggleButtonValue} name`}
                  value={this.state.itemName}
                  onChange={event => this.setState({ itemName: event.target.value })}
                />
                <input
                  type="hidden"
                  name="exercise"
                  value={exercise._id}
                  ref={input => {
                    this.exerciseInput = input;
                  }}
                />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button" onClick={this.handleSubmit}>
                    Add
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      );
    }
    return content;
  }
}
