import React, { useState } from "react";
import { Button, Form, Container, Card, Alert, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../hooks/userRegister";
import './signupView.css';

/**
 * SignupView component allows users to create a new account.
 *
 * @returns {JSX.Element} The rendered SignupView component.
 */
export const SignupView = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const { signup, loading, error } = userRegister();

  /**
   * Handles the form submission event.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await signup(name, password, email);

    if (success) {
      setSuccessMessage("Signup successful!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg sign-up-card">
        <Card.Body>
          <h3 className="text-center mb-4">Sign Up</h3>

          {/* Display error message */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Display success message */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label className="visually-hidden">Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength="3"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="visually-hidden">Password:</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip>
                    Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.
                  </Tooltip>
                }
                show={showTooltip}
              >
                <Form.Control
                  type="password"
                  placeholder="Enter a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  required
                />
              </OverlayTrigger>
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label className="visually-hidden">Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
