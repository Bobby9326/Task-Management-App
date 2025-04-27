// login.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Register from './Register';

describe('Register Page', () => {
  vi.mock('../../utils/authUtils', () => ({
    isAuthenticated: vi.fn(),
    getUsername: vi.fn().mockResolvedValue('mockedUsername'),
  }));
  
  const renderRegisterPage = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('loads and displays', () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    const navbar = screen.getByRole('navigation'); 
    const register = screen.getByTestId('register-box'); 

    expect(navbar).toBeInTheDocument();
    expect(register).toBeInTheDocument();
  });
});
