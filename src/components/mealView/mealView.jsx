import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Container, Card, Badge } from "react-bootstrap";

export const MealView = ({ token }) => {
  const { mealName } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [meal, setMeal] = useState(null);
  const [favoriteMeals, setFavoriteMeals] = useState([]);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals && data.meals.length > 0) {
          const mealDetails = {
            id: data.meals[0].idMeal,
            name: data.meals[0].strMeal,
            image: data.meals[0].strMealThumb,
            category: data.meals[0].strCategory,
            area: data.meals[0].strArea,
            source: data.meals[0].strSource,
            video: data.meals[0].strYoutube,
            instructions: data.meals[0].strInstructions,
            ingredients: Object.keys(data.meals[0])
              .filter(
                (key) => key.startsWith("strIngredient") && data.meals[0][key]
              )
              .map((key) => data.meals[0][key]),
          };
          setMeal(mealDetails);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [mealName]);

  useEffect(() => {
    if (token) {
      fetch("https://dishdelight-backend.onrender.com/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.statusText === "Forbidden") {
              alert("Your login session has expired. Please log in again.");
            } else throw new Error("Failed to fetch favorites");
          }
          return response.json();
        })
        .then((data) => {
          setFavoriteMeals(data);
          // Set isFavorite based on fetched favorites
          if (meal) {
            const isFav = data.some((favMeal) => favMeal.meal_id === meal.id);
            setIsFavorite(isFav);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [token, meal]);

  const addToFavorites = () => {
    if (!token) {
      alert("You need to be logged in to add favorites.");
      return;
    }

    fetch("https://dishdelight-backend.onrender.com/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meal_id: meal.id,
        meal_name: meal.name,
        image_url: meal.image,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 409) {
            alert("Meal already added to favorites.");
          } else if (response.statusText === "Forbidden") {
            alert("Your login session has expired. Please log in again.");
          } else {
            throw new Error("Failed to add meal to favorites");
          }
        }
        return response.json();
      })
      .then(() => {
        setIsFavorite(true);
        setFavoriteMeals([...favoriteMeals, { meal_id: meal.id }]); // Add to favorites array
        alert("Meal successfully added to favorites");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeFromFavorites = () => {
    if (!token) {
      alert("You need to be logged in to remove favorites.");
      return;
    }

    fetch(`https://dishdelight-backend.onrender.com/favorites/${meal.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove meal from favorites");
        }
        return response.json();
      })
      .then(() => {
        setIsFavorite(false);
        setFavoriteMeals(
          favoriteMeals.filter((favMeal) => favMeal.meal_id !== meal.id)
        );
        alert("Meal successfully removed from favorites");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (!meal) return <div>Loading...</div>;

  return (
    <Container className="d-flex justify-content-center my-5">
      <Card style={{ width: "100%", maxWidth: "600px" }}>
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
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link to={`/`} className="btn btn-secondary">
              Back
            </Link>

            {isFavorite ? (
              <Button variant="danger" onClick={removeFromFavorites}>
                Remove from Favorites
              </Button>
            ) : (
              <Button variant="primary" onClick={addToFavorites}>
                Add to Favorites
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
