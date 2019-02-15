import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import cn from 'classnames';
import LogItem from 'components/LogItem/LogItem';
import LogEdition from 'components/LogItem/LogEdition';

const FrequencyDetailView = ({
  frequency,
  patchFrequency,
  styles,
  startEdit,
  editLogEntry,
  logEdition,
  addLogEntry,
  patchLogEntry,
  deleteLogEntry,
  exercise
}) => (
  <div>
    <h1 className="text-center">
      {frequency.name}
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
    <h3 className="text-center">{`${frequency.lowerBound} - ${frequency.upperBound} MHz`}</h3>
    {frequency.spreadSpectrum && <h3 className="text-center">Spread Spectrum</h3>}
    <ListGroup>
      {logEdition.map((logItem, index) => {
        if (logItem.inEdit) {
          return (
            <LogEdition
              key={logItem._id}
              item={logItem}
              label={frequency.name}
              patchLogEntry={patchLogEntry}
              deleteLogEntry={deleteLogEntry}
              exercise={exercise}
              styles={styles}
            />
          );
        }
        return (
          <LogItem
            key={logItem._id}
            item={logItem}
            label={frequency.name}
            indexKey={index}
            startEdit={editLogEntry}
            parent={frequency}
            patchParent={patchFrequency}
            exercise={exercise}
            styles={styles}
          />
        );
      })}
    </ListGroup>
    <div className="buttons">
      <button type="button" className="btn btn-primary" onClick={addLogEntry}>
        Add Log Entry
      </button>
    </div>
    <div className="Notification">
      <p>
        If you add a log entry that is newer than the last entry, this frequency's state will automatically change to
        that new entry's state
      </p>
    </div>
  </div>
);

FrequencyDetailView.propTypes = {
  frequency: PropTypes.objectOf(PropTypes.any).isRequired,
  patchFrequency: PropTypes.func.isRequired,
  startEdit: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.any).isRequired,
  editLogEntry: PropTypes.func.isRequired,
  logEdition: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    inEdit: PropTypes.bool.isRequired
  })).isRequired,
  addLogEntry: PropTypes.func.isRequired,
  patchLogEntry: PropTypes.func.isRequired,
  deleteLogEntry: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    navbarEventTitle: PropTypes.string,
    inlineBlock: PropTypes.string
  }).isRequired
};

export default FrequencyDetailView;
