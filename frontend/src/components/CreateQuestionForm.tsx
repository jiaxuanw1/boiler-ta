import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormControlElement, Question } from '../types';
import { Col, Row } from 'react-bootstrap';

interface CreateQuestionFormProps {
  show: boolean;
  homeworkId: number;
  onClose: () => void;
  onCreateQuestion: (question: Question) => void;
}

const CreateQuestionForm = ({ show, homeworkId, onClose, onCreateQuestion }: CreateQuestionFormProps) => {
  const [question, setQuestion] = useState<Question>({
    id: -1, // id doesn't matter since it won't be used during creation
    hw: homeworkId,
    question_name: "",
    difficulty: 1,
    required_tas: 0,
    required_gtas: 0,
    required_utas: 0
  });

  const handleChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setQuestion(prevState => ({
      ...prevState, // shallow copy entire previous state
      [name]: value // update specific key/value
    }));
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Question</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>

          <Form.Group className="mb-3">
            <Form.Label>Question Name</Form.Label>
            <Form.Control name="question_name" type="text" value={question.question_name} onChange={handleChange} />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Difficulty</Form.Label>
              <Form.Control name="difficulty" type="number" value={question.difficulty} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Required TAs</Form.Label>
              <Form.Control name="required_tas" type="number" value={question.required_tas} onChange={handleChange} />
            </Form.Group>
          </Row>
          
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          className="mx-2" 
          variant="primary" 
          onClick={() => {
            onCreateQuestion(question);
            onClose();
          }}
        >
          Create Question
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateQuestionForm;