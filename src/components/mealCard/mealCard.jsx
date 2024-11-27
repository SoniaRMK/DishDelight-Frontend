import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./mealCard.css";

/**
 * Represents a card component for displaying meal information.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.meal - The meal object containing details about the meal.
 * @param {string} props.meal.name - The name of the meal.
 * @param {string} props.meal.image - The URL of the meal's image.
 * @returns {JSX.Element} The rendered MealCard component.
 */
export const MealCard = ({ meal }) => (
  <Card className="h-100 shadow-sm meal-card">
    <Card.Img
      variant="top"
      src={meal.image}
      alt={meal.name}
      className="meal-card-img"
    />
    <Card.Body className="d-flex flex-column">
      <Card.Title className="text-center mb-3 meal-card-title">
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
