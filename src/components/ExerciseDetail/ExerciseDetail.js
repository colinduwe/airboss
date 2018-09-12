import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonGroup, ToggleButton, ListGroup } from 'react-bootstrap';
import cn from 'classnames';
import AircraftFrequencyItem from 'components/AircraftFrequencyItem/AircraftFrequencyItem';

export default class ExerciseDetail extends Component {
  static propTypes = {
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    patchAirplane: PropTypes.func.isRequired,
    patchFrequency: PropTypes.func.isRequired,
    aircraft: PropTypes.arrayOf(PropTypes.object).isRequired,
    frequencies: PropTypes.arrayOf(PropTypes.object).isRequired,
    startEdit: PropTypes.func.isRequired,
    app: PropTypes.objectOf(PropTypes.any).isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleLocationToggle = this.handleLocationToggle.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handelSubmit = this.handleSubmit.bind(this);
  }

  state = {
    toggleButtonValue: 'aircraft',
    toggleLocationValue: '',
    itemName: '',
    error: null
  };

  handleToggle(e) {
    this.setState({ toggleButtonValue: e });
  }
  handleLocationToggle(e) {
    this.setState({ toggleLocationValue: e });
  }
  handleTextChange(e) {
    this.setState({ itemName: e.target.value });
  }
  handleSubmit = async event => {
    event.preventDefault();

    try {
      const itemToAdd = {
        name: this.state.itemName,
        location: this.state.toggleLocationValue,
        exercise: this.exerciseInput.value
      };
      await this.props.app.service(this.state.toggleButtonValue).create(itemToAdd);
      this.setState({
        itemName: '',
        error: false
      });
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message || false });
    }
  };

  render() {
    const {
      exercise, aircraft, frequencies, startEdit
    } = this.props;

    const { toggleButtonValue, error } = this.state;

    const styles = require('./ExerciseDetail.scss');

    let itemType = aircraft;
    let patchItem = this.props.patchAirplane;
    if (toggleButtonValue === 'aircraft') {
      itemType = aircraft;
      patchItem = this.props.patchAirplane;
    } else {
      itemType = frequencies;
      patchItem = this.props.patchFrequency;
    }

    return (
      <div>
        <h1 className="text-center">
          {exercise.text}
          <Fragment>
            {' '}
            <button
              className={cn('btn btn-sm btn-link', styles.controlBtn)}
              tabIndex={0}
              title="Edit"
              onClick={startEdit}
              onKeyPress={startEdit}
            >
              <span className="fa fa-pencil" aria-hidden="true" />
            </button>
          </Fragment>
        </h1>
        <ToggleButtonGroup
          type="radio"
          name="aircraftfreqlisttoggle"
          value={toggleButtonValue}
          onChange={this.handleToggle}
        >
          <ToggleButton value="aircraft">Aircraft</ToggleButton>
          <ToggleButton value="frequencies">Frequencies</ToggleButton>
        </ToggleButtonGroup>
        {toggleButtonValue === 'aircraft' && (
          <div>
            <ToggleButtonGroup
              type="radio"
              name="locationtoggle"
              value={this.state.locationToggleValue}
              onChange={this.handleLocationToggle}
            >
              {exercise.locations.map(loc => (
                <ToggleButton key={loc._id} value={loc._id}>
                  {loc.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        )}
        <ListGroup>
          {itemType.map(item => (
            <AircraftFrequencyItem
              key={item._id}
              thisItem={item}
              status={item.status}
              exercise={exercise}
              patchItem={patchItem}
              aircraftOrFrequency={toggleButtonValue}
            />
          ))}
        </ListGroup>

        <form onSubmit={this.handleSubmit}>
          <label htmlFor={`add-${toggleButtonValue}`}>
            <em>Add {toggleButtonValue}</em>{' '}
          </label>
          <div className={cn('input-group', { 'has-error': error })}>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder={`${toggleButtonValue} name`}
              value={this.state.itemName}
              onChange={this.handleTextChange}
            />
            <input
              type="hidden"
              name="exercise"
              value={exercise._id}
              ref={input => {
                this.exerciseInput = input;
              }}
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.handleSubmit}>
                Add
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
