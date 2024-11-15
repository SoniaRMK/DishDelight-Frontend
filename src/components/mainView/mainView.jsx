import React from "react";
import { useState, useEffect } from "react";
import { NavigationBar } from "../navbar/NavBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SignupView } from "../signupView/signupView";
import { LoginView } from "../loginView/loginView";
import { MealCard } from "../mealCard/mealCard";
import { MealView } from "../mealView/mealView";
import { ProfileView } from "../profileView/profileView";
import { SearchView } from "../searchView/searchView";

export const MainView = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [meals, setMeals] = useState([]);
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const mealDBBaseUrl = "https://www.themealdb.com/api/json/v1/1";

  useEffect(() => {
    fetch(`${mealDBBaseUrl}/filter.php/?c=Seafood`)
      .then((response) => response.json())
      .then((data) => {
        const mealsApi = data.meals.map((meal) => {
          return {
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb,
          };
        });
        setMeals(mealsApi);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // Fetch favorite meals only if user is authenticated
  useEffect(() => {
    if (token) {
      fetch("https://dishdelight-backend.onrender.com/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error("Failed to fetch favorites");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const favMeals = data.map((meal) => {
            return {
              id: meal.meal_id,
              name: meal.meal_name,
              image: meal.image_url,
            };
          });
          setFavoriteMeals(favMeals);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [token]);

  const handleSearch = (type, query) => {
    let url = "";

    switch (type) {
      case "category":
        url = `${mealDBBaseUrl}/filter.php?c=${query}`;
        break;
      case "area":
        url = `${mealDBBaseUrl}/filter.php?a=${query}`;
        break;
      case "ingredient":
        url = `${mealDBBaseUrl}/filter.php?i=${query}`;
        break;
      case "firstLetter":
        url = `${mealDBBaseUrl}/search.php?f=${query}`;
        break;
      default:
        break;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const mealsApi = data.meals.map((meal) => {
          return {
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb,
          };
        });
        setMeals(mealsApi);
      })
      .catch((error) => console.log("Error fetching meals:", error));
  };

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const onLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    alert("Successfully logged in...");
    navigate("/");
  };

  return (
    <>
      <NavigationBar user={user} onLoggedOut={onLoggedOut} />
      <Row className="justify-content-md-center mt-5">
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Col md={5}>
                  <LoginView onLoggedIn={onLoggedIn} />
                </Col>
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Col md={5}>
                  <SignupView />
                </Col>
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <SearchView onSearch={handleSearch} />
                {Array.isArray(meals) &&
                  meals.map((meal) => (
                    <Col className="mb-4" key={meal.id} md={3}>
                      <MealCard meal={meal} />
                    </Col>
                  ))}
              </>
            }
          />
          <Route
            path="/meals/:mealName"
            element={
              <>
                <Col md={12}>
                  <MealView token={token} />
                </Col>
              </>
            }
          />
          <Route
            path="/users/:Username"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col>
                    <ProfileView favoriteMeals={favoriteMeals} token={token} />
                  </Col>
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </>
  );
};
