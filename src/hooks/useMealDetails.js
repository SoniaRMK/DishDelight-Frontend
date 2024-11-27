import { useState, useEffect } from "react";

/**
 * @typedef {Object} MealDetails
 * @property {string} id - The unique identifier for the meal.
 * @property {string} name - The name of the meal.
 * @property {string} image - The URL of the meal's image.
 * @property {string} category - The category of the meal (e.g., "Dessert").
 * @property {string} area - The region or cuisine of the meal (e.g., "Italian").
 * @property {string | null} source - The URL of the source recipe, if available.
 * @property {string | null} video - The URL of the YouTube video for the meal, if available.
 * @property {string} instructions - The cooking instructions for the meal.
 * @property {string[]} ingredients - A list of ingredients used in the meal.
 */

/**
 * Custom hook to fetch and manage details for a specific meal by name.
 *
 * This hook fetches detailed information about a meal from the MealDB API.
 * It provides the meal details, loading state, and any error encountered during the fetch operation.
 *
 * @param {string} mealName - The name of the meal to fetch details for.
 * @returns {{ meal: MealDetails | null, loading: boolean, error: string | null }} 
 * An object containing:
 * - `meal`: The details of the fetched meal, or `null` if no meal is found.
 * - `loading`: A boolean indicating whether the data is currently being fetched.
 * - `error`: A string containing any error message, or `null` if no error occurred.
 */
export const useMealDetails = (mealName) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the meal details from the MealDB API.
     *
     * This function is invoked when the component is mounted or when the `mealName` changes.
     *
     * @returns {Promise<void>}
     */
    const fetchMeal = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        const data = await response.json();

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
        } else {
          setMeal(null);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealName]);

  return { meal, loading, error };
};
