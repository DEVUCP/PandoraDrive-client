import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterScreen from './Pages/RegisterScreen';
import { ipContext, portContext } from './index';

test('renders learn react link', () => {
  const mockPortContext = {
    port: "55551",
    setPort: jest.fn()
  };

  const mockIpContext = {
    ip: "",
    setIp: jest.fn()
  };

  render(
    <ipContext.Provider value={mockIpContext}>
      <portContext.Provider value={mockPortContext}>
        <RegisterScreen />
      </portContext.Provider>
    </ipContext.Provider>
  );

  const linkElement = screen.getByText(/Welcome to Pandora Home Drive!/i);
  expect(linkElement).toBeInTheDocument();
});
