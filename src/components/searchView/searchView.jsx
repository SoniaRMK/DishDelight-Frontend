import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const areas = [
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "Filipino",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Ukrainian",
  "Vietnamese",
];

const categories = [
  "Beef",
  "Breakfast",
  "Chicken",
  "Dessert",
  "Goat",
  "Lamb",
  "Miscellaneous",
  "Pasta",
  "Pork",
  "Seafood",
  "Side",
  "Starter",
  "Vegan",
  "Vegetarian",
];

export const SearchView = ({ onSearch }) => {
  const [searchType, setSearchType] = useState("category");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = () => {
    onSearch(searchType, query);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Display suggestions based on the selected search type
    if (searchType === "area") {
      setSuggestions(
        areas.filter((area) =>
          area.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else if (searchType === "category") {
      setSuggestions(
        categories.filter((category) =>
          category.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5 mb-5">
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="position-relative">
          <Form.Group className="d-flex">
            <Form.Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="me-2"
            >
              <option value="category">Category</option>
              <option value="area">Area</option>
              <option value="ingredient">Ingredient</option>
              <option value="firstLetter">First Letter</option>
            </Form.Select>
            <Form.Control
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder={`Search by ${searchType}`}
            />
            <Button variant="primary" onClick={handleSearch} className="ms-2">
              Search
            </Button>
          </Form.Group>

          {suggestions.length > 0 && (
            <div
              className="suggestions-dropdown position-absolute w-100 bg-white border mt-1"
              style={{ zIndex: 1000 }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 suggestion-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setQuery(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};