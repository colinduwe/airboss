import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
// import { FieldArray } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import cn from 'classnames';

const AircraftFrequencyEdition = ({
  aircraftFrequency,
  exercise,
  patchAircraftFrequency,
  styles,
  stopEdit,
  navBack,
  title,
  action
}) => {
  const locIndex = exercise.locations.findIndex(loc => loc._id === aircraftFrequency.location._id);
  const initLocIndex = locIndex !== -1 ? locIndex : 0;
  return (
    <div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header" style={{ paddingLeft: '10px' }}>
            <Button className="btn btn-default navbar-btn pull-left" onClick={navBack}>
              <span className="glyphicon glyphicon-chevron-left" />
            </Button>
            <div className="navbar-text navbar-brand-centered">
              <h3 className={cn(styles.navbarEventTitle)}>
                {action} {title}
              </h3>
            </div>
          </div>
        </div>
      </nav>
      <Form
        initialValues={{
          name: aircraftFrequency.name,
          exercise: exercise._id,
          locationIndex: initLocIndex
        }}
        onSubmit={async values => {
          values.location = exercise.locations[values.locationIndex];
          await patchAircraftFrequency(aircraftFrequency._id, values);
          stopEdit(aircraftFrequency);
        }}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit, pristine, invalid, form
        }) => (
          <form onSubmit={handleSubmit}>
            <label>{`${title} Name`}</label>
            <Field name="name" validate={value => (value ? undefined : 'Required')}>
              {({ input, meta }) => (
                <div className={cn({ 'has-error': meta.error })}>
                  <input {...input} type="text" className="form-control input-sm" placeholder={`${title} Name`} />
                </div>
              )}
            </Field>
            <div>
              <label>Exercise: </label>
              <span>{exercise.text}</span>
            </div>
            <label>Location</label>
            <Field name="locationIndex" component="select">
              {exercise.locations.map((option, index) => (
                <option value={index} key={option._id}>
                  {option.name}
                </option>
              ))}
            </Field>
            <div>
              <button type="submit" disabled={pristine || invalid} className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

AircraftFrequencyEdition.propTypes = {
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired,
  aircraftFrequency: PropTypes.objectOf(PropTypes.any).isRequired,
  patchAircraftFrequency: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  stopEdit: PropTypes.func.isRequired,
  navBack: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default AircraftFrequencyEdition;
