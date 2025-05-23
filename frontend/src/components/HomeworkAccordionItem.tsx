import { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { Homework, Question, TAAssignmentForHW, TAForCourse } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import CreateQuestionForm from './CreateQuestionForm';
import QuestionInfo from './QuestionInfo';
import EditHomeworkForm from './EditHomeworkForm';

interface HomeworkAccordionItemProps {
  homework: Homework;
  courseTAs: TAForCourse[];
  onSaveHomework: () => void;
}

const HomeworkAccordionItem = ({ homework, courseTAs, onSaveHomework }: HomeworkAccordionItemProps) => {
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  const onDataUpdate = () => setDataUpdateTrigger(prevValue => prevValue + 1);

  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const handleShowCreateQuestion = () => setShowCreateQuestion(true);
  const handleCloseCreateQuestion = () => setShowCreateQuestion(false);
  const handleSaveQuestion = () => {
    setShowCreateQuestion(false);
    onDataUpdate();
  };

  const [showEditHomework, setShowEditHomework] = useState(false);
  const handleShowEditHomework = () => setShowEditHomework(true);
  const handleCloseEditHomework = () => setShowEditHomework(false);
  const handleSaveHomework = () => {
    setShowEditHomework(false);
    onDataUpdate();
    onSaveHomework();
  };
  const handleDeleteHomework = () => {
    setShowEditHomework(false);
    onSaveHomework();
  }


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
  }, [dataUpdateTrigger]);


  return (
    <Accordion.Item eventKey={`homework-${homework.id}`}>
      <Accordion.Header>
        <span>{homework.hw_name}</span>
      </Accordion.Header>

      <Accordion.Body>
        <Button className="mb-3 mx-2" variant="primary" onClick={handleShowCreateQuestion}>
          Add Question
        </Button>
        <CreateQuestionForm
          show={showCreateQuestion}
          homeworkId={homework.id}
          onClose={handleCloseCreateQuestion}
          onSave={(handleSaveQuestion)}
        />

        <Button className="mb-3 mx-2" variant="secondary" onClick={handleShowEditHomework}>
          Edit Homework
        </Button>
        <EditHomeworkForm 
          show={showEditHomework}
          homework={homework}
          onClose={handleCloseEditHomework}
          onSave={handleSaveHomework}
          onDelete={handleDeleteHomework}
        />

        {questions.map(question => (
          <QuestionInfo key={`question-info-${question.id}`}
            question={question}
            courseTAs={courseTAs}
            taAssignments={gradingAssignments.filter(assignment => assignment.question_id === question.id)}
            onSaveQuestion={handleSaveQuestion}
          />
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default HomeworkAccordionItem;