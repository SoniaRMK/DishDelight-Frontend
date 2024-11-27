import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignupView } from './signupView';
import { MemoryRouter } from 'react-router-dom';
global.React = React;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SignupView', () => {
  const mockNavigate = jest.requireMock('react-router-dom').useNavigate;
  
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('renders the SignupView with all input fields and the submit button', () => {
    render(
      <MemoryRouter>
        <SignupView />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Enter a username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('allows user to type in all input fields', () => {
    render(
      <MemoryRouter>
        <SignupView />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter a username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Enter a password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });

    expect(screen.getByPlaceholderText('Enter a username').value).toBe('testuser');
    expect(screen.getByPlaceholderText('Enter a password').value).toBe('password123');
    expect(screen.getByPlaceholderText('Enter your email').value).toBe('test@example.com');
  });
});
