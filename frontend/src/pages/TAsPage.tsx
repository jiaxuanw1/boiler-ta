import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { TA } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import CreateTAForm from '../components/CreateTAForm';

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


  const [showCreateTA, setShowCreateTA] = useState(false);
  const handleShowCreateTA = () => setShowCreateTA(true);
  const handleCloseCreateTA = () => setShowCreateTA(false);
  const handleSaveTA = () => {
    setShowCreateTA(false);
    onDataUpdate();
  }


  return (
    <>
      <h1>Teaching Assistants</h1>
      <Button className="m-2" variant="primary" onClick={handleShowCreateTA}>
        Add Teaching Assistant
      </Button>
      <CreateTAForm
        show={showCreateTA}
        onClose={handleCloseCreateTA}
        onSave={handleSaveTA}
      />
      <Table striped bordered hover className="my-2">
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