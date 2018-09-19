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

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ aircraft: aircraftReducer });

    const state = getState();
    let id = '';

    if (state.online) {
      const {
        router: { location }
      } = state;
      if (location != null) {
        const pathParts = location.pathname.split('/');
        [, , id] = pathParts;
      }
      return dispatch(aircraftActions.get(id));
    }
  }
})
@connect(
  state => ({
    aircraft: state.aircraft.aircraftSelected
  }),
  { ...aircraftActions }
)
@withApp
export default class AircraftFeathers extends Component {
  static propTypes = {
    app: PropTypes.shape({
      service: PropTypes.func
    }).isRequired,
    addAircraft: PropTypes.func.isRequired,
    // patchAirplane: PropTypes.func.isRequired,
    aircraft: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    // user: null
  };

  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
  }

  state = {
    itemName: ''
    // error: null
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

  /* startEdit() {
    // alert('startEdit');
  } */

  async patchLog(e) {
    await this.props.app.service(this.state.toggleButtonValue).patch(e);
  }

  render() {
    const { aircraft } = this.props;
    // const { error } = this.state;

    const styles = require('./Aircraft.scss');

    let content;
    if (!aircraft._id) {
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
                  <span className="fa fa-pencil" aria-hidden="true" />
                </button>
              </Fragment>
            </h1>
            <h3 className="text-center">TODO: Assigned to location</h3>
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
