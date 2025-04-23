import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Course, CourseOffering, TAStat } from '../types';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

interface ClassReportProps {
  course: Course
  offering: CourseOffering;
}

const ClassReport = ({ course, offering }: ClassReportProps) => {
  const [taStats, setTAStats] = useState<TAStat[]>([]);

  const fetchTAStats = async (offeringId: number) => {
    axios.get(`${API_BASE_URL}/api/course-offering/${offeringId}/ta-stats/`)
      .then(response => {
        const taStatList: TAStat[] = response.data;
        console.log(taStatList);
        setTAStats(taStatList);
      })
      .catch(error => {
        console.error("Error fetching course TA stats", error);
      });
  };

  useEffect(() => {
    fetchTAStats(offering.id);
  }, [offering]);
  
  return (
    <>
      <div className="mb-4">
        <h1>{`${course.dept} ${course.number}: ${course.title}`}</h1>
        <h2>{`${offering.semester} ${offering.year}`}</h2>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Assignment Count</th>
            <th>Average Difficulty</th>
            <th>Total Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {taStats.map(stat => (
            <tr key={`ta-stat-${stat.username}`}>
              <td>{stat.username}</td>
              <td>{stat.last}</td>
              <td>{stat.first}</td>
              <td>{stat.assignment_count}</td>
              <td>{stat.avg_difficulty}</td>
              <td>{stat.total_difficulty}</td>
            </tr>            
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ClassReport;