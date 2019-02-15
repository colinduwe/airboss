import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import cn from 'classnames';
import uuid from 'uuid/v4';
import frequencyReducer, * as frequencyActions from 'redux/modules/frequency';
import { withApp } from 'hoc';
import NotFound from 'containers/NotFound/NotFound';
import FrequencyDetailView from 'components/Frequency/FrequencyDetailView';
import FrequencyEdition from 'components/Frequency/FrequencyEdition';

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject }, params: { id } }) => {
    inject({ frequency: frequencyReducer });

    const state = getState();

    if (state.online && id) {
      return dispatch(frequencyActions.get(id));
    }
  }
})
@connect(
  state => ({
    exercise: state.exercise.exercise,
    frequency: state.frequency.frequencySelected
  }),
  { ...frequencyActions }
)
@withApp
export default class FrequencyFeathers extends Component {
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
    addFrequency: PropTypes.func.isRequired,
    patchFrequency: PropTypes.func.isRequired,
    frequency: PropTypes.objectOf(PropTypes.any)
  };

  static defaultProps = {
    // user: null
    frequency: {
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
    this.addLogEntry = this.addLogEntry.bind(this);
  }

  state = {
    itemName: '',
    // error: null
    mode: this.props.match.path === '/frequency/add' ? 'add' : 'view', // view edit add
    logEditNewItem: false
  };

  /* componentWillMount() {
    console.log('Component Will Mount Prop: ', this.props);
  } */

  componentDidMount() {
    const frequenciesService = this.props.app.service('frequencies');
    frequenciesService.on('created', this.props.addFrequency);
    // setImmediate(() => this.scrollToBottom());
  }

  /* componentDidUpdate(prevProps) {
    if (prevProps.exercises.length !== this.props.exercises.length) {
      this.scrollToBottom();
    }
  } */

  componentWillUnmount() {
    this.props.app.service('frequencies').removeListener('created', this.props.addFrequency);
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

  async addLogEntry() {
    const pushedLog = this.props.frequency.log.concat({ _id: uuid(), status: false, date: null });
    await this.props.patchFrequency(this.props.frequency._id, { log: pushedLog });
    this.setState({ logEditNewItem: true });
  }

  render() {
    const { frequency, exercise, patchFrequency } = this.props;
    const { error, logEditNewItem } = this.state;

    const styles = require('./Frequency.scss');

    let content;
    if (this.state.mode === 'edit' && exercise._id) {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper, { 'has-error': error })}>
            <FrequencyEdition
              exercise={exercise}
              frequency={frequency}
              patchFrequency={patchFrequency}
              styles={styles}
              stopEdit={() => {
                this.setState({ mode: 'view' });
              }}
              navBack={() => {
                this.setState({ mode: 'view' });
              }}
              action="Edit"
              title="Frequency"
            />
          </div>
        </div>
      );
    } else if (!frequency._id) {
      content = <NotFound />;
    } else {
      content = (
        <div className="container">
          <div className={cn('row', styles.eventWrapper)}>
            <FrequencyDetailView
              frequency={frequency}
              startEdit={this.startEdit}
              addLogEntry={this.addLogEntry}
              patchFrequency={patchFrequency}
              logEditNewItem={logEditNewItem}
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
