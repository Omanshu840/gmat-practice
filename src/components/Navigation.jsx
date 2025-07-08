import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BASE_URL } from "../services/utils";

const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to={`${BASE_URL}/`}>
                    GMAT Prep
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={`${BASE_URL}/`}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to={`${BASE_URL}/tests/CR`}>
                            Critical Reasoning
                        </Nav.Link>
                        <Nav.Link as={Link} to={`${BASE_URL}/tests/PS`}>
                            Problem Solving
                        </Nav.Link>
                        <Nav.Link as={Link} to={`${BASE_URL}/tests/RC`}>
                            Reading Comprehension
                        </Nav.Link>
                        <Nav.Link as={Link} to={`${BASE_URL}/tests/DI`}>
                            Data Insights
                        </Nav.Link>
                        <Nav.Link as={Link} to={`${BASE_URL}/bookmarks`}>
                            Bookmarks
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
