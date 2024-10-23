// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import HomePage from './HomePage';  // Import the home page
import NflPage from './streaming/NflPage';  // Import the NFL page
import NflGame from './streaming/NflGame';  // Import the NFL game page

function App() {

  return (
    <Router>
      <>
        {/* Navbar with Menu Options */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to="/">&nbsp;NostraTv</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/devices">Devices</Nav.Link>
              <NavDropdown title="Streaming" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/streaming/nfl">NFL</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/f1">F1</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/livetv">Live TV</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* Routes Definition */}
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home Page */}
          <Route path="/streaming/nfl" element={<NflPage />} />               {/* NFL Page */}
          <Route path="/streaming/nfl/game/:gameUrl" element={<NflGame />} />  {/* NFL Game Page */}
          {/* You can add other routes like Devices, F1, Live TV here */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
