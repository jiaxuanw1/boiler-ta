import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FormControlElement, TA } from '../types';
import { API_BASE_URL } from '../api';
import axios from 'axios';

interface CreateTAFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CreateTAForm = ({ show, onClose, onSave }: CreateTAFormProps) => {
  const [taState, setTAState] = useState<TA>({
    id: -1, // id doesn't matter since it won't be used during creation
    username: "",
    first: "",
    last: ""
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setTAState(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  };


  const handleCreateTA = async (ta: TA) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tas/`, ta);
      console.log(response);
    } catch (error) {
      console.error("Error adding TA:", error);
      alert(`Error adding TA ${ta.username}: ${ta.last}, ${ta.first}!`);
    }
  };


  return (
    <Modal show={show} onHide={onClose} backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Teaching Assistant</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" type="text" value={taState.username} onChange={handleChange} />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last" type="text" value={taState.last} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Form.Control name="first" type="text" value={taState.first} onChange={handleChange} />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          className="mx-2" 
          variant="primary" 
          onClick={async () => {
            await handleCreateTA(taState);
            onSave();
          }}
        >
          Add TA
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateTAForm;