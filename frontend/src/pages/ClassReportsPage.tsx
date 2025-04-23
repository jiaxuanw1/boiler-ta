import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api';
import { Course, CourseOffering } from '../types';
import { Col, Form, Row } from 'react-bootstrap';
import ClassReport from '../components/ClassReport';

const ClassReportsPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);

  const fetchCourses = async () => {
    axios.get(`${API_BASE_URL}/api/courses/`)
      .then(response => {
        const courseList: Course[] = response.data;

        // Sort courses lexicographically
        courseList.sort((a, b) => {
          const nameA = `${a.dept} ${a.number}`;
          const nameB = `${b.dept} ${b.number}`;
          return nameA.localeCompare(nameB);
        });

        setCourses(courseList);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
      });
  };

  const fetchOfferings = async (courseId: number) => {
    axios.get(`${API_BASE_URL}/api/course-offerings/?course=${courseId}`)
      .then(response => {
        const offeringList: CourseOffering[] = response.data;

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

        setOfferings(offeringList);
      })
      .catch(error => {
        console.error("Error fetching offerings:", error);
      });
  };

  // Fetch courses on initial render
  useEffect(() => {
    fetchCourses();
  }, []);


  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<CourseOffering | null>(null);

  // Fetch offerings whenever course selection changes
  useEffect(() => {
    if (selectedCourse) {
      fetchOfferings(selectedCourse.id);
    } else {
      setOfferings([]);
    }
  }, [selectedCourse]);


  return (
    <>
      <Form className="mb-4">
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Course</Form.Label>
            <Form.Select 
              name="course_id" 
              onChange={(event) => {
                const course = courses.find(c => c.id === Number(event.currentTarget.value));
                setSelectedCourse(course || null);
                setSelectedOffering(null);
              }}
            >
              <option value={-1}></option>
              {courses.map(course => (
                <option key={`course-${course.id}`} value={course.id}>
                  {`${course.dept} ${course.number}: ${course.title}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Offering</Form.Label>
            <Form.Select 
              name="offering_id" 
              onChange={(event) => {
                const offering = offerings.find(o => o.id === Number(event.currentTarget.value));
                setSelectedOffering(offering || null);
              }}
            >
              <option value={-1}></option>
              {
                offerings.map(offering => (
                  <option key={`offering-${offering.id}`} value={offering.id}>
                    {`${offering.semester} ${offering.year}`}
                  </option>
                ))
              }
            </Form.Select>
          </Form.Group>
        </Row>
      </Form>

      {
        // Generate Class Report interface if valid course and offering selected
        selectedCourse && selectedOffering &&
          <ClassReport course={selectedCourse} offering={selectedOffering}/>
      }
    </>
  );
}

export default ClassReportsPage;