import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MealCard } from "../mealCard/mealCard";

export const ProfileView = ({ token }) => {
  const [favoriteMeals, setFavoriteMeals] = useState([]);

  useEffect(() => {
    if (token) {
      fetch("https://dishdelight-backend.onrender.com/favorites", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const favMeals = data.map((meal) => {
            return {
              id: meal.meal_id,
              name: meal.meal_name,
              image: meal.image_url
            };
          });
          setFavoriteMeals(favMeals)})
        .catch(error => console.log(error));
    }
  }, [token]); // Optionally re-fetch when token changes

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
