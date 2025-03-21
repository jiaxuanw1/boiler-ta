import { useEffect, useState } from 'react';
import { CourseOffering, TA, TACourseRel, TAForCourse } from '../types';
import { API_BASE_URL } from '../api';
import axios from 'axios';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

interface SelectTAsForCourseFormProps {
  show: boolean;
  courseOffering: CourseOffering;
  courseTAs: TAForCourse[];
  onClose: () => void;
  onSave: () => void;
}

const SelectTAsForCourseForm = ({ show, courseOffering, courseTAs, onClose, onSave }: SelectTAsForCourseFormProps) => {
  // Synced with changes made to form fields
  const [selectedTAs, setSelectedTAs] = useState<number[]>([]);
  useEffect(() => {
    setSelectedTAs(courseTAs.map(courseTA => courseTA.ta_id));
  }, [courseTAs]);

  const handleTASelectionChange = (taId: number) => {
    setSelectedTAs(prevSelectedTAs =>
      prevSelectedTAs.includes(taId)
        ? prevSelectedTAs.filter(id => id !== taId) // uncheck
        : [...prevSelectedTAs, taId]                // check
    );
  };


  const [allTAs, setAllTAs] = useState<TA[]>([]);
  const fetchTAs = () => {
    axios.get(`${API_BASE_URL}/api/tas/`)
      .then(response => {
        const taList: TA[] = response.data;
        setAllTAs(taList);
      })
      .catch(error => {
        console.error("Error fetching TAs:", error);
      });
  };

  useEffect(() => {
    fetchTAs();
  }, []);


  const handleCreateCourseTA = async (taCourseRel: TACourseRel) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ta-courses/`, taCourseRel);
      console.log(response);
    } catch (error) {
      console.error("Error creating (TA, Course Offering) assignment:", error);
    }
  };

  const handleDeleteCourseTA = async (taCourseRelId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/ta-courses/${taCourseRelId}/`);
      console.log(response);
    } catch (error) {
      console.error("Error deleting (TA, Course Offering) assignment:", error);
    }
  };

  const handleUpdateAllCourseTAs = async () => {
    const prevAssigned = new Set<number>(courseTAs.map(courseTA => courseTA.ta_id));
    for (const taId of selectedTAs) {
      if (!prevAssigned.has(taId)) {
        // Selected TA that was previously not in this course
        await handleCreateCourseTA({
          id: -1,
          ta: taId,
          course_offering: courseOffering.id,
          classification: "UG" // placeholder for now, will implement later probably
        });
      }
    }

    const selected = new Set<number>(selectedTAs);
    for (const prevCourseTA of courseTAs) {
      if (!selected.has(prevCourseTA.ta_id)) {
        // Un-selected TA that was originally in this course
        await handleDeleteCourseTA(prevCourseTA.id);
      }
    }
  };


  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Select TAs</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <ListGroup>
          {allTAs.map(ta => (
            <ListGroup.Item key={`ta-list-item-${ta.id}`}>
              <Form.Check
                type="checkbox"
                id={`ta-checkbox-${ta.id}`}
                label={`${ta.first} ${ta.last} (${ta.username})`}
                checked={selectedTAs.includes(ta.id)}
                onChange={() => handleTASelectionChange(ta.id)}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="mx-2"
          variant="primary"
          onClick={async () => {
            await handleUpdateAllCourseTAs();
            onSave();
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SelectTAsForCourseForm;