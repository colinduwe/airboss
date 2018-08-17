import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import reducer, * as exerciseActions from 'redux/modules/exercise';
import { withApp } from 'hoc';
import ExerciseItem from 'components/ExerciseItem/ExerciseItem';
// import { socket } from 'app';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ exercise: reducer });

    const state = getState();

    if (state.online) {
      return dispatch(exerciseActions.load()).catch(() => null);
    }
  }
})
@connect(
  state => ({
    exercises: state.exercise.exercises,
    user: state.auth.user
  }),
  { ...exerciseActions }
)
@withApp
export default class ExerciseFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    addExercise: PropTypes.func.isRequired,
    patchExercise: PropTypes.func.isRequired,
    selectExercise: PropTypes.func.isRequired,
    exercises: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    user: null
  };

  constructor(props) {
    super(props);
    this.exerciseList = React.createRef();
  }

  state = {
    exercise: '',
    error: null
  };

  componentDidMount() {
    const service = this.props.app.service('exercises');

    service.on('created', this.props.addExercise);
    setImmediate(() => this.scrollToBottom());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    this.props.app.service('exercises').removeListener('created', this.props.addExercise);
  }

  handleSubmit = async event => {
    event.preventDefault();

    try {
      await this.props.app.service('exercises').create({ text: this.state.exercise });
      this.setState({
        exercise: '',
        error: false
      });
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message || false });
    }
  };

  scrollToBottom() {
    this.exerciseList.current.scrollTop = this.exerciseList.current.scrollHeight;
  }

  render() {
    const {
      exercises, user, patchExercise, selectExercise
    } = this.props;
    const { error } = this.state;

    const styles = require('./Exercise.scss');

    return (
      <div className="container">
        <div className={cn('row', styles.eventWrapper)}>
          <div className={cn('col-sm-9', styles.eventColumn)}>
            <h2 className="text-center">Events</h2>

            <div className={styles.events} ref={this.exerciseList}>
              {exercises.map(exercise => (
                <ExerciseItem
                  key={exercise._id}
                  styles={styles}
                  exercise={exercise}
                  user={user}
                  patchExercise={patchExercise}
                  selectExercise={selectExercise}
                />
              ))}
            </div>

            <form onSubmit={this.handleSubmit}>
              <label htmlFor="exercise">
                <em>{user ? user.email : 'Anonymous'}</em>{' '}
              </label>
              <div className={cn('input-group', { 'has-error': error })}>
                <input
                  type="text"
                  className="form-control"
                  name="exercise"
                  placeholder="Your event name here..."
                  value={this.state.exercise}
                  onChange={event => this.setState({ exercise: event.target.value })}
                />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button" onClick={this.handleSubmit}>
                    Send
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
