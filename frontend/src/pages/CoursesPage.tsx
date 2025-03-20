import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Course, CourseOffering } from "../types";
import Button from 'react-bootstrap/Button';
import CreateCourseForm from '../components/CreateCourseForm';
import AddCourseOfferingForm from '../components/AddCourseOfferingForm';
import CourseListing from '../components/CourseListing';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [offeringsByCourse, setOfferingsByCourse] = useState<{ [key: number]: CourseOffering[] }>({});

  // Invoke onDataUpdate() when data is changed to allow course list to refresh
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  const onDataUpdate = () => setDataUpdateTrigger(prevValue => prevValue + 1);


  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const handleShowCreateCourse = () => setShowCreateCourse(true);
  const handleCloseCreateCourse = () => setShowCreateCourse(false);
  const handleSaveCourse = () => {
    setShowCreateCourse(false);
    onDataUpdate();
  }

  /* move this inside Edit Course form */
  const handleDeleteCourse = async (course_id: number) => {
    // make DELETE request
    console.log(`delete coure: ${course_id}`);
  };


  const [showAddOffering, setShowAddOffering] = useState(false);
  const handleShowAddOffering = () => setShowAddOffering(true);
  const handleCloseAddOffering = () => setShowAddOffering(false);
  const handleSaveOffering = () => {
    setShowAddOffering(false);
    onDataUpdate();
  }


  const fetchCoursesAndOfferings = async () => {
    // Fetch courses and offerings from Django API in parallel
    axios.all([
      axios.get(`${API_BASE_URL}/api/courses/`),
      axios.get(`${API_BASE_URL}/api/course-offerings/`)
    ])
    .then(axios.spread((coursesResponse, offeringsResponse) => {
      const courseList: Course[] = coursesResponse.data;
      const offeringList: CourseOffering[] = offeringsResponse.data;

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
  };

  useEffect(() => {
    fetchCoursesAndOfferings();
    console.log("fetchCoursesAndOfferings");
  }, [dataUpdateTrigger]);


  return (
    <div>
      <h1>Courses</h1>
      <Button className="m-2" variant="primary" onClick={handleShowCreateCourse}>
        Create Course
      </Button>
      <CreateCourseForm
        show={showCreateCourse}
        onClose={handleCloseCreateCourse}
        onSave={handleSaveCourse}
      />

      <Button className="m-2" variant="secondary" onClick={handleShowAddOffering}>
        Add Course Offering
      </Button>
      <AddCourseOfferingForm
        show={showAddOffering}
        courses={courses}
        onClose={handleCloseAddOffering}
        onSave={handleSaveOffering}
      />
      
      {courses.map(course => (
        <div key={course.id} className="m-3">
          <h3>{`${course.dept} ${course.number}: ${course.title}`}</h3>
          <CourseListing
            course={course}
            offerings={offeringsByCourse[course.id]} 
            onSaveOffering={handleSaveOffering}
          />
        </div>
      ))}
    </div>
  );
}

export default CoursesPage;