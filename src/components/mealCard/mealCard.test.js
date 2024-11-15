import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // for handling Link component
import { MealCard } from "./mealCard"; // Adjust path if necessary
import "@testing-library/jest-dom";

describe("MealCard Component", () => {
  const meal = {
    name: "Spaghetti Bolognese",
    image: "https://example.com/spaghetti.jpg",
  };

  it("renders the meal name", () => {
    render(
      <MemoryRouter>
        <MealCard meal={meal} />
      </MemoryRouter>
    );
    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();
  });

  it("renders the meal image with correct alt text", () => {
    render(
      <MemoryRouter>
        <MealCard meal={meal} />
      </MemoryRouter>
    );
    const img = screen.getByAltText("Spaghetti Bolognese");
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(meal.image);
  });

  it("renders the View Meal button with correct link", () => {
    render(
      <MemoryRouter>
        <MealCard meal={meal} />
      </MemoryRouter>
    );
    const button = screen.getByRole("button", { name: /view meal/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view meal/i })).toHaveAttribute(
      "href",
      `/meals/${meal.name}`
    );
  });
});
