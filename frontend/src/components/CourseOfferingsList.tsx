import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Course, CourseOffering } from "../types";
import Button from 'react-bootstrap/Button';
import CreateCourseForm from './CreateCourseForm';

const CourseOfferingsList = () => {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showAddOffering, setShowAddOffering] = useState(false);

  const handleShowCreateCourse = () => setShowCreateCourse(true);
  const handleCancelCreateCourse = () => setShowCreateCourse(false);
  const handleCreateCourse = (course: Course) => {
    // make POST request
    console.log(course);
  };

  const handleShowAddOffering = () => setShowAddOffering(true);
  const handleCloseAddOffering = () => setShowAddOffering(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [offeringsByCourse, setOfferingsByCourse] = useState<{ [key: number]: CourseOffering[] }>({});

  useEffect(() => {
    // Fetch courses and offerings from Django API in parallel
    axios.all([
      axios.get(`${API_BASE_URL}/api/courses/`),
      axios.get(`${API_BASE_URL}/api/course-offerings/`)
    ])
    .then(axios.spread((coursesResponse, offeringsReponse) => {
      const courseList: Course[] = coursesResponse.data;
      const offeringList: CourseOffering[] = offeringsReponse.data;

      // Sort courses lexicographically
      courseList.sort((a, b) => {
        const nameA = `${a.dept} ${a.number}`;
        const nameB = `${b.dept} ${b.number}`;
        return nameA.localeCompare(nameB);
      });
      setCourses(courseList);

      // Sort offerings starting with most recent
      offeringList.sort((a, b) => {
        const semesterOrder = {
          Spring: 0,
          Summer: 1,
          Fall: 2,
          Winter: 3
        };

        if (a.year != b.year) {
          return b.year - a.year;
        }
        return semesterOrder[b.semester] - semesterOrder[a.semester];
      });

      // Group course offerings by course ID
      const grouped: { [key: number]: CourseOffering[] } = {};
      courseList.forEach(course => grouped[course.id] = []);
      offeringList.forEach(offering => grouped[offering.course].push(offering));
      setOfferingsByCourse(grouped);
    }))
    .catch(error => {
      console.error("Error fetching courses and/or offerings:", error);
    });
  }, []);


  return (
    <div>
      <h1>Courses</h1>
      <Button variant="primary" onClick={handleShowCreateCourse}>
        Create Course
      </Button>
      <CreateCourseForm
        show={showCreateCourse}
        handleCancel={handleCancelCreateCourse}
        handleCreateCourse={handleCreateCourse}
      />

      {/* <Button variant="contained">Add Course Offering</Button> */}
      {courses.map(course => (
        <div key={course.id}>
          <h3>{`${course.dept} ${course.number}: ${course.title}`}</h3>
          <ul>
            {offeringsByCourse[course.id].map(offering => (
              <li key={offering.id}>
                {offering.semester} {offering.year}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default CourseOfferingsList;