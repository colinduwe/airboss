import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, confirmLogEntry }) => (
  <Modal show={show} onHide={onHide} bsSize="small" aria-labelledby="contained-modal-title-sm">
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-sm">Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Button onClick={confirmLogEntry}>Confirm</Button>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  confirmLogEntry: PropTypes.func.isRequired
};

export default ConfirmModal;
