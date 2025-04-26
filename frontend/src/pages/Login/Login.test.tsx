// login.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Login from './Login';

describe('Login Page', () => {
  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('loads and displays Navbar and LoginBox', () => {
    // Arrange & Act
    renderLoginPage();

    // Assert
    const navbar = screen.getByRole('navigation'); 
    const loginBox = screen.getByTestId('login-box'); 

    expect(navbar).toBeInTheDocument();
    expect(loginBox).toBeInTheDocument();
  });
});
