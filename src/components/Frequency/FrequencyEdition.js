import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
// import { FieldArray } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import cn from 'classnames';

const FrequencyEdition = ({
  frequency, exercise, patchFrequency, styles, stopEdit, navBack, title, action
}) => (
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
        name: frequency.name,
        exercise: exercise._id,
        lowerBound: frequency.lowerBound,
        upperBound: frequency.upperBound,
        spreadSpectrum: frequency.spreadSpectrum
      }}
      onSubmit={async values => {
        await patchFrequency(frequency._id, values);
        stopEdit(frequency);
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
          <label>Lower Bound</label>
          <Field name="lowerBound" validate={value => (value ? undefined : 'Required')}>
            {({ input, meta }) => (
              <div className={cn('input-group', { 'has-error': meta.error })}>
                <input {...input} type="number" className="form-control input-sm" placeholder="0" />
                <div className="input-group-addon">
                  <span className="input-group-text">MHz</span>
                </div>
              </div>
            )}
          </Field>
          <label>Upper Bound</label>
          <Field name="upperBound" validate={value => (value ? undefined : 'Required')}>
            {({ input, meta }) => (
              <div className={cn('input-group', { 'has-error': meta.error })}>
                <input {...input} type="number" className="form-control input-sm" placeholder="0" />
                <div className="input-group-addon">
                  <span className="input-group-text">MHz</span>
                </div>
              </div>
            )}
          </Field>
          <label>Spread Spectrum</label>
          <Field name="spreadSpectrum" component="input" type="checkbox" />
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

FrequencyEdition.propTypes = {
  styles: PropTypes.shape({
    controlBtn: PropTypes.string
  }).isRequired,
  frequency: PropTypes.objectOf(PropTypes.any).isRequired,
  patchFrequency: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  stopEdit: PropTypes.func.isRequired,
  navBack: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default FrequencyEdition;
