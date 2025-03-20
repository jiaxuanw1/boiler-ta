import { Course, CourseOffering } from '../types';
import { Accordion } from 'react-bootstrap';
import EditCourseOfferingForm from './EditCourseOfferingForm';

interface CourseListingProps {
  course: Course;
  offerings: CourseOffering[];
  onSaveOffering: () => void;
}

const CourseListing = ({ course, offerings, onSaveOffering }: CourseListingProps) => {
  return (
    <Accordion>
      {offerings.map(offering => (
        <Accordion.Item key={`offering-${offering.id}`} eventKey={`offering-${offering.id}`}>

          <Accordion.Header>
            {`${offering.semester} ${offering.year}`}
          </Accordion.Header>
          
          <Accordion.Body>
            <EditCourseOfferingForm 
              offering={offering}
              onSave={onSaveOffering}
            />
          </Accordion.Body>

        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default CourseListing;