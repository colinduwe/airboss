import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';
// import { BrowserRouter, Route } from 'react-router-dom';

const Exercise = ({ exercise, styles }) => (
  <div>
    <h4 className="media-heading">
      {exercise.author ? exercise.author.email : 'Anonymous'}
      <small>{new Date(exercise.createdAt).toLocaleString()}</small>
      <Fragment>
        {' '}
        <Link className={cn('btn btn-sm btn-link', styles.controlBtn)} title="Edit" to={`/event/${exercise._id}/edit`}>
          <span className="fa fa-pencil" aria-hidden="true" />
        </Link>
      </Fragment>
    </h4>
    <Link to={`/event/${exercise._id}/`}>{exercise.text}</Link>
  </div>
);

Exercise.propTypes = {
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired
};

export default Exercise;
