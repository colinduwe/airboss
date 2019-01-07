import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import cn from 'classnames';
import LogItemField from 'components/LogItem/LogItemField';

const AircraftDetailView = ({
  aircraft, patchAirplane, styles, startEdit, addLogEntry
}) => (
  <div>
    <h1 className="text-center">
      {aircraft.name}
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
    <h3 className="text-center">{`${aircraft.location.name}`}</h3>
    <ListGroup>
      {aircraft.log.map((logItem, index) => {
        console.log(logItem);
        return (
          <LogItemField
            key={logItem._id}
            logItem={logItem}
            label={aircraft.location.name}
            indexKey={index}
            logEditNewItem={logItem.inEdit}
            styles={styles}
            parent={aircraft}
            patchParent={patchAirplane}
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

AircraftDetailView.propTypes = {
  aircraft: PropTypes.objectOf(PropTypes.any).isRequired,
  patchAirplane: PropTypes.func.isRequired,
  startEdit: PropTypes.func.isRequired,
  addLogEntry: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    navbarEventTitle: PropTypes.string,
    inlineBlock: PropTypes.string
  }).isRequired
};

export default AircraftDetailView;
