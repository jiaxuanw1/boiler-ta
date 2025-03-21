import React, { useEffect, useState } from 'react';
import { FormControlElement, GradingRel, Question, TA, TAAssignmentForHW, TAForCourse } from '../types';
import { Button, Col, Form, ListGroup, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../api';

interface EditQuestionFormProps {
  show: boolean;
  question: Question;
  questionTAs: TAAssignmentForHW[];
  courseTAs: TAForCourse[];
  onClose: () => void;
  onSave: () => void;
}

const EditQuestionForm = ({ show, question, questionTAs, courseTAs, onClose, onSave }: EditQuestionFormProps) => {
  // Synced with changes made to form fields
  const [questionState, setQuestionState] = useState<Question>({...question});
  const [selectedTAs, setSelectedTAs] = useState<number[]>([]);

  // Initialize selected TAs to current TAs assigned to question
  useEffect(() => {
    setSelectedTAs(questionTAs.map(assignment => assignment.ta_id));
  }, [question]);

  const handleFormChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setQuestionState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTASelectionChange = (taId: number) => {
    setSelectedTAs(prevSelectedTAs =>
      prevSelectedTAs.includes(taId)
        ? prevSelectedTAs.filter(id => id !== taId) // uncheck
        : [...prevSelectedTAs, taId]                // check
    );
  };

  // useEffect(() => {
  //   console.log(`selectedTAs for ${question.question_name} with ID ${question.id}:`);
  //   console.log(selectedTAs);
  // }, [selectedTAs]);

  const handleFormSubmit = async () => {
    if (selectedTAs.length < questionState.required_tas) {
      alert(`Must select at least ${questionState.required_tas} TAs!`);
      return;
    }

    await handleUpdateQuestion(questionState);
    await handleUpdateAllGrading();

    // Signal parent of changes
    onSave();
  };


  const handleUpdateQuestion = async (updatedQuestion: Question) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/questions/${updatedQuestion.id}/`, updatedQuestion);
      console.log(response);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/questions/${questionId}/`)
      console.log(response);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleCreateGradingAssignment = async (gradingRel: GradingRel) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/grading-assignments/`, gradingRel);
      console.log(response);
    } catch (error) {
      console.error("Error creating (TA, Question) assignment:", error);
    }
  };

  const handleDeleteGradingAssignment = async (gradingRelId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/grading-assignments/${gradingRelId}/`);
      console.log(response);
    } catch (error) {
      console.error("Error deleting (TA, Question) assignment:", error);
    }
  };

  const handleUpdateAllGrading = async () => {
    const prevAssigned = new Set<number>(questionTAs.map(assignment => assignment.ta_id));
    for (const taId of selectedTAs) {
      if (!prevAssigned.has(taId)) {
        // Selected TA that was previously not on this question
        await handleCreateGradingAssignment({
          id: -1,
          ta: taId,
          question: question.id
        });
      }
    }

    const selected = new Set<number>(selectedTAs);
    for (const gradingAssignment of questionTAs) {
      if (!selected.has(gradingAssignment.ta_id)) {
        // Un-selected TA that was originally on this question
        await handleDeleteGradingAssignment(gradingAssignment.id);
      }
    }
  };

  return (
    <Modal show={show} onClose={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Question</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Question Name</Form.Label>
            <Form.Control name="question_name" type="text" value={questionState.question_name} onChange={handleFormChange} />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Difficulty</Form.Label>
              <Form.Control name="difficulty" type="number" value={questionState.difficulty} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Required TAs</Form.Label>
              <Form.Control name="required_tas" type="number" value={questionState.required_tas} onChange={handleFormChange} />
            </Form.Group>
          </Row>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Assign TAs</Form.Label>
              <Col sm={9}>
                <ListGroup>
                  {courseTAs.map(courseTAEntry => (
                    <ListGroup.Item key={`question-ta-list-item-${courseTAEntry.id}`}>
                      <Form.Check
                        type="checkbox"
                        id={`question-ta-checkbox-${courseTAEntry.id}`}
                        label={`${courseTAEntry.ta_first} ${courseTAEntry.ta_last} (${courseTAEntry.ta_username})`}
                        checked={selectedTAs.includes(courseTAEntry.ta_id)}
                        onChange={() => handleTASelectionChange(courseTAEntry.ta_id)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="mx-2"
          variant="primary"
          onClick={async () => {
            handleFormSubmit();
          }}
        >
          Save
        </Button>
        <Button
          className="mx-2"
          variant="danger"
          onClick={async () => {
            await handleDeleteQuestion(question.id);
            onSave();
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

export default EditQuestionForm;