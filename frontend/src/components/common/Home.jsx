import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import p3 from '../../images/p3.webp';

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" bg="light" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            MediCareBook
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="home-container d-flex flex-column flex-md-row align-items-center p-4">
        <div className="left-side col-md-6 text-center">
          <img src={p3} alt="Doctor" className="img-fluid rounded shadow" />
        </div>
        <div className="right-side col-md-6 mt-4 mt-md-0 text-md-start text-center">
          <p className="fs-4">
            <span className="fw-bold text-primary">Effortlessly schedule your doctor</span><br />
            <span className="text-secondary">appointments with just a few clicks,</span><br />
            <span className="text-success">putting your health in your hands.</span><br />
            <Button variant="info" className="mt-3">
              <Link to="/login" className="text-white text-decoration-none">Book your Doctor</Link>
            </Button>
          </p>
        </div>
      </div>

      {/* About Section */}
      <Container className="mt-5">
        <h1 className="text-center mb-4">About Us</h1>
        <p className="text-justify">
          Booking a doctor appointment has never been easier...
          {/* You can truncate or break this content into smaller sections if needed */}
        </p>
      </Container>
    </>
  );
};

export default Home;

