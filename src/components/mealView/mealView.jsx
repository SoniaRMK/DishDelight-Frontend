import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Container, Card, Badge, Alert } from "react-bootstrap";
import { useMealDetails } from "../../hooks/useMealDetails";
import { useFavorites } from "../../hooks/useFavorites";
import "./mealView.css";

/**
 * Displays detailed information about a specific meal and allows the user to add or remove the meal from their favorites.
 *
 * @param {Object} props - The component props.
 * @param {string} props.token - The authentication token for interacting with the favorites API.
 * @returns {JSX.Element} The rendered MealView component.
 */
export const MealView = ({ token }) => {
  const { mealName } = useParams();
  const { meal, loading, error: mealError } = useMealDetails(mealName);
  const {
    favoriteMeals,
    addFavorite,
    removeFavorite,
    error: favoriteError,
  } = useFavorites(token);
  const [isFavorite, setIsFavorite] = useState(false);

  /**
   * Updates the `isFavorite` state if the current meal is in the user's favorites.
   */
  useEffect(() => {
    if (meal && favoriteMeals.some((favMeal) => favMeal.meal_id === meal.id)) {
      setIsFavorite(true);
    }
  }, [meal, favoriteMeals]);

  /**
   * Handles adding the current meal to the user's favorites.
   *
   * @async
   * @function
   */
  const handleAddToFavorites = async () => {
    if (await addFavorite(meal)) {
      setIsFavorite(true);
    }
  };

  /**
   * Handles removing the current meal from the user's favorites.
   *
   * @async
   * @function
   */
  const handleRemoveFromFavorites = async () => {
    if (await removeFavorite(meal.id)) {
      setIsFavorite(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="meal-view-container">
      <Card className="meal-view-card">
        <Card.Img variant="top" src={meal.image} alt={meal.name} />
        <Card.Body>
          <Card.Title>{meal.name}</Card.Title>
          <Badge bg="secondary" className="me-2">
            Category: {meal.category}
          </Badge>
          <Badge bg="info">Area: {meal.area}</Badge>
          <Card.Text className="mt-3">
            <strong>Instructions:</strong> <br />
            {meal.instructions}
          </Card.Text>
          <Card.Text>
            <strong>Ingredients:</strong> <br />
            {meal.ingredients.join(", ")}
          </Card.Text>
          {meal.video && (
            <Card.Text>
              <strong>Video Tutorial: </strong>
              <a href={meal.video} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </Card.Text>
          )}
          {meal.source && (
            <Card.Text>
              <strong>Recipe Source: </strong>
              <a href={meal.source} target="_blank" rel="noopener noreferrer">
                View Source
              </a>
            </Card.Text>
          )}
          <div className="meal-view-actions">
            <Link to={`/`} className="btn btn-secondary">
              Back
            </Link>

            {isFavorite ? (
              <Button variant="danger" onClick={handleRemoveFromFavorites}>
                Remove from Favorites
              </Button>
            ) : (
              <Button variant="primary" onClick={handleAddToFavorites}>
                Add to Favorites
              </Button>
            )}
          </div>
        </Card.Body>

        {(mealError || favoriteError) && (
          <Alert variant="danger">{mealError || favoriteError}</Alert>
        )}
      </Card>
    </Container>
  );
};
