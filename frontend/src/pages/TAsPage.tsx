import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { TA } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const TAsPage = () => {
  // Invoke onDataUpdate() when data is changed to allow TA list to refresh
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  const onDataUpdate = () => setDataUpdateTrigger(prevValue => prevValue + 1);

  const [allTAs, setAllTAs] = useState<TA[]>([]);
  const fetchTAs = async () => {
    axios.get(`${API_BASE_URL}/api/tas/`)
      .then(response => {
        const taList: TA[] = response.data;
        taList.sort((a, b) => a.username.localeCompare(b.username));
        setAllTAs(taList);
      })
      .catch(error => {
        console.error("Error fetching TAs:", error);
      });
  };

  useEffect(() => {
    fetchTAs();
  }, [dataUpdateTrigger]);


  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {allTAs.map(ta => (
            <tr key={`ta-${ta.username}`}>
              <td>{ta.username}</td>
              <td>{`${ta.last}, ${ta.first}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TAsPage;