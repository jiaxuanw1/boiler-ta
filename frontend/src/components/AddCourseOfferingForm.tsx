import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Course, CourseOffering, FormControlElement } from '../types';
import { API_BASE_URL } from '../api';
import axios from 'axios';

interface AddOfferingFormProps {
  show: boolean;
  courses: Course[];
  onClose: () => void;
  onSave: () => void;
}

const AddCourseOfferingForm = ({ show, courses, onClose, onSave }: AddOfferingFormProps) => {
  const date = new Date();
  let currentSem: "Spring" | "Summer" | "Fall" | "Winter";
  if (date.getMonth() < 4) {
    currentSem = "Spring";
  } else if (date.getMonth() < 8) {
    currentSem = "Summer";
  } else if (date.getMonth() < 11) {
    currentSem = "Fall";
  } else {
    currentSem = "Winter";
  }
  const currentYear = date.getFullYear();

  const [offering, setOffering] = useState<CourseOffering>({
    id: -1, // id doesn't matter since it won't be used when during creation
    course: -1,
    semester: currentSem,
    year: currentYear
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setOffering(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleAddOffering = async (offering: CourseOffering) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/course-offerings/`, offering);
      console.log(response);
    } catch (error) {
      console.error("Error creating course offering:", offering);
    }
  };


  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Course Offering</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Select name="course" value={offering.course} onChange={handleChange}>
              <option value={`-1`}></option>
              {courses.map(course => (
                <option key={`course-select-${course.id}`} value={course.id}>
                  {`${course.dept} ${course.number}: ${course.title}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Semester</Form.Label>
              <Form.Select name="semester" value={offering.semester} onChange={handleChange}>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Year</Form.Label>
              <Form.Control name="year" type="number" value={offering.year} onChange={handleChange} />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          className="mx-2" 
          variant="primary" 
          onClick={async () => {
            await handleAddOffering(offering);
            onSave();
          }}
        >
          Add Course Offering
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCourseOfferingForm;