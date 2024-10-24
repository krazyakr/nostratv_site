import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NewDevicePage = () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const [deviceName, setDeviceName] = useState('');
    const [devicePassword, setDevicePassword] = useState('');
    const [deviceIptvLink, setDeviceIptvLink] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch(`${baseUrl}/device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deviceName: deviceName,
                password: devicePassword,
                iptvLink: deviceIptvLink,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                navigate('/devices');
            } else {
                setError('Device could not be created.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setError('Device could not be created.');
        });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h1 className="text-center">Create New Device</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formDeviceName">
                            <Form.Label>Device Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter device name"
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDevicePassword">
                            <Form.Label>Device Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter device password"
                                value={devicePassword}
                                onChange={(e) => setDevicePassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDeviceIptvLink">
                            <Form.Label>Device IPTV</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter device iptv link"
                                value={deviceIptvLink}
                                onChange={(e) => setDeviceIptvLink(e.target.value)}
                            />
                        </Form.Group>

                        <div className="mt-3 d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Create Device
                            </Button>
                            <Button variant="secondary" onClick={() => navigate('/devices')}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default NewDevicePage;