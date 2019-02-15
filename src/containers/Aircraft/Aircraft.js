import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import uuid from 'uuid/v4';
import aircraftReducer, * as aircraftActions from 'redux/modules/aircraft';
import { withApp } from 'hoc';
import NotFound from 'containers/NotFound/NotFound';
import AircraftDetailView from 'components/Aircraft/AircraftDetailView';
import AircraftEdition from 'components/Aircraft/AircraftEdition';

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
      lowerBound: 0,
      upperBound: 0,
      spreadSpectrum: false,
      status: false,
      log: []
    }
  };

  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.editLogEntry = this.editLogEntry.bind(this);
    this.cancelLogEdit = this.cancelLogEdit.bind(this);
    this.addLogEntry = this.addLogEntry.bind(this);
    this.patchLogEntry = this.patchLogEntry.bind(this);
    this.deleteLogEntry = this.deleteLogEntry.bind(this);
  }

  state = {
    itemName: '',
    // error: null
    mode: this.props.match.path === '/aircraft/add' ? 'add' : 'view', // view edit add
    logEdition: this.props.aircraft.log.map(entry => {
      entry.inEdit = false;
      return entry;
    })
  };

  componentDidMount() {
    const aircraftService = this.props.app.service('aircraft');
    aircraftService.on('created', this.props.addAircraft);
  }

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

  editLogEntry(item) {
    const newLog = this.state.logEdition.reduce((result, entry) => {
      if (entry._id === item._id) {
        entry.inEdit = true;
      } else {
        entry.inEdit = false;
      }
      if (!entry.addedEntry) {
        result.push(entry);
      }
      return result;
    }, []);
    this.setState({ logEdition: newLog });
  }

  cancelLogEdit() {
    const newLog = this.state.logEdition.reduce((result, entry) => {
      entry.inEdit = false;
      if (!entry.addedEntry) {
        result.push(entry);
      }
      return result;
    }, []);
    this.setState({ logEdition: newLog });
  }

  addLogEntry() {
    const newLog = this.state.logEdition.reduce((result, entry) => {
      entry.inEdit = false;
      if (!entry.addedEntry) {
        result.push(entry);
      }
      return result;
    }, []);
    const pushedLog = newLog.concat({
      _id: uuid(),
      status: null,
      date: null,
      time: null,
      inEdit: true,
      addedEntry: true
    });
    this.setState({ logEdition: pushedLog });
  }

  // TODO: Refactor to ensure valid data
  async patchLogEntry(item) {
    const patchedLog = this.state.logEdition.reduce((result, entry) => {
      if (entry._id === item._id) {
        entry = item;
      }
      result.push({
        _id: entry._id,
        status: entry.status,
        date: entry.date,
        time: entry.time
      });
      return result;
    }, []);
    await this.props.patchAirplane(this.props.aircraft._id, { log: patchedLog });
    const logEdition = this.props.aircraft.log.map(entry => {
      entry.inEdit = false;
      return entry;
    });
    this.setState({ logEdition });
  }

  async deleteLogEntry(item) {
    // const origLog = this.props.aircraft.log;
    const deletedLogEdition = this.state.logEdition.filter(entry => entry._id !== item._id);
    this.setState({ logEdition: deletedLogEdition });
    const deletedLog = this.props.aircraft.log.filter(entry => entry._id !== item._id);
    await this.props.patchAirplane(this.props.aircraft._id, { log: deletedLog });
  }

  render() {
    const { aircraft, exercise, patchAirplane } = this.props;
    const { error } = this.state;

    const styles = require('./Aircraft.scss');

    let content;
    if (this.state.mode === 'edit' && exercise._id) {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper, { 'has-error': error })}>
            <AircraftEdition
              exercise={exercise}
              aircraft={aircraft}
              patchAirplane={patchAirplane}
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
            <AircraftDetailView
              aircraft={aircraft}
              startEdit={this.startEdit}
              editLogEntry={this.editLogEntry}
              logEdition={this.state.logEdition}
              addLogEntry={this.addLogEntry}
              patchLogEntry={this.patchLogEntry}
              deleteLogEntry={this.deleteLogEntry}
              patchAirplane={patchAirplane}
              exercise={exercise}
              styles={styles}
            />
          </div>
        </div>
      );
    }
    return content;
  }
}
