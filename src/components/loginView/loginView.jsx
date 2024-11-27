import React, { useState } from "react";
import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
import { userLogin } from "../../hooks/userLogin";
import "./loginView.css"; // Import the CSS file

/**
 * Props for the `LoginView` component.
 * 
 * @typedef {Object} LoginViewProps
 * @property {function(Object, string): void} onLoggedIn - Callback triggered when a user successfully logs in.
 * It receives the logged-in user object and the authentication token as parameters.
 * @property {boolean} showAlert - Indicates whether to display a success alert upon successful login.
 */

/**
 * A React component for the login view.
 *
 * This component renders a login form with email and password fields. It integrates with the
 * `userLogin` hook to handle authentication. Displays loading state, error messages, and success alerts.
 *
 * @param {LoginViewProps} props - Props passed to the component.
 * @returns {JSX.Element} The rendered login view.
 */
export const LoginView = ({ onLoggedIn, showAlert }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = userLogin();

  /**
   * Handles form submission for login.
   *
   * Prevents the default form submission behavior, invokes the `login` function
   * from the `userLogin` hook, and stores the user and token in local storage if successful.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);

    if (result) {
      localStorage.setItem("user", JSON.stringify(result.user.username));
      localStorage.setItem("token", result.token);
      onLoggedIn(result.user, result.token);
    }
  };

  return (
    <Container className="login-container d-flex justify-content-center align-items-center">
      <Card className="login-card shadow-lg">
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>
          {showAlert && (
            <Alert variant="success" dismissible>
              Successfully logged in...
            </Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="visually-hidden">Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label className="visually-hidden">Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
