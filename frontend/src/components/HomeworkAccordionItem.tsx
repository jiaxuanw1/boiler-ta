import { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { Homework, Question } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';

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

  useEffect(() => {
    fetchQuestions(homework.id);
  }, []); // need to re-fetch on update? maybe pass in dataUpdateTrigger to all of these


  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const handleShowCreateQuestion = () => setShowCreateQuestion(true);
  const closeCreateQuestion = () => setShowCreateQuestion(false);


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
        {questions.map(question => (
          <div></div>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default HomeworkAccordionItem;