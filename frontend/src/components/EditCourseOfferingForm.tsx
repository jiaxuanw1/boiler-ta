import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CourseOffering, FormControlElement } from '../types';

interface EditCourseOfferingFormProps {
  offering: CourseOffering;
  onUpdate: (updatedOffering: CourseOffering) => void;
  onDelete: (id: number) => void;
}

const EditCourseOfferingForm = ({ offering, onUpdate, onDelete }: EditCourseOfferingFormProps) => {
  const [offeringState, setOfferingState] = useState<CourseOffering>({
    id: offering.id,
    course: offering.course,
    semester: offering.semester,
    year: offering.year
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setOfferingState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  
  return (
    <Form>

      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Semester</Form.Label>
          <Form.Select name="semester" value={offeringState.semester} onChange={handleChange}>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Year</Form.Label>
          <Form.Control name="year" type="number" value={offeringState.year} onChange={handleChange} />
        </Form.Group>
      </Row>

      <Button 
        className="mx-2" 
        variant="primary"
        onClick={() => onUpdate(offeringState)}
      >
        Save
      </Button>

      <Button 
        className="mx-2" 
        variant="danger" 
        onClick={() => onDelete(offeringState.id)}
      >
        Delete
      </Button>

    </Form>
  );
}

export default EditCourseOfferingForm;