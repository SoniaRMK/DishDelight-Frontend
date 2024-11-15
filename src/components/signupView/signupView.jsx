import { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const SignupView = () => {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: Name,
      password: Password,
      email: Email,
    };

    fetch("https://dishdelight-backend.onrender.com/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Signup successful");
        navigate("/login");
      } else {
        alert("Signup failed");
      }
    });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Sign Up</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label className="visually-hidden">Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a username"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength="3"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="visually-hidden">Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter a password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label className="visually-hidden">Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
