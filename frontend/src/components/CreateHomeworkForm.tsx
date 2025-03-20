import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormControlElement, Homework } from '../types';

interface CreateHomeworkFormProps {
  show: boolean;
  courseOfferingId: number;
  onClose: () => void;
  onCreateHomework: (homework: Homework) => void;
}

const CreateHomeworkForm = ({ show, courseOfferingId, onClose, onCreateHomework }: CreateHomeworkFormProps) => {
  const [homework, setHomework] = useState<Homework>({
    id: -1, // id doesn't matter since it won't be used during creation
    hw_name: "",
    course_offering: courseOfferingId
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setHomework(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Homework</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Homework Name</Form.Label>
            <Form.Control name="hw_name" type="text" value={homework.hw_name} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          className="mx-2" 
          variant="primary" 
          onClick={() => {
            onCreateHomework(homework);
            onClose();
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