import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Alert } from 'react-bootstrap';

function NflPage() {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const [replays, setReplays] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the NFL replays from the backend
        fetch(baseUrl + '/streaming/nfl/events')
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the API returns JSON
        })
        .then(data => setReplays(data.events))
        .catch(err => {
            setError(err.message);
        });
    }, []);

  return (
    <Container className="mt-5">
      <h1>NFL Streaming</h1>
      <p>Welcome to the NFL Streaming Page! Here you can find replays and highlights of NFL games.</p>

      {/* Display error if fetching fails */}
      {error && <Alert variant="danger">Error: {error}</Alert>}

      {/* Display list of NFL replays */}
      {replays.length > 0 ? (
        <ListGroup>
          {replays.map((replay, index) => (
            <ListGroup.Item key={index}>
              <h5>{replay.title}</h5>
              <p>{replay.description}</p>
              {/* Assuming there's a link to the replay video */}
              <a href={`/streaming/nfl/game${replay.url}`} rel="noopener noreferrer">
                Watch Replay
              </a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No replays available.</p>
      )}
    </Container>
  );
}

export default NflPage;
