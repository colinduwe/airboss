import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import reducer, * as exerciseActions from 'redux/modules/exercise';
import * as aircraftActions from 'redux/modules/aircraft';
import { withApp } from 'hoc';
// import ExerciseItem from 'components/ExerciseItem/ExerciseItem';
import { ToggleButton, ToggleButtonGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
// import { socket } from 'app';
import NotFound from 'containers/NotFound/NotFound';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ exercise: reducer });

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
      return Promise.all([
        dispatch(exerciseActions.selectExercise(id)).catch(() => null),
        dispatch(aircraftActions.load()).catch(() => null)
      ]);
    }
  }
})
@connect(
  state => ({
    exercise: state.exercise.exercise
    // user: state.auth.user
  }),
  { ...exerciseActions }
)
@withApp
export default class ExerciseDetailFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    /* user: PropTypes.shape({
      email: PropTypes.string
    }),
    addExercise: PropTypes.func.isRequired,
    patchExercise: PropTypes.func.isRequired,
    selectExercise: PropTypes.func.isRequired, */
    exercise: PropTypes.objectOf(PropTypes.any).isRequired
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

  /* componentDidMount() {
    const service = this.props.app.service('exercises');

    service.on('created', this.props.addExercise);
    setImmediate(() => this.scrollToBottom());
  } */

  /* componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  } */

  /* componentWillUnmount() {
    this.props.app.service('exercises').removeListener('created', this.props.addExercise);
  } */

  handleSubmit = async event => {
    event.preventDefault();

    try {
      console.log(this.state.itemName);
      await this.props.app.service(this.state.toggleButtonValue).create({ name: this.state.itemName });
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
    const { exercise } = this.props;
    const { error } = this.state;

    const styles = require('./ExerciseDetail.scss');

    let content;
    if (Object.keys(exercise).length === 0) {
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
              <ListGroupItem>Item 1</ListGroupItem>
              <ListGroupItem>Item 2</ListGroupItem>
            </ListGroup>

            <form onSubmit={this.handleSubmit}>
              <label htmlFor={`add-${this.state.toggleButtonValue}`}>
                <em>Add {this.state.toggleButtonValue}</em>{' '}
              </label>
              <div className={cn('input-group', { 'has-error': error })}>
                <input
                  type="text"
                  className="form-control"
                  name={`add-${this.state.toggleButtonValue}`}
                  placeholder={`${this.state.toggleButtonValue} name`}
                  value={this.state.itemName}
                  onChange={event => this.setState({ itemName: event.target.value })}
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
