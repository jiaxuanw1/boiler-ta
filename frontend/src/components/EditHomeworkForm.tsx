import React, { useState } from 'react';
import { FormControlElement, Homework } from '../types';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../api';

interface EditHomeworkFormProps {
  show: boolean;
  homework: Homework;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const EditHomeworkForm = ({ show, homework, onClose, onSave, onDelete }: EditHomeworkFormProps) => {
  // Synced with form fields
  const [homeworkState, setHomeworkState] = useState<Homework>({...homework});
  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setHomeworkState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleUpdateHomework = async (updatedHomework: Homework) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/homeworks/${updatedHomework.id}/`, updatedHomework);
      console.log(response);
    } catch (error) {
      console.error("Error updating homework:", error);
    }
  };

  const handleDeleteHomework = async (homeworkId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/homeworks/${homeworkId}/`)
      console.log(response);
    } catch (error) {
      console.error("Error deleting homework:", error);
    }
  };


  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Homework</Modal.Title>
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
            await handleUpdateHomework(homeworkState);
            onSave();
          }}>
          Save
        </Button>

        <Button 
          className="mx-2" 
          variant="danger" 
          onClick={async () => {
            await handleDeleteHomework(homeworkState.id);
            onDelete();
          }}
        >
          Delete
        </Button>

        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditHomeworkForm;