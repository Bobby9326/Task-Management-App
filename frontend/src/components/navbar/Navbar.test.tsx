import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import Navbar from './Navbar';
import axiosInstance from '../../utils/axios';

// Mock axios และ useNavigate
vi.mock('../../utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock authUtils
vi.mock('../../utils/authUtils', () => ({
  getUsername: vi.fn().mockResolvedValue('mockedUsername'),
  isAuthenticated: vi.fn(),
}));

import { getUsername, isAuthenticated } from '../../utils/authUtils';
import { wait } from '../../utils/wait';

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('loads and displays login button when not authenticated', async () => {
    // Arrange
    vi.mocked(getUsername).mockResolvedValueOnce("");
    vi.mocked(isAuthenticated).mockResolvedValueOnce(false);

    // Act
    renderNavbar();

    // Assert
    const loginButton = await screen.findByRole('link', { name: /login/i });
    
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/login');
  });

  it('loads and displays username and logout button when authenticated', async () => {
    // Arrange
    vi.mocked(getUsername).mockResolvedValueOnce('MockUser');
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);

    // Act
    renderNavbar();

    // Assert
    const helloUser = await screen.findByText(/hello, mockuser/i);
    const logoutButton = await screen.findByRole('button', { name: /logout/i });

    expect(helloUser).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  it('calls logout API and navigates to login page on logout', async () => {
    // Arrange
    vi.mocked(getUsername).mockResolvedValueOnce('MockUser');
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({});

    renderNavbar();
    const logoutButton = await screen.findByRole('button', { name: /logout/i });

    // Act
    fireEvent.click(logoutButton);
    await wait(100);
    // Assert
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/logout');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows error in console when logout fails', async () => {
    // Arrange
    const mockError = new Error('Logout API failed');
    vi.mocked(getUsername).mockResolvedValueOnce('MockUser');
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);
    vi.mocked(axiosInstance.post).mockRejectedValueOnce(mockError);
  
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    renderNavbar();
  
    const logoutButton = await screen.findByRole('button', { name: /logout/i });
  
    // Act
    fireEvent.click(logoutButton);
  
    // Assert
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/logout');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', mockError);
    });
  
    consoleErrorSpy.mockRestore();
  });
  
});
