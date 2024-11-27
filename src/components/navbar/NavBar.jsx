import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../../public/DDlogo.svg";

/**
 * NavigationBar component for displaying navigation links and user options.
 *
 * @param {Object} props - The component props.
 * @param {string|null} props.user - The username of the logged-in user. If `null`, the user is not logged in.
 * @param {function} props.onLoggedOut - Callback function to log out the user.
 * @returns {JSX.Element} The rendered NavigationBar component.
 */
export const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    <Navbar bg="light" expand="lg" fixed="top" className="shadow">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="DishDelight Logo"
            width="50"
            height="50"
            className="d-inline-block align-top me-2"
          />
        </Navbar.Brand>

        {/* App Name */}
        <Navbar.Text as={Link} to="/" className="mx-auto">
          <h4 className="text-center m-0">Welcome to DishDelight</h4>
        </Navbar.Text>

        {/* Navbar Toggle for Smaller Screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {/* Links for Guests */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}

            {/* Links for Logged-In Users */}
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to={`/users/${user}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
