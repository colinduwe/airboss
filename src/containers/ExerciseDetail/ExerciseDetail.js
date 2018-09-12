import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import exerciseReducer, * as exerciseActions from 'redux/modules/exercise';
import aircraftReducer, * as aircraftActions from 'redux/modules/aircraft';
import frequencyReducer, * as frequencyActions from 'redux/modules/frequency';
import { withApp } from 'hoc';
import ExerciseDetail from 'components/ExerciseDetail/ExerciseDetail';
import ExerciseEdition from 'components/ExerciseDetail/ExerciseEdition';
import NotFound from 'containers/NotFound/NotFound';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ exercise: exerciseReducer, aircraft: aircraftReducer, frequency: frequencyReducer });

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
        dispatch(aircraftActions.load({ exercise: id })).catch(() => null),
        dispatch(frequencyActions.load({ exercise: id })).catch(() => null)
      ]);
    }
  }
})
@connect(
  state => ({
    exercise: state.exercise.exercise,
    user: state.auth.user,
    aircraft: state.aircraft.aircraft,
    frequencies: state.frequency.frequencies
  }),
  { ...exerciseActions, ...aircraftActions, ...frequencyActions }
)
@withApp
export default class ExerciseDetailFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    /* user: PropTypes.shape({
      email: PropTypes.string
    }), */
    addAircraft: PropTypes.func.isRequired,
    addFrequency: PropTypes.func.isRequired,
    patchExercise: PropTypes.func.isRequired,
    // selectExercise: PropTypes.func.isRequired,
    patchAirplane: PropTypes.func.isRequired,
    patchFrequency: PropTypes.func.isRequired,
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    aircraft: PropTypes.arrayOf(PropTypes.object).isRequired,
    frequencies: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    // user: null
  };

  constructor(props, context) {
    super(props, context);

    let edit = '';
    const pathParts = window.location.pathname.split('/');
    [, , , edit] = pathParts;
    if (edit === 'edit') {
      this.state = {
        editing: true
      };
    }
  }

  state = {
    editing: false
  };

  componentDidMount() {
    const aircraftService = this.props.app.service('aircraft');
    const frequenciesService = this.props.app.service('frequencies');
    aircraftService.on('created', this.props.addAircraft);
    frequenciesService.on('created', this.props.addFrequency);
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

  startEdit = () => {
    this.setState({
      editing: true
    });
  };

  stopEdit = () => {
    this.setState({
      editing: false
    });
  };

  render() {
    const { exercise, aircraft, frequencies } = this.props;
    const { editing } = this.state;

    const styles = require('./ExerciseDetail.scss');

    let content;
    if (!exercise._id) {
      content = <NotFound />;
    } else {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper)}>
            {editing ? (
              <ExerciseEdition
                exercise={exercise}
                aircraft={aircraft}
                frequencies={frequencies}
                patchExercise={this.props.patchExercise}
                patchAirplane={this.props.patchAirplane}
                patchFrequency={this.props.patchFrequency}
                styles={styles}
                stopEdit={() => this.stopEdit()}
              />
            ) : (
              <ExerciseDetail
                exercise={exercise}
                aircraft={aircraft}
                frequencies={frequencies}
                patchAirplane={this.props.patchAirplane}
                patchFrequency={this.props.patchFrequency}
                startEdit={() => this.startEdit()}
                app={this.props.app}
              />
            )}
          </div>
        </div>
      );
    }
    return content;
  }
}
