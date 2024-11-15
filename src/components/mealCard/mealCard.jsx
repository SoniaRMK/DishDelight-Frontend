// mealCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MealCard = ({ meal }) => (
  <Card className="h-100 shadow-sm">
    <Card.Img variant="top" src={meal.image} alt={meal.name} style={{ height: "150px", objectFit: "cover" }} />
    <Card.Body className="d-flex flex-column">
      <Card.Title className="text-center mb-3" style={{ fontSize: "1rem" }}>
        {meal.name}
      </Card.Title>
      <div className="mt-auto text-center">
        <Link to={`/meals/${meal.name}`}>
          <Button variant="primary">View Meal</Button>
        </Link>
      </div>
    </Card.Body>
  </Card>
);
