import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CourseOffering, FormControlElement } from '../types';

interface EditCourseOfferingFormProps {
  offering: CourseOffering;
  onSave: () => void;
}

const EditCourseOfferingForm = ({ offering, onSave }: EditCourseOfferingFormProps) => {
  // Synced with form fields
  const [offeringState, setOfferingState] = useState<CourseOffering>({...offering});

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setOfferingState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleUpdateOffering = async (updatedOffering: CourseOffering) => {
    // make PUT request
    console.log(`update offering:`);
    console.log(updatedOffering);
  };

  const handleDeleteOffering = async (offering_id: number) => {
    // make DELETE request
    console.log(`delete offering: ${offering_id}`);
  };

  
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
        onClick={() => {
          handleUpdateOffering(offeringState);
          onSave();
        }}
      >
        Save
      </Button>

      <Button 
        className="mx-2" 
        variant="danger" 
        onClick={() => {
          handleDeleteOffering(offeringState.id);
          onSave();
        }}
      >
        Delete
      </Button>

    </Form>
  );
}

export default EditCourseOfferingForm;