import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Alert } from 'react-bootstrap';

function LiveTvPage() {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const [replays, setReplays] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the NFL replays from the backend
        fetch(baseUrl + '/streaming/livetv/events')
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the API returns JSON
        })
        .then(data => setReplays(data))
        .catch(err => {
            setError(err.message);
        });
    }, []);

  return (
    <Container className="mt-5">
      <h1>LiveTV Streaming</h1>
      <p>Welcome to the LiveTV Streaming Page! Here you can find sports streaming events.</p>

      {/* Display error if fetching fails */}
      {error && <Alert variant="danger">Error: {error}</Alert>}

      {/* Display table of LiveTV */}
      {replays.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Time</th>
              <th>Description</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {replays.map((replay, index) => (
              <tr key={index}>
                <td>{replay.time}</td>
                <td>{replay.description}</td>
                <td>
                  <a href={`/streaming/livetv/event${replay.link}`} rel="noopener noreferrer">
                    Watch
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No replays available.</p>
      )}
    </Container>
  );
}

export default LiveTvPage;
