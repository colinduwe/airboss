import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';
import moment from 'moment';
import cn from 'classnames';

const LogItem = ({ status, date, styles }) => {
  const statusStyleClass = status ? styles.upText : styles.downText;

  return (
    <ListGroupItem className="media" key={date}>
      <div className={cn('media-body', statusStyleClass)}>
        <span className="status">{status ? 'up' : 'down'}</span>
        <span>{moment(date).format('HH:mm (M/D)')}</span>
      </div>
    </ListGroupItem>
  );
};

LogItem.propTypes = {
  status: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    upText: PropTypes.string,
    downText: PropTypes.string
  }).isRequired
};

export default LogItem;
