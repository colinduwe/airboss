import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
// import { BrowserRouter, Route } from 'react-router-dom';

export default class Exercise extends React.Component {
  static propTypes = {
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    styles: PropTypes.shape({
      controlBtn: PropTypes.string
    }).isRequired,
    startEdit: PropTypes.func.isRequired,
    selectExercise: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: null
  };

  static contextTypes = {
    router: PropTypes.object
  };

  redirectToTarget(id) {
    this.context.router.history.push(`/event/${id}`);
  }

  render() {
    const {
      exercise, user, styles, startEdit, selectExercise
    } = this.props;
    return (
      <div>
        <h4 className="media-heading">
          {exercise.author ? exercise.author.email : 'Anonymous'}
          <small>{new Date(exercise.createdAt).toLocaleString()}</small>
          {user && exercise.author && user._id === exercise.author._id ? (
            <Fragment>
              {' '}
              <button
                className={cn('btn btn-sm btn-link', styles.controlBtn)}
                tabIndex={0}
                title="Edit"
                onClick={() => startEdit(exercise)}
                onKeyPress={() => startEdit(exercise)}
              >
                <span className="fa fa-pencil" aria-hidden="true" />
              </button>
            </Fragment>
          ) : null}
        </h4>
        <button
          onClick={async () => {
            await selectExercise(exercise._id);
            this.redirectToTarget(exercise._id);
          }}
        >
          {exercise.text}
        </button>
      </div>
    );
  }
}
