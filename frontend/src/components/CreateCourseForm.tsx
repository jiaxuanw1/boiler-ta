import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Course, FormControlElement } from '../types';

interface CreateCourseFormProps {
  show: boolean;
  handleClose: () => void;
  handleCreateCourse: (course: Course) => void;
}

const CreateCourseForm = ({ show, handleClose, handleCreateCourse }: CreateCourseFormProps) => {
  const [course, setCourse] = useState<Course>({
    id: -1, // id doesn't matter since it won't be used during creation
    dept: "",
    number: "",
    title: ""
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setCourse(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Course</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Department</Form.Label>
              <Form.Control name="dept" type="text" value={course.dept} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Number</Form.Label>
              <Form.Control name="number" type="text" value={course.number} onChange={handleChange} />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Course Title</Form.Label>
            <Form.Control name="title" type="text" value={course.title} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button className="mx-2" variant="primary" onClick={() => handleCreateCourse(course)}>
          Create Course
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateCourseForm;