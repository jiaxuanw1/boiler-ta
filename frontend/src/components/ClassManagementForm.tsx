import { useEffect, useState } from 'react';
import { Course, CourseOffering, Homework, TAForCourse } from '../types';
import { Accordion, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import HomeworkAccordionItem from './HomeworkAccordionItem';
import CreateHomeworkForm from './CreateHomeworkForm';
import SelectTAsForCourseForm from './SelectTAsForCourseForm';

interface ClassManagementFormProps {
  course: Course
  offering: CourseOffering;
}

const ClassManagementForm = ({ course, offering }: ClassManagementFormProps) => {
  // Invoke onDataUpdate() when data is changed
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  const onDataUpdate = () => setDataUpdateTrigger(prevValue => prevValue + 1);

  const [showCreateHomework, setShowCreateHomework] = useState(false);
  const handleShowCreateHomework = () => setShowCreateHomework(true);
  const handleCloseCreateHomework = () => setShowCreateHomework(false);
  const handleSaveHomework = () => {
    setShowCreateHomework(false);
    onDataUpdate(); // re-fetch data
  };

  const [showSelectTAs, setShowSelectTAs] = useState(false);
  const handleShowSelectTAs = () => setShowSelectTAs(true);
  const handleCloseSelectTAs = () => setShowSelectTAs(false);
  const handleSaveTAs = () => {
    setShowSelectTAs(false);
    onDataUpdate(); // re-fetch data
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

  
  // Re-fetch homeworks and TAs whenever selected course offering changes or data is updated
  useEffect(() => {
    fetchHomeworks(offering.id);
    fetchTAs(offering.id);
  }, [offering, dataUpdateTrigger]);


  return (
    <>
      <div className="mb-4">
        <h1>{`${course.dept} ${course.number}: ${course.title}`}</h1>
        <h2>{`${offering.semester} ${offering.year}`}</h2>
      </div>
      <div>
        <h3 className="mb-3">Assignments</h3>
        <Button variant="primary" className="mb-3" onClick={handleShowCreateHomework}>
          Create Assignment
        </Button>
        <CreateHomeworkForm 
          key={`create-hw-form-${offering.id}`}
          show={showCreateHomework}
          courseOfferingId={offering.id}
          onClose={handleCloseCreateHomework}
          onSave={handleSaveHomework}
        />

        <Accordion className="mb-3">
          {homeworks.map(homework => (
            <HomeworkAccordionItem 
              key={`homework-${homework.id}`} 
              homework={homework} 
              courseTAs={tas}
              onSaveHomework={handleSaveHomework}
            />
          ))}
        </Accordion>
      </div>

      <div>
        <h3 className="mb-3">TAs</h3>
        <Button variant="primary" className="mb-3" onClick={handleShowSelectTAs}>
          Select TAs
        </Button>
        <SelectTAsForCourseForm 
          show={showSelectTAs}
          courseOffering={offering}
          courseTAs={tas}
          onClose={handleCloseSelectTAs}
          onSave={handleSaveTAs}
        />

        <ListGroup className="mb-3">
          {tas.map(taOffering => (
            <ListGroup.Item key={`ta-offering-${taOffering.id}`}>
              {`${taOffering.ta_last}, ${taOffering.ta_first}`}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}

export default ClassManagementForm;