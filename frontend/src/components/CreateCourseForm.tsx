import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Course } from '../types';

interface CreateCourseFormProps {
  show: boolean;
  handleCancel: () => void;
  handleCreateCourse: (course: Course) => void;
}

const CreateCourseForm = ({ show, handleCancel, handleCreateCourse }: CreateCourseFormProps) => {
  const [course, setCourse] = useState<Course>({
    id: -1, // id doesn't matter since it won't be used when creating course
    dept: "",
    number: "",
    title: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setCourse(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  }

  return (
    <Modal
      show={show}
      onHide={handleCancel}
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
              <Form.Control name="dept" type="text" onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Number</Form.Label>
              <Form.Control name="number" type="text" onChange={handleChange} />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Course Title</Form.Label>
            <Form.Control name="title" type="text" onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="mx-2"
          variant="primary"
          onClick={() => handleCreateCourse(course)}
        >
          Create Course
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateCourseForm