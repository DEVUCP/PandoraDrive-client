import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const registerScreen = screen.getByTestId('register-screen');
  expect(registerScreen).toBeInTheDocument();
});
