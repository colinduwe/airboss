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
import ExerciseEdition from 'components/ExerciseDetail/ExerciseEdition';
import uuid from 'uuid/v4';
import { withRouter } from 'react-router-dom';

@provideHooks({
  fetch: async ({ store: { inject } }) => {
    inject({ exercise: exerciseReducer, aircraft: aircraftReducer, frequency: frequencyReducer });
  }
})
@connect(
  state => ({
    user: state.auth.user
  }),
  { ...exerciseActions, ...aircraftActions, ...frequencyActions }
)
@withApp
@withRouter
export default class ExerciseAddFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    /* user: PropTypes.shape({
      email: PropTypes.string
    }), */
    addAircraft: PropTypes.func.isRequired,
    addFrequency: PropTypes.func.isRequired,
    addExercise: PropTypes.func.isRequired,
    // selectExercise: PropTypes.func.isRequired,
    patchAirplane: PropTypes.func.isRequired,
    patchFrequency: PropTypes.func.isRequired,
    exercise: PropTypes.objectOf(PropTypes.any),
    aircraft: PropTypes.arrayOf(PropTypes.object),
    frequencies: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    exercise: {
      text: '',
      locations: [
        {
          _id: uuid(),
          name: 'Location 1'
        }
      ]
    },
    aircraft: [],
    frequencies: []
  };

  /* constructor(props, context) {
    super(props, context);

  } */

  state = {
    error: null
  };

  componentDidMount() {
    const exercisesService = this.props.app.service('exercises');
    const aircraftService = this.props.app.service('aircraft');
    const frequenciesService = this.props.app.service('frequencies');
    exercisesService.on('created', this.props.addExercise);
    aircraftService.on('created', this.props.addAircraft);
    frequenciesService.on('created', this.props.addFrequency);
  }

  /* componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  } */

  componentWillUnmount() {
    this.props.app.service('exercises').removeListener('created', this.props.addExercise);
    this.props.app.service('aircraft').removeListener('created', this.props.addAircraft);
    this.props.app.service('frequencies').removeListener('created', this.props.addFrequency);
  }

  addExercise = async (id, exercise) => {
    try {
      const createdExercise = await this.props.app.service('exercises').create(exercise);
      this.setState({
        error: false
      });
      this.props.history.push(`/event/${createdExercise._id}/`);
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message || false });
    }
  };

  render() {
    const { exercise, aircraft, frequencies } = this.props;
    const { error } = this.state;

    const styles = require('./ExerciseAdd.scss');

    return (
      <div className="container">
        <div className={cn('row', styles.eventWrapper, { 'has-error': error })}>
          <ExerciseEdition
            exercise={exercise}
            aircraft={aircraft}
            frequencies={frequencies}
            patchExercise={this.addExercise}
            patchAirplane={this.props.patchAirplane}
            patchFrequency={this.props.patchFrequency}
            styles={styles}
            stopEdit={() => {}}
            navBack={() => {
              this.props.history.push('/events/');
            }}
          />
        </div>
      </div>
    );
  }
}
