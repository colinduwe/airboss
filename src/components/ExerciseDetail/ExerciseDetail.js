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
    startEdit: PropTypes.func.isRequired
    // app: PropTypes.objectOf(PropTypes.any).isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleLocationToggle = this.handleLocationToggle.bind(this);
    this.patchItem = this.patchItem.bind(this);
    // this.handleTextChange = this.handleTextChange.bind(this);
    // this.handelSubmit = this.handleSubmit.bind(this);
  }

  state = {
    toggleButtonValue: 'aircraft',
    toggleLocationValue: this.props.exercise.locations[0]._id,
    filteredAircraft: this.props.aircraft.filter(item => this.props.exercise.locations[0]._id === item.location._id),
    itemList: this.props.aircraft.filter(item => this.props.exercise.locations[0]._id === item.location._id)
    // patchItem: this.props.patchAirplane
    // error: null
  };

  handleToggle(e) {
    const itemList = e === 'aircraft' ? this.state.filteredAircraft : this.props.frequencies;
    this.setState({
      toggleButtonValue: e,
      itemList
    });
  }
  handleLocationToggle(e) {
    this.setState({
      toggleLocationValue: e,
      filteredAircraft: this.props.aircraft.filter(item => e === item.location._id),
      itemList: this.props.aircraft.filter(item => e === item.location._id)
    });
  }
  patchItem = async (id, data) => {
    if (this.state.toggleButtonValue === 'aircraft') {
      await this.props.patchAirplane(id, data);
      this.setState({
        filteredAircraft: this.props.aircraft.filter(item => this.state.toggleLocationValue === item.location._id)
      });
    } else {
      await this.props.patchFrequency(id, data);
    }
    this.setState({
      itemList: this.props[this.state.toggleButtonValue].filter(item =>
        this.state.toggleLocationValue === item.location._id)
    });
  };
  /*
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
  */

  render() {
    const { exercise, startEdit } = this.props;

    const { toggleButtonValue, toggleLocationValue, itemList } = this.state;

    const styles = require('./ExerciseDetail.scss');

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
              <span className="fa fa-cogs" aria-hidden="true" />
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
              value={toggleLocationValue}
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
          {itemList.map(item => (
            <AircraftFrequencyItem
              key={item._id}
              thisItem={item}
              status={item.status}
              exercise={exercise}
              patchItem={this.patchItem}
              aircraftOrFrequency={toggleButtonValue}
            />
          ))}
        </ListGroup>
      </div>
    );
  }
}
