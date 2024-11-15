import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { SearchView } from './searchView';

describe('SearchView', () => {
  const onSearchMock = jest.fn();

  beforeEach(() => {
    onSearchMock.mockClear();
  });

  it('renders the component with default values', () => {
    render(<SearchView onSearch={onSearchMock} />);
    expect(screen.getByPlaceholderText('Search by category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('changes search type and updates placeholder text', () => {
    render(<SearchView onSearch={onSearchMock} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'area' } });

    expect(selectElement.value).toBe('area');
    expect(screen.getByPlaceholderText('Search by area')).toBeInTheDocument();
  });

  it('updates suggestions when typing in the query input', async () => {
    render(<SearchView onSearch={onSearchMock} />);

    // Change the dropdown to "area"
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'area' } });

    // Type into the input to trigger suggestions
    fireEvent.change(screen.getByPlaceholderText('Search by area'), { target: { value: 'a' } });

    // Wait for suggestions to appear
    expect(await screen.findByText('American')).toBeInTheDocument();
  });

  it('clears suggestions when a suggestion is clicked', () => {
    render(<SearchView onSearch={onSearchMock} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'area' } });
    fireEvent.change(screen.getByPlaceholderText('Search by area'), { target: { value: 'a' } });

    const suggestionItem = screen.getByText('American');
    fireEvent.click(suggestionItem);

    expect(screen.queryByText('American')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by area').value).toBe('American');
  });

  it('calls onSearch with correct searchType and query on search button click', () => {
    render(<SearchView onSearch={onSearchMock} />);

    fireEvent.change(screen.getByPlaceholderText('Search by category'), { target: { value: 'Beef' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearchMock).toHaveBeenCalledWith('category', 'Beef');
  });
});
