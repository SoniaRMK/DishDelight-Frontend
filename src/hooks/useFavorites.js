import { useState, useEffect } from "react";

/**
 * @typedef {Object} Meal
 * @property {string} id - The unique identifier for the meal.
 * @property {string} name - The name of the meal.
 * @property {string} image - The URL of the meal's image.
 */

/**
 * @typedef {Object} UseFavoritesReturn
 * @property {Meal[]} favoriteMeals - The list of favorite meals.
 * @property {(meal: Meal) => Promise<boolean>} addFavorite - Function to add a meal to favorites.
 * @property {(mealId: string) => Promise<boolean>} removeFavorite - Function to remove a meal from favorites.
 * @property {string | null} error - An error message, or `null` if there is no error.
 */

/**
 * Custom hook to manage favorite meals.
 *
 * This hook provides functionality for fetching, adding, and removing
 * favorite meals for a user authenticated with a token.
 *
 * @param {string} token - The authentication token for API requests.
 * @returns {UseFavoritesReturn} An object containing favorite meals, error message, and functions to manage favorites.
 */
export const useFavorites = (token) => {
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the user's favorite meals from the API.
     *
     * This function is invoked automatically when the hook is initialized
     * or when the `token` changes.
     *
     * @returns {Promise<void>}
     */
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const response = await fetch("https://dishdelight-backend.onrender.com/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.statusText === "Forbidden") {
            setError("Your login session has expired. Please log in again.");
          } else throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavoriteMeals(data);
      } catch (err) {
        setError(err.message || "Failed to fetch favorites");
      }
    };

    fetchFavorites();
  }, [token]);

  /**
   * Adds a meal to the user's list of favorite meals.
   *
   * Sends a `POST` request to the API to add a new favorite meal. Updates
   * the local state if the operation is successful.
   *
   * @param {Meal} meal - The meal to add to favorites.
   * @returns {Promise<boolean>} Resolves to `true` if the meal was added successfully, otherwise `false`.
   */
  const addFavorite = async (meal) => {
    if (!token) {
      setError("You need to be logged in to add favorites.");
      return false;
    }

    try {
      const response = await fetch("https://dishdelight-backend.onrender.com/favorites", {
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
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError("Meal already added to favorites.");
        } else if (response.statusText === "Forbidden") {
          setError("Your login session has expired. Please log in again.");
        } else {
          throw new Error("Failed to add meal to favorites");
        }
      }

      setFavoriteMeals((prev) => [...prev, { meal_id: meal.id }]);
      return true;
    } catch (err) {
      setError(err.message || "Failed to add favorite");
      return false;
    }
  };

  /**
   * Removes a meal from the user's list of favorite meals.
   *
   * Sends a `DELETE` request to the API to remove a meal from favorites. Updates
   * the local state if the operation is successful.
   *
   * @param {string} mealId - The ID of the meal to remove.
   * @returns {Promise<boolean>} Resolves to `true` if the meal was removed successfully, otherwise `false`.
   */
  const removeFavorite = async (mealId) => {
    if (!token) {
      setError("You need to be logged in to remove favorites.");
      return false;
    }

    try {
      const response = await fetch(`https://dishdelight-backend.onrender.com/favorites/${mealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove meal from favorites");
      }

      setFavoriteMeals((prev) => prev.filter((meal) => meal.id !== mealId));
      return true;
    } catch (err) {
      setError(err.message || "Failed to remove favorite");
      return false;
    }
  };

  return { favoriteMeals, addFavorite, removeFavorite, error };
};
