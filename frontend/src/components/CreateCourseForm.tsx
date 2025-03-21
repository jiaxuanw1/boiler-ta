import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Course, FormControlElement } from '../types';
import { API_BASE_URL } from '../api';
import axios from 'axios';

interface CreateCourseFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CreateCourseForm = ({ show, onClose, onSave }: CreateCourseFormProps) => {
  const [courseState, setCourseState] = useState<Course>({
    id: -1, // id doesn't matter since it won't be used during creation
    dept: "",
    number: "",
    title: ""
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setCourseState(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  };


  const handleCreateCourse = async (course: Course) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/courses/`, course);
      console.log(response);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };


  return (
    <Modal show={show} onHide={onClose} backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Course</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Department</Form.Label>
              <Form.Control name="dept" type="text" value={courseState.dept} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Number</Form.Label>
              <Form.Control name="number" type="text" value={courseState.number} onChange={handleChange} />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Course Title</Form.Label>
            <Form.Control name="title" type="text" value={courseState.title} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          className="mx-2" 
          variant="primary" 
          onClick={async () => {
            await handleCreateCourse(courseState);
            onSave();
          }}
        >
          Create Course
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateCourseForm;