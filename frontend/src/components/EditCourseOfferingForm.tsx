import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CourseOffering, FormControlElement } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';

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
    try {
      const response = await axios.put(`${API_BASE_URL}/api/course-offerings/${updatedOffering.id}/`, updatedOffering)
      alert(`Course offering for ${updatedOffering.semester} ${updatedOffering.year} updated successfully!`);
      console.log(response);
    } catch (error) {
      console.error("Error updating course offering:", error);
    }
  };

  const handleDeleteOffering = async (offering_id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/course-offerings/${offering_id}/`)
      alert(`Course offering deleted successfully!`);
      console.log(response);
    } catch (error) {
      console.error("Error deleting course offering:", error);
    }
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
        onClick={async () => {
          await handleUpdateOffering(offeringState);
          onSave();
        }}
      >
        Save
      </Button>

      <Button 
        className="mx-2" 
        variant="danger" 
        onClick={async () => {
          await handleDeleteOffering(offeringState.id);
          onSave();
        }}
      >
        Delete
      </Button>

    </Form>
  );
}

export default EditCourseOfferingForm;