import { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { Homework, Question, TA, TAAssignmentForHW } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import CreateQuestionForm from './CreateQuestionForm';
import QuestionInfo from './QuestionInfo';

interface HomeworkAccordionItemProps {
  homework: Homework;
  onUpdateHomework: (updatedHomework: Homework) => void;
  onDeleteHomework: (homeworkId: number) => void;
  onCreateQuestion: (question: Question) => void;
  onUpdateQuestion: (updatedQuestion: Question) => void;
  onDeleteQuestion: (questionId: number) => void;
}

const HomeworkAccordionItem = ({ 
  homework, onUpdateHomework, onDeleteHomework, 
  onCreateQuestion, onUpdateQuestion, onDeleteQuestion
}: HomeworkAccordionItemProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gradingAssignments, setGradingAssignments] = useState<TAAssignmentForHW[]>([]);
  

  const fetchQuestions = async (homeworkId: number) => {
    axios.get(`${API_BASE_URL}/api/questions/?hw=${homeworkId}`)
      .then(response => {
        const questionList: Question[] = response.data;
        setQuestions(questionList);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
      });
  };

  const fetchGradingAssignments = async (homeworkId: number) => {
    axios.get(`${API_BASE_URL}/api/homework/${homeworkId}/tas/`)
      .then(response => {
        const taAssignmentList: TAAssignmentForHW[] = response.data;
        setGradingAssignments(taAssignmentList);
      })
      .catch(error => {
        console.error("Error fetching grading TAs:", error);
      });
  };

  useEffect(() => {
    fetchQuestions(homework.id);
    fetchGradingAssignments(homework.id);
  }, []); // need to re-fetch on update? maybe pass in dataUpdateTrigger to all of these


  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const handleShowCreateQuestion = () => setShowCreateQuestion(true);
  const handleCloseCreateQuestion = () => setShowCreateQuestion(false);


  return (
    <Accordion.Item eventKey={`homework-${homework.id}`}>
      <Accordion.Header>
        <span>{homework.hw_name}</span>
        {/* <Button 
          className="mx-4" 
          variant="outline-secondary"
        >
          Edit
        </Button> */}
      </Accordion.Header>

      <Accordion.Body>
        <Button className="mb-3" variant="primary" onClick={handleShowCreateQuestion}>
          Add Question
        </Button>
        <CreateQuestionForm
          show={showCreateQuestion}
          homeworkId={homework.id}
          onClose={handleCloseCreateQuestion}
          onCreateQuestion={(onCreateQuestion)}
        />

        {questions.map(question => (
          <QuestionInfo key={`question-info-${question.id}`}
            question={question}
            taAssignments={gradingAssignments.filter(assignment => assignment.question_id === question.id)}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
          />
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default HomeworkAccordionItem;