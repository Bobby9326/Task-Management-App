import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskCreate from './TaskCreate';
import axiosInstance from '../../utils/axios';
import { isAuthenticated } from '../../utils/authUtils'; // <-- เพิ่มตรงนี้

vi.mock('../../utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../../utils/authUtils', () => ({
    getUsername: vi.fn().mockResolvedValue('mockedUsername'),
    isAuthenticated: vi.fn(),
  }));
  

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TaskCreate Page', () => {
  const renderTaskCreatePage = async () => {
    return render(
      <BrowserRouter>
        <TaskCreate />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    renderTaskCreatePage();

    const navbar = await screen.findByRole('navigation');
    const taskCreate = await screen.findByTestId('taskCreate-box');

    expect(navbar).toBeInTheDocument();
    expect(taskCreate).toBeInTheDocument();
  });

  it('handles form submit successfully', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    renderTaskCreatePage();
    const titleInput = await screen.findByPlaceholderText(/enter task title/i);
    const descriptionInput = await screen.findByPlaceholderText(/enter task description/i);
    const submitButton = await screen.findByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Some Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/tasks', {
        title: 'New Task',
        description: 'Some Description',
      });
    });
  });

  it('handles form submit fail', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Failed to create task'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderTaskCreatePage();
    const titleInput = await screen.findByPlaceholderText(/enter task title/i);
    const descriptionInput = await screen.findByPlaceholderText(/enter task description/i);
    const submitButton = await screen.findByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Some Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error creating task:'), expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('navigates back home when clicking Cancel button', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    renderTaskCreatePage();
    const cancelButton = await screen.findByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('redirects to login page if not authenticated', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(false);

    renderTaskCreatePage();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
