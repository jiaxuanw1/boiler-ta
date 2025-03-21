import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormControlElement, Homework } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';

interface CreateHomeworkFormProps {
  show: boolean;
  courseOfferingId: number;
  onClose: () => void;
  onSave: () => void;
}

const CreateHomeworkForm = ({ show, courseOfferingId, onClose, onSave }: CreateHomeworkFormProps) => {
  const [homeworkState, setHomeworkState] = useState<Homework>({
    id: -1, // id doesn't matter since it won't be used during creation
    hw_name: "",
    course_offering: courseOfferingId
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setHomeworkState(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  };


  const handleCreateHomework = async (homework: Homework) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/homeworks/`, homework);
      console.log(response);
    } catch (error) {
      console.error("Error creating homework:", error);
    }
  };


  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create New Homework</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Homework Name</Form.Label>
            <Form.Control name="hw_name" type="text" value={homeworkState.hw_name} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          className="mx-2" 
          variant="primary" 
          onClick={async () => {
            await handleCreateHomework(homeworkState);
            onSave();
          }}>
          Create Homework
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateHomeworkForm;