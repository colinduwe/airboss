import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import aircraftReducer, * as aircraftActions from 'redux/modules/aircraft';
// import frequencyReducer, * as frequencyActions from 'redux/modules/frequency';
import { withApp } from 'hoc';
import LogItem from 'components/LogItem/LogItem';
import { Button, ListGroup } from 'react-bootstrap';
// import { socket } from 'app';
import NotFound from 'containers/NotFound/NotFound';
import AircraftFrequencyEdition from 'components/AircraftFrequencyItem/AircraftFrequencyEdition';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject }, params: { id } }) => {
    inject({ aircraft: aircraftReducer });

    const state = getState();

    if (state.online && id) {
      return dispatch(aircraftActions.get(id));
    }
  }
})
@connect(
  state => ({
    exercise: state.exercise.exercise,
    aircraft: state.aircraft.aircraftSelected,
    user: state.auth.user
  }),
  { ...aircraftActions }
)
@withApp
export default class AircraftFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    /* user: PropTypes.shape({
      _id: PropTypes.string
    }).isRequired, */
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
    exercise: PropTypes.objectOf(PropTypes.any).isRequired,
    addAircraft: PropTypes.func.isRequired,
    patchAirplane: PropTypes.func.isRequired,
    aircraft: PropTypes.objectOf(PropTypes.any)
  };

  static defaultProps = {
    // user: null
    aircraft: {
      name: '',
      sentBy: '',
      createdAt: new Date(),
      exercise: null,
      location: null,
      status: false,
      log: []
    }
  };

  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
    this.startEdit = this.startEdit.bind(this);
  }

  state = {
    itemName: '',
    // error: null
    mode: this.props.match.path === '/aircraft/add' ? 'add' : 'view' // view edit add
  };

  /* componentWillMount() {
    console.log('Component Will Mount Prop: ', this.props);
  } */

  componentDidMount() {
    const aircraftService = this.props.app.service('aircraft');
    aircraftService.on('created', this.props.addAircraft);
    // setImmediate(() => this.scrollToBottom());
  }

  /* componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  } */

  componentWillUnmount() {
    this.props.app.service('aircraft').removeListener('created', this.props.addAircraft);
  }

  handleSubmit = async event => {
    event.preventDefault();

    try {
      const itemToAdd = {
        name: this.state.itemName,
        exercise: this.exerciseInput.value
      };
      await this.props.app.service(this.state.toggleButtonValue).create(itemToAdd);
      this.setState({
        itemName: ''
        // error: false
      });
    } catch (error) {
      console.log(error);
      // this.setState({ error: error.message || false });
    }
  };

  /* scrollToBottom() {
    this.exerciseList.current.scrollTop = this.exerciseList.current.scrollHeight;
  } */

  handleToggle(e) {
    this.setState({ toggleButtonValue: e });
  }

  startEdit() {
    this.setState({ mode: 'edit' });
  }

  async patchLog(e) {
    await this.props.app.service(this.state.toggleButtonValue).patch(e);
  }

  render() {
    const { aircraft, exercise } = this.props;
    const { error } = this.state;

    const styles = require('./Aircraft.scss');

    let content;
    if (this.state.mode === 'edit' && exercise._id) {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper, { 'has-error': error })}>
            <AircraftFrequencyEdition
              exercise={exercise}
              aircraftFrequency={aircraft}
              patchAircraftFrequency={this.props.patchAirplane}
              styles={styles}
              stopEdit={() => {
                this.setState({ mode: 'view' });
              }}
              navBack={() => {
                this.setState({ mode: 'view' });
              }}
              action="Edit"
              title="Aircraft"
            />
          </div>
        </div>
      );
    } else if (!aircraft._id) {
      content = <NotFound />;
    } else {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper)}>
            <h1 className="text-center">
              {aircraft.name}
              <Fragment>
                {' '}
                <button
                  className={cn('btn btn-sm btn-link', styles.controlBtn)}
                  tabIndex={0}
                  title="Edit"
                  onClick={this.startEdit}
                  onKeyPress={this.startEdit}
                >
                  <span className="fa fa-cogs" aria-hidden="true" />
                </button>
              </Fragment>
            </h1>
            <h3 className="text-center">{`Assigned to ${aircraft.location.name}`}</h3>
            <ListGroup>
              {aircraft.log.map(logItem => (
                <LogItem
                  key={logItem.date}
                  styles={styles}
                  // location
                  status={logItem.status}
                  date={logItem.date}
                  patchLog={this.patchLog}
                />
              ))}
            </ListGroup>

            <Button
              className="btn"
              tabIndex={0}
              title="Add Log Entry"
              onClick={() => {
                alert('add log entry');
              }}
              onKeyPress={() => {
                alert('add log entry');
              }}
            >
              TODO: Add log entry
            </Button>
            <div className="note">
              If you add a log entry that is newer than the last entry that aircraft's state will automatically chnage
              to the latest log entry's state.
            </div>
          </div>
        </div>
      );
    }
    return content;
  }
}