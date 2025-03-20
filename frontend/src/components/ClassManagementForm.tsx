import { useEffect, useState } from 'react';
import { Course, CourseOffering, Homework, Question, TAForCourse } from '../types';
import { Accordion, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import HomeworkAccordionItem from './HomeworkAccordionItem';
import CreateHomeworkForm from './CreateHomeworkForm';

interface ClassManagementFormProps {
  course: Course
  offering: CourseOffering;
}

const ClassManagementForm = ({ course, offering }: ClassManagementFormProps) => {
  // Invoke onDataUpdate() when data is changed to allow course list to refresh
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  const onDataUpdate = () => setDataUpdateTrigger(prevValue => prevValue + 1);


  const [showCreateHomework, setShowCreateHomework] = useState(false);
  const handleShowCreateHomework = () => setShowCreateHomework(true);
  const handleCloseCreateHomework = () => setShowCreateHomework(false);

  const handleCreateHomework = async (homework: Homework) => {
    // make POST request
    console.log("create homework:");
    console.log(homework);

    onDataUpdate();
  };

  const handleUpdateHomework = async (updatedHomework: Homework) => {
    // make PUT request
    console.log(`update homework`);
    console.log(updatedHomework);

    onDataUpdate();
  };

  const handleDeleteHomework = async (homeworkId: number) => {
    // make DELETE request
    console.log(`delete homework: ${homeworkId}`);

    onDataUpdate();
  };


  const handleCreateQuestion = async (question: Question) => {
    // make POST request
    console.log("create question:");
    console.log(question);

    onDataUpdate();
  };

  const handleUpdateQuestion = async (updatedQuestion: Question) => {
    // make PUT request
    console.log(`update question`);
    console.log(updatedQuestion);

    onDataUpdate();
  };

  const handleDeleteQuestion = async (questionId: number) => {
    // make DELETE request
    console.log(`delete question: ${questionId}`);

    onDataUpdate();
  };

  
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const fetchHomeworks = async (courseOfferingId: number) => {
    axios.get(`${API_BASE_URL}/api/homeworks/?course_offering=${courseOfferingId}`)
      .then(response => {
        const homeworkList: Homework[] = response.data;
        setHomeworks(homeworkList);
      })
      .catch(error => {
        console.error("Error fetching homeworks:", error);
      });
  };


  const [tas, setTAs] = useState<TAForCourse[]>([]);
  const fetchTAs = async (courseOfferingId: number) => {
    axios.get(`${API_BASE_URL}/api/course-offering/${courseOfferingId}/tas/`)
      .then(response => {
        const taList: TAForCourse[] = response.data;
        setTAs(taList);
      })
      .catch(error => {
        console.error("Error fetching TAs:", error)
      });
  };

  
  // Re-fetch homeworks and TAs whenever selected course offering changes
  useEffect(() => {
    fetchHomeworks(offering.id);
    fetchTAs(offering.id);
  }, [offering]);


  return (
    <>
      <div className="mb-4">
        <h1>{`${course.dept} ${course.number}: ${course.title}`}</h1>
        <h2>{`${offering.semester} ${offering.year}`}</h2>
      </div>
      <div>
        <h3 className="mb-3">Assignments</h3>
        <Button variant="primary" onClick={handleShowCreateHomework}>
          Create Assignment
        </Button>
        <CreateHomeworkForm 
          key={`create-hw-form-${offering.id}`}
          show={showCreateHomework}
          courseOfferingId={offering.id}
          onClose={handleCloseCreateHomework}
          onCreateHomework={handleCreateHomework}
        />

        <Accordion className="m-3">
          {homeworks.map(homework => (
            <HomeworkAccordionItem 
              key={`homework-${homework.id}`} 
              homework={homework} 
              onUpdateHomework={handleUpdateHomework}
              onDeleteHomework={handleDeleteHomework}
              onCreateQuestion={handleCreateQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          ))}
        </Accordion>
      </div>

      <div>
        <h3 className="mb-3">TAs</h3>
        <ListGroup className="mb-3">
          {tas.map(taOffering => (
            <ListGroup.Item key={`ta-offering-${taOffering.id}`}>
              {`${taOffering.ta_first} ${taOffering.ta_last}`}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}

export default ClassManagementForm;