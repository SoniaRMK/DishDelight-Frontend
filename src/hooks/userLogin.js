import { useState } from "react";

/**
 * @typedef {Object} LoginResponse
 * @property {Object} user - The logged-in user's details.
 * @property {string} token - The authentication token for the user.
 */

/**
 * Custom hook to handle user login functionality.
 *
 * This hook provides a `login` function for authenticating a user, as well as state variables
 * for tracking the loading status and any errors that occur during the login process.
 *
 * @returns {{
 *   login: (email: string, password: string) => Promise<LoginResponse | null>,
 *   loading: boolean,
 *   error: string | null
 * }} An object containing:
 * - `login`: A function to authenticate the user with email and password.
 * - `loading`: A boolean indicating whether the login process is ongoing.
 * - `error`: A string containing any error message, or `null` if no error occurred.
 */
export const userLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Authenticates the user with the provided email and password.
   *
   * Sends a `POST` request to the server with the login credentials. If the login
   * is successful, returns the user details and authentication token. If it fails,
   * sets an error message.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<LoginResponse | null>} Resolves with the user's details and token on success, or `null` on failure.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://dishdelight-backend.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.user) {
        return { user: data.user, token: data.token };
      } else {
        throw new Error("No such user");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
