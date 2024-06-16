import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from './Form';
import axios from 'axios';
import './App.css';

function App() {
  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        await axios.get('/refreshData');
        alert('Google Sheet Refreshed successfully');
      } catch (error) {
        console.error('Error Refreshing sheet', error);
      }
  };
  return (
    <Router>
      <div className="app">
        <Container> 
          <Row className='buttonContainer'>       
            <Col><Link to="/form/A"><Button variant="light">Form A</Button></Link></Col>
            <Col><Link to="/form/B"><Button variant="light">Form B</Button></Link>  </Col>
            <Button variant="light" onClick={handleSubmit}>Refresh</Button>
        </Row>

        </Container>
        <Routes>

          <Route path="/form/:formType" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

