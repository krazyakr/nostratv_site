import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate instead of useHistory
import { Container, ListGroup, Alert, Button } from 'react-bootstrap';

function MotorsportsEvent() {
    const { gameUrl } = useParams();  // Extract gameUrl from the route parameters
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();  // Initialize useNavigate to programmatically navigate

    const [videoUrls, setVideoUrls] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);  // To store the currently selected video URL
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the video URLs for the specific game from the backend
        fetch(`${baseUrl}/streaming/motorsports/event/video/${gameUrl}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  // Assuming the API returns a JSON response
            })
            .then(data => setVideoUrls(data.videoUrls))  // Update with the videoUrls array
            .catch(err => {
                setError(err.message);
            });
    }, [baseUrl, gameUrl]);

    const handleVideoClick = (videoUrl) => {
        setSelectedVideo(videoUrl.startsWith("//") ? `https:${videoUrl}` : videoUrl);  // Prepend https: to protocol-relative URLs
    };

    const handleBackClick = () => {
        navigate('/streaming/motorsports');  // Navigate back to the NFL listing page
    };

    return (
        <Container className="mt-5">
            <h1>Motorsports Event Videos</h1>

            {/* Display error if fetching fails */}
            {error && <Alert variant="danger">Error: {error}</Alert>}

            {/* Display list of video links */}
            {videoUrls.length > 0 ? (
                <>
                    <ListGroup>
                        {videoUrls.map((videoUrl, index) => (
                            <ListGroup.Item key={index} onClick={() => handleVideoClick(videoUrl)}>
                                <h5>Video {index + 1}</h5> {/* Generic title based on index */}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    {/* Spacing of 50px between list and button */}
                    <div className="mt-5 d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleBackClick}>
                            Back to Motorsports Events
                        </Button>
                    </div>
                </>
            ) : (
                <p>No videos available.</p>
            )}

            {/* Display the selected video in an iframe */}
            {selectedVideo && (
                <div className="mt-4">
                    <h3>Now Playing:</h3>
                    <iframe
                        src={selectedVideo}
                        title={`NFL Video - ${selectedVideo}`}
                        width="100%"
                        height="500px"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </Container>
    );
}

export default MotorsportsEvent;
