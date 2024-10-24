import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Alert } from 'react-bootstrap';

function DevicesPage() {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the NFL replays from the backend
        fetch(baseUrl + '/device')
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the API returns JSON
        })
        .then(data => setDevices(data))
        .catch(err => {
            setError(err.message);
        });
    }, []);

return (
    <Container className="mt-5">
        <h1>Devices</h1>
        <p>Welcome to the Devices Page!</p>

        {/* Display error if fetching fails */}
        {error && <Alert variant="danger">Error: {error}</Alert>}

        {/* Button to create a new device */}
        <div className="mb-3">
            <a href="/devices/create" className="btn btn-primary">
                Create New Device
            </a>
        </div>

        {/* Display table of devices */}
        {devices.length > 0 ? (
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>IPTV</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((device, index) => (
                        <tr key={index}>
                            <td>{device.id}</td>
                            <td>{device.deviceName}</td>
                            <td>{device.iptvLink.substring(0, 10)}...</td>
                            <td>
                                <a href={`/devices/edit/${device.deviceName}`} rel="noopener noreferrer">
                                    Edit
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No devices available.</p>
        )}
    </Container>
);
}

export default DevicesPage;
