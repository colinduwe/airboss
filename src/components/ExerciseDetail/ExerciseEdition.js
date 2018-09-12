import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import cn from 'classnames';
import uuid from 'uuid/v4';

const required = value => (value ? undefined : 'Required');

const ExerciseEdition = ({
  exercise, patchExercise, aircraft, frequencies, styles, stopEdit
}) => (
  <div>
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header" style={{ paddingLeft: '10px' }}>
          <Button className="btn btn-default navbar-btn pull-left" onClick={stopEdit}>
            <span className="glyphicon glyphicon-chevron-left" />
          </Button>
          <div className="navbar-text navbar-brand-centered">
            <h3 className={cn(styles.navbarEventTitle)}>Event Settings</h3>
          </div>
        </div>
      </div>
    </nav>
    <Form
      initialValues={{
        text: exercise.text,
        locations: exercise.locations
      }}
      onSubmit={async values => {
        console.log(values);
        await patchExercise(exercise._id, values);
        stopEdit(exercise);
      }}
      mutators={{
        ...arrayMutators
      }}
      render={({
        handleSubmit, pristine, invalid, form
      }) => (
        <form onSubmit={handleSubmit}>
          <label>Event Name</label>
          <Field name="text" validate={value => (value ? undefined : 'Required')}>
            {({ input, meta }) => (
              <div className={cn({ 'has-error': meta.error })}>
                <input {...input} type="text" className="form-control input-sm" placeholder="Event Name" />
              </div>
            )}
          </Field>

          <label>Locations</label>
          <FieldArray name="locations">
            {({ fields }) =>
              fields.map(location => (
                <div key={location}>
                  <Field name={`${location}.name`} component="input" placeholder="Location" validate={required} />
                  <Button
                    onClick={() => fields.remove(location)}
                    style={{ cursor: 'pointer' }}
                    className="glyphicon glyphicon-remove"
                  />
                </div>
              ))
            }
          </FieldArray>
          <div className="buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => form.mutators.push('locations', { _id: uuid(), name: '' })}
            >
              Add Location
            </button>
          </div>
          <div>
            <button type="submit" disabled={pristine || invalid} className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    />
    <h4>Aircraft</h4>
    <ListGroup>{aircraft.map(airplane => <ListGroupItem key={airplane._id}>{airplane.name}</ListGroupItem>)}</ListGroup>
    <h4>Frequencies</h4>
    <ListGroup>
      {frequencies.map(frequency => <ListGroupItem key={frequency._id}>{frequency.name}</ListGroupItem>)}
    </ListGroup>
  </div>
);

ExerciseEdition.propTypes = {
  styles: PropTypes.shape({
    navbarEventTitle: PropTypes.string
  }).isRequired,
  patchExercise: PropTypes.func.isRequired,
  // patchAirplane: PropTypes.func.isRequired,
  // patchFrequency: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  aircraft: PropTypes.arrayOf(PropTypes.object).isRequired,
  frequencies: PropTypes.arrayOf(PropTypes.object).isRequired,
  stopEdit: PropTypes.func.isRequired
};

export default ExerciseEdition;
