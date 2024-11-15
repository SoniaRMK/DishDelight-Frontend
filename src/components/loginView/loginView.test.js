import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { LoginView } from "./loginView";
import "@testing-library/jest-dom";

// Mock the fetch function globally
global.fetch = jest.fn();

describe("LoginView Component", () => {
  const mockOnLoggedIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with email and password inputs", () => {
    render(<LoginView onLoggedIn={mockOnLoggedIn} />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates email and password state on input change", () => {
    render(<LoginView onLoggedIn={mockOnLoggedIn} />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("handles successful login", async () => {
    // Mock successful response
    fetch.mockResolvedValueOnce({
      json: async () => ({ user: { username: "testuser" }, token: "testtoken" }),
    });

    render(<LoginView onLoggedIn={mockOnLoggedIn} />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    // Fill in the form and submit
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLoggedIn).toHaveBeenCalledWith(
        { username: "testuser" },
        "testtoken"
      );
    });

    expect(localStorage.getItem("user")).toBe('"testuser"');
    expect(localStorage.getItem("token")).toBe("testtoken");
  });

  it("handles failed login with no user returned", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({}), // Simulate no user in response
    });

    window.alert = jest.fn(); // Mock alert

    render(<LoginView onLoggedIn={mockOnLoggedIn} />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("No such user");
    });
  });

  it("handles API errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error")); // Simulate network error

    window.alert = jest.fn(); // Mock alert

    render(<LoginView onLoggedIn={mockOnLoggedIn} />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Something went wrong");
    });
  });
});
