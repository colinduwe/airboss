import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import cn from 'classnames';
import LogItemField from 'components/LogItem/LogItemField';

const FrequencyDetailView = ({
  frequency,
  patchFrequency,
  styles,
  startEdit,
  addLogEntry,
  logEditNewItem,
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
      {frequency.log.map((logItem, index) => {
        let inEdit = false;
        if (logEditNewItem && index === frequency.log.length - 1) {
          inEdit = true;
        }
        return (
          <LogItemField
            key={logItem._id}
            logItem={logItem}
            label={frequency.name}
            indexKey={index}
            logEditNewItem={inEdit}
            styles={styles}
            parent={frequency}
            patchParent={patchFrequency}
            exercise={exercise}
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
  addLogEntry: PropTypes.func.isRequired,
  logEditNewItem: PropTypes.bool.isRequired,
  styles: PropTypes.shape({
    navbarEventTitle: PropTypes.string,
    inlineBlock: PropTypes.string
  }).isRequired
};

export default FrequencyDetailView;
