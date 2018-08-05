import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Exercise = ({
  exercise, user, styles, startEdit
}) => (
  <Fragment>
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
    {exercise.text}
  </Fragment>
);

Exercise.propTypes = {
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string
  }),
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired,
  startEdit: PropTypes.func.isRequired
};

Exercise.defaultProps = {
  user: null
};

export default Exercise;
