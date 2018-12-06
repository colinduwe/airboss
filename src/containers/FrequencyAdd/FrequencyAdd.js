import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import exerciseReducer, * as exerciseActions from 'redux/modules/exercise';
import aircraftReducer, * as aircraftActions from 'redux/modules/aircraft';
import frequencyReducer, * as frequencyActions from 'redux/modules/frequency';
import { withApp } from 'hoc';
// import ExerciseDetail from 'components/ExerciseDetail/ExerciseDetail';
import FrequencyEdition from 'components/Frequency/FrequencyEdition';
// import uuid from 'uuid/v4';
import { withRouter } from 'react-router-dom';

@provideHooks({
  fetch: async ({ store: { inject } }) => {
    inject({ exercise: exerciseReducer, aircraft: aircraftReducer, frequency: frequencyReducer });
  }
})
@connect(
  state => ({
    user: state.auth.user,
    exercise: state.exercise.exercise,
    exercises: state.exercise.exercises
  }),
  { ...exerciseActions, ...aircraftActions, ...frequencyActions }
)
@withApp
@withRouter
export default class FrequencyAddFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    /* user: PropTypes.shape({
      email: PropTypes.string
    }), */
    // addAircraft: PropTypes.func.isRequired,
    // addFrequency: PropTypes.func.isRequired,
    // addExercise: PropTypes.func.isRequired,
    // selectExercise: PropTypes.func.isRequired,
    // patchAirplane: PropTypes.func.isRequired,
    // patchFrequency: PropTypes.func.isRequired,
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    frequency: PropTypes.objectOf(PropTypes.any),
    // frequencies: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    frequency: {
      name: '',
      exercise: {},
      lowerBound: 0,
      upperBound: 0,
      spreadSpectrum: false,
      status: false,
      log: []
    }
  };

  /* constructor(props, context) {
    super(props, context);

  } */

  state = {
    error: null
  };

  // Don't need to watch for api events
  /* componentDidMount() {
    const exercisesService = this.props.app.service('exercises');
    const aircraftService = this.props.app.service('aircraft');
    const frequenciesService = this.props.app.service('frequencies');
    exercisesService.on('created', this.props.addExercise);
    aircraftService.on('created', this.props.addAircraft);
    frequenciesService.on('created', this.props.addFrequency);
  } */

  /* componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  } */
  // Don't need to watch for api events
  /* componentWillUnmount() {
    this.props.app.service('exercises').removeListener('created', this.props.addExercise);
    this.props.app.service('aircraft').removeListener('created', this.props.addAircraft);
    this.props.app.service('frequencies').removeListener('created', this.props.addFrequency);
  } */

  addFrequency = async (id, frequency) => {
    try {
      await this.props.app.service('frequencies').create(frequency);
      this.setState({
        error: false
      });
      this.props.history.push(`/event/${frequency.exercise._id}/edit/`);
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message || false });
    }
  };

  render() {
    const { exercise, frequency } = this.props;
    const { error } = this.state;

    const styles = require('./FrequencyAdd.scss');
    console.log(exercise);

    return (
      <div className="container">
        <div className={cn('row', styles.eventWrapper, { 'has-error': error })}>
          <FrequencyEdition
            exercise={exercise}
            frequency={frequency}
            patchFrequency={this.addFrequency}
            styles={styles}
            stopEdit={() => {
              this.props.history.push(`/event/${exercise._id}/`);
            }}
            navBack={() => {
              this.props.history.push(`/event/${exercise._id}/`);
            }}
            action="Add"
            title="Frequency"
          />
        </div>
      </div>
    );
  }
}
