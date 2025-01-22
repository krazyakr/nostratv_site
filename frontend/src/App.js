// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import HomePage from './HomePage';  // Import the home page
import NflPage from './streaming/NflPage';  // Import the NFL page
import NflGame from './streaming/NflGame';  // Import the NFL game page
import MotorsportsPage from './streaming/MotorsportsPage';
import MotorsportsEvent from './streaming/MotorsportsEvent';
import LiveTvPage from './streaming/LiveTvPage';
import LiveTvStream from './streaming/LiveTvStream';
import DevicesPage from './device/DevicesPage';  // Import the devices page
import NewDevicePage from './device/NewDevicePage';
import EditDevicePage from './device/EditDevicePage';

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
                <NavDropdown.Item as={Link} to="/streaming/motorsports">Motorsports</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/streaming/livetv">Live TV</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* Routes Definition */}
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home Page */}
          <Route path="/streaming/nfl" element={<NflPage />} />               {/* NFL Page */}
          <Route path="/streaming/nfl/game/:gameId" element={<NflGame />} />  {/* NFL Game Page */}
          <Route path="/streaming/motorsports" element={<MotorsportsPage />} />  {/* Motorsports Page */}
          <Route path="/streaming/motorsports/event/:gameUrl" element={<MotorsportsEvent />} />  {/* Motorsports Page */}
          <Route path="/streaming/livetv" element={<LiveTvPage />} />  {/* Live TV Page */}
          <Route path="/streaming/livetv/event/:gameUrl" element={<LiveTvStream />} />  {/* Live TV Stream Page */}
          <Route path="/devices" element={<DevicesPage />} />  {/* Devices Page */}
          <Route path="devices/create" element={<NewDevicePage />} />  {/* Create Device Page */}
          <Route path="devices/edit/:deviceName" element={<EditDevicePage />} />  {/* Edit Device Page */}
          {/* You can add other routes like Devices, F1, Live TV here */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
