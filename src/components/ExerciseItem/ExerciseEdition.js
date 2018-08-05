import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';

const ExerciseEdition = ({
  exercise, patchExercise, styles, stopEdit
}) => (
  <Form
    initialValues={{
      text: exercise.text
    }}
    onSubmit={async values => {
      await patchExercise(exercise._id, values);
      stopEdit(exercise);
    }}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <h4 className="media-heading">
          {exercise.author ? exercise.author.email : 'Anonymous'}{' '}
          <small>{new Date(exercise.createdAt).toLocaleString()}</small>{' '}
          <button type="submit" className={cn('btn btn-sm btn-link', styles.controlBtn)} tabIndex={0} title="Validate">
            <span className="fa fa-check text-success" aria-hidden="true" />
          </button>
          <button
            className={cn('btn btn-sm btn-link', styles.controlBtn)}
            tabIndex={0}
            title="Cancel"
            onClick={() => stopEdit(exercise)}
            onKeyPress={() => stopEdit(exercise)}
          >
            <span className="fa fa-close text-danger" aria-hidden="true" />
          </button>
        </h4>
        <Field name="text" validate={value => (value ? undefined : 'Required')}>
          {({ input, meta }) => (
            <div className={cn({ 'has-error': meta.error })}>
              <input {...input} type="text" className="form-control input-sm" placeholder="Event Name" />
            </div>
          )}
        </Field>
      </form>
    )}
  />
);

ExerciseEdition.propTypes = {
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired,
  patchExercise: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  stopEdit: PropTypes.func.isRequired
};

export default ExerciseEdition;
