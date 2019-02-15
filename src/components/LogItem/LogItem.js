import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Button } from 'react-bootstrap';
import moment from 'moment';
import cn from 'classnames';

const LogItem = ({
  item, startEdit, label, styles
}) => {
  const statusStyleClass = item.status ? styles.upText : styles.downText;
  const status = item.status ? 'Up' : 'Down';
  const dateString = moment(item.date).format('(M/D)');

  return (
    <ListGroupItem className="media" key={item._id}>
      <div className={cn('media-body', statusStyleClass)}>
        <span className={cn(statusStyleClass)}>{`${label} - ${status} ${item.time} ${dateString}   `}</span>
        <span>
          <Button
            onClick={() => startEdit(item)}
            style={{ cursor: 'pointer' }}
            className="glyphicon glyphicon-pencil"
          />
        </span>
      </div>
    </ListGroupItem>
  );
};

LogItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  startEdit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    upText: PropTypes.string,
    downText: PropTypes.string
  }).isRequired
};

export default LogItem;
