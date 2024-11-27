import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MealCard } from "../mealCard/mealCard";

/**
 * ProfileView component for displaying the user's favorite meals.
 *
 * @param {Object} props - The component props.
 * @param {string} props.token - The authentication token used to fetch favorite meals.
 * @returns {JSX.Element} The rendered ProfileView component.
 */
export const ProfileView = ({ token }) => {
  const [favoriteMeals, setFavoriteMeals] = useState([]);

  /**
   * Fetches the user's favorite meals from the API when the token is available.
   */
  useEffect(() => {
    if (token) {
      fetch("https://dishdelight-backend.onrender.com/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const favMeals = data.map((meal) => ({
            id: meal.meal_id,
            name: meal.meal_name,
            image: meal.image_url,
          }));
          setFavoriteMeals(favMeals);
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  // Render message if no favorite meals are found
  if (!favoriteMeals || favoriteMeals.length === 0) {
    return (
      <div className="text-center my-5">
        <h3>No favorite meals found!</h3>
      </div>
    );
  }

  return (
    <Container fluid className="my-5">
      <h2 className="text-center mb-4">Your Favorite Meals</h2>
      <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4 justify-content-center">
        {favoriteMeals.map((meal) => (
          <Col key={meal.id}>
            <MealCard meal={meal} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
