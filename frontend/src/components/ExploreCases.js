import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Spinner } from 'react-bootstrap';
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ExploreCases.css';

const ExploreCases = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterState, setFilterState] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'
  
  const navigate = useNavigate();

  // Status badge colors
  const statusColors = {
    'pending': 'warning',
    'in_progress': 'primary',
    'resolved': 'success',
    'closed': 'secondary'
  };

  // Helper function to extract state from address
  const extractStateFromAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',');
    return parts[0].trim();
  };

  useEffect(() => {
    // Fetch cases when component mounts
    fetchCases();
  }, []);

  useEffect(() => {
    // Apply filters whenever cases or filters change
    applyFilters();
  }, [cases, filterState, filterCategory, filterStatus, sortOrder]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cases/explore/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      setCases(response.data);
      setFilteredCases(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cases. Please try again later.');
      setLoading(false);
      console.error('Error fetching cases:', err);
    }
  };

  const applyFilters = () => {
    let result = [...cases];
    
    // Apply state filter (using the state extracted from address)
    if (filterState) {
      result = result.filter(case_ => {
        const caseState = extractStateFromAddress(case_.address);
        return caseState === filterState;
      });
    }
    
    // Apply category filter
    if (filterCategory) {
      result = result.filter(case_ => case_.category === filterCategory);
    }
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(case_ => case_.status === filterStatus);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    
    setFilteredCases(result);
  };

  const handleCaseClick = (caseId) => {
    navigate(`/case/${caseId}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // Get unique categories and states for filter dropdowns
  const categories = [...new Set(cases.map(case_ => case_.category))];
  
  // Extract states from address field
  const states = [...new Set(cases.map(case_ => extractStateFromAddress(case_.address)))].filter(Boolean);
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4 text-center">Explore Cases</h2>
      
      {/* Filter Section */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Label><FaFilter /> Filter by State</Form.Label>
            <Form.Select 
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              aria-label="Filter by state"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Label><FaFilter /> Filter by Category</Form.Label>
            <Form.Select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Label><FaFilter /> Filter by Status</Form.Label>
            <Form.Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Sort by Date</Form.Label>
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={toggleSortOrder}
            >
              {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
              {' '}{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
          </Form.Group>
        </Col>
      </Row>
      
      {/* Results Count */}
      <p className="text-muted mb-4">
        Showing {filteredCases.length} of {cases.length} cases
      </p>
      
      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No cases found matching your criteria</h4>
        </div>
      ) : (
        <Row>
          {filteredCases.map(case_ => (
            <Col key={case_.id} lg={4} md={6} className="mb-4">
              <Card 
                className="h-100 case-card" 
                onClick={() => handleCaseClick(case_.id)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{case_.victim_name}</Card.Title>
                    <Badge bg={statusColors[case_.status] || 'info'}>
                      {case_.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <Card.Subtitle className="mb-2 text-muted">
                    {case_.category}
                  </Card.Subtitle>
                  
                  <Card.Text className="mb-1">
                    <strong>Address:</strong> {case_.address}
                  </Card.Text>
                  
                  <Card.Text className="mb-1">
                    <strong>Contact:</strong> {case_.mobile_number}
                  </Card.Text>
                  
                  <Card.Text className="mb-3">
                    <strong>Filed by:</strong> {case_.user_name}
                  </Card.Text>
                  
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {case_.subcategories.map((subcat, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                        {subcat}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <small>Created: {new Date(case_.created_at).toLocaleDateString()}</small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ExploreCases;