import React, { useEffect, useState } from 'react';
import { Course, CourseOffering, FormControlElement } from '../types';
import { API_BASE_URL } from '../api';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';

interface CourseSelection {
  course_id: number;
  offering_id: number;
}

const ClassManagementPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [offeringsByCourse, setOfferingsByCourse] = useState<{ [key: number]: CourseOffering[] }>({});

  const fetchCoursesAndOfferings = async () => {
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
  };

  // Fetch courses and offerings on initial render
  useEffect(() => {
    fetchCoursesAndOfferings();
  }, []);


  const [courseSelection, setCourseSelection] = useState<CourseSelection>({
    course_id: -1,
    offering_id: -1
  });
  const handleCourseSelectChange = (event: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = event.currentTarget;
    setCourseSelection(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  return (
    <>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Course</Form.Label>
            <Form.Select name="course_id" onChange={handleCourseSelectChange}>
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
            <Form.Select name="offering_id" onChange={handleCourseSelectChange}>
              <option value={-1}></option>
              {
                courseSelection.course_id in offeringsByCourse &&
                offeringsByCourse[courseSelection.course_id].map(offering => (
                  <option key={`offering-${offering.id}`} value={offering.id}>
                    {`${offering.semester} ${offering.year}`}
                  </option>
                ))
              }
            </Form.Select>
          </Form.Group>
        </Row>
      </Form>

      
    </>
  );
}

export default ClassManagementPage;