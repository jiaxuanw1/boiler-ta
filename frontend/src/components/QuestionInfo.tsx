import { Question, TAAssignmentForHW } from '../types';
import { Button, Card, ListGroup } from 'react-bootstrap';

interface QuestionInfoProps {
  question: Question;
  taAssignments: TAAssignmentForHW[];
  onSaveQuestion: () => void;
}

const QuestionInfo = ({ question, taAssignments, onSaveQuestion }: QuestionInfoProps) => {
  /* move these inside Edit Question Form once i create that */
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
        
        <Button variant="secondary">Edit Question</Button>
      </Card.Body>
    </Card>
  );
}

export default QuestionInfo;