// login.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

vi.mock('../../utils/authUtils', () => ({
  isAuthenticated: vi.fn(),
  getUsername: vi.fn().mockResolvedValue('mockedUsername'),
}));

describe('Login Page', () => {
  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('loads and displays', () => {
    // Arrange & Act
    renderLoginPage();

    // Assert
    const navbar = screen.getByRole('navigation'); 
    const loginBox = screen.getByTestId('login-box'); 

    expect(navbar).toBeInTheDocument();
    expect(loginBox).toBeInTheDocument();
  });
});
