import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterScreen from './Pages/RegisterScreen';

test('renders learn react link', () => {
  render(<RegisterScreen />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
