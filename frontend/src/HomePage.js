// HomePage.js
import React from 'react';
import { Container } from 'react-bootstrap';

function HomePage({ items }) {
  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <h1>Welcome to NostraTV</h1>
      <img src="/images/pc_tv_banner.png" alt="PC TV Banner" className="img-fluid" />
    </Container>
  );
}

export default HomePage;
