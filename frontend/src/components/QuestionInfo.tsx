import { useEffect, useState } from 'react';
import { Question, TA, TAAssignmentForHW, TAForCourse } from '../types';
import { Button, Card, ListGroup } from 'react-bootstrap';
import EditQuestionForm from './EditQuestionForm';

interface QuestionInfoProps {
  question: Question;
  taAssignments: TAAssignmentForHW[];
  courseTAs: TAForCourse[];
  onSaveQuestion: () => void;
}

const QuestionInfo = ({ question, taAssignments, courseTAs, onSaveQuestion }: QuestionInfoProps) => {
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const handleShowEditQuestion = () => setShowEditQuestion(true);
  const handleCloseEditQuestion = () => setShowEditQuestion(false);
  const handleSaveQuestion = () => {
    setShowEditQuestion(false);
    onSaveQuestion();
  };


  return (
    <Card className="mb-3">
      <Card.Header as="h5">{question.question_name}</Card.Header>
      <Card.Body>
        <Card.Text><b>Difficulty:</b> {question.difficulty}</Card.Text>
        <Card.Text><b>Required TAs:</b> {question.required_tas}</Card.Text>
        <ListGroup className="mb-3">
          {taAssignments.map(assignment => (
              <ListGroup.Item key={`ta-assignment-${assignment.id}`}>
                {`${assignment.ta_first} ${assignment.ta_last}`}
              </ListGroup.Item>
            ))}
        </ListGroup>
        
        <Button variant="secondary" onClick={handleShowEditQuestion}>
          Edit Question
        </Button>
        <EditQuestionForm 
          show={showEditQuestion}
          question={question}
          questionTAs={taAssignments}
          courseTAs={courseTAs}
          onClose={handleCloseEditQuestion}
          onSave={handleSaveQuestion}
        />
      </Card.Body>
    </Card>
  );
}

export default QuestionInfo;