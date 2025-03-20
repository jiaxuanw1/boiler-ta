import React, { useEffect, useState } from 'react';
import { FormControlElement, Question, TA, TAForCourse } from '../types';
import { Button, Col, Form, ListGroup, Modal, Row } from 'react-bootstrap';

interface EditQuestionFormProps {
  show: boolean;
  question: Question;
  questionTAs: number[];
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
    setSelectedTAs([...questionTAs]);
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

  useEffect(() => {
    console.log(`selectedTAs for ${question.question_name} with ID ${question.id}:`);
    console.log(selectedTAs);
  }, [selectedTAs]);

  const handleFormSubmit = () => {
    console.log("submitted form:");
    console.log(questionState);
    console.log(selectedTAs);
  };



  const handleUpdateQuestion = async (updatedQuestion: Question) => {
    // make PUT request
    console.log(`update question`);
    console.log(updatedQuestion);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    // make DELETE request
    console.log(`delete question: ${questionId}`);
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      backdrop="static"
    >
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
          onClick={() => {
            handleFormSubmit();
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

export default EditQuestionForm;