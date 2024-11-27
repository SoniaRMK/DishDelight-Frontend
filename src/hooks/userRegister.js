import { useState } from "react";

/**
 * Custom hook to handle user registration functionality.
 *
 * This hook provides a `signup` function for registering a new user, as well as state variables
 * for tracking the loading status and any errors that occur during the signup process.
 *
 * @returns {{
 *   signup: (username: string, password: string, email: string) => Promise<boolean>,
 *   loading: boolean,
 *   error: string | null
 * }} An object containing:
 * - `signup`: A function to register a new user with username, password, and email.
 * - `loading`: A boolean indicating whether the signup process is ongoing.
 * - `error`: A string containing any error message, or `null` if no error occurred.
 */
export const userRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Registers a new user with the provided username, password, and email.
   *
   * Sends a `POST` request to the server with the registration details. If the registration
   * is successful, returns `true`. If it fails, sets an error message and returns `false`.
   *
   * @param {string} username - The desired username for the new user.
   * @param {string} password - The password for the new user.
   * @param {string} email - The email address for the new user.
   * @returns {Promise<boolean>} Resolves with `true` if signup was successful, or `false` if it failed.
   */
  const signup = async (username, password, email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://dishdelight-backend.onrender.com/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      return true; // Indicating signup was successful
    } catch (err) {
      setError(err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};
