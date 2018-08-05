import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Exercise from './Exercise';
import ExerciseEdition from './ExerciseEdition';

export default class ExerciseItem extends Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    styles: PropTypes.shape({
      controlBtn: PropTypes.string
    }).isRequired,
    patchExercise: PropTypes.func.isRequired,
    exercise: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    user: null
  };

  state = {
    editing: {}
  };

  startEdit = exercise => {
    this.setState({
      editing: {
        ...this.state.editing,
        [exercise._id]: true
      }
    });
  };

  stopEdit = exercise => {
    this.setState({
      editing: {
        ...this.state.editing,
        [exercise._id]: null
      }
    });
  };

  render() {
    const {
      exercise, user, patchExercise, styles
    } = this.props;
    const { editing } = this.state;

    const inEdition = editing[exercise._id];

    return (
      <div className="media" key={exercise._id}>
        <div className="media-body">
          {inEdition ? (
            <ExerciseEdition
              exercise={exercise}
              patchExercise={patchExercise}
              styles={styles}
              stopEdit={this.stopEdit}
            />
          ) : (
            <Exercise exercise={exercise} user={user} styles={styles} startEdit={this.startEdit} />
          )}
        </div>
      </div>
    );
  }
}
