import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = () => {
  return (
    <Navbar fixed="top" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">BoilerTA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/courses">Courses</Nav.Link>
            <Nav.Link href="/class-management">Class Management</Nav.Link>
            <Nav.Link href="/tas">TAs</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;