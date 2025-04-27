import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TaskCreateBox from './TaskCreateBox';
import axiosInstance from '../../utils/axios';

// Mock axios instance
vi.mock('../../utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TaskCreateBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTaskCreateBox = () => {
    return render(
      <BrowserRouter>
        <TaskCreateBox />
      </BrowserRouter>
    );
  };

  it('loads and displays', () => {
    renderTaskCreateBox();
    const heading = screen.getByRole('heading', { name: /create new task/i })
    const title = screen.getByLabelText(/title/i)
    const description = screen.getByLabelText(/description/i)
    const createButton = screen.getByRole('button', { name: /create task/i })
    const cancleButton = screen.getByRole('button', { name: /cancel/i })

    expect(heading).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
    expect(cancleButton).toBeInTheDocument();
  });

  it('shows validation error when title is empty', async () => {
    renderTaskCreateBox();
    const submitButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/title is required/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('submits form and navigates on success', async () => {
    renderTaskCreateBox();
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({});
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a description of test task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/tasks', {
        title: 'Test Task',
        description: 'This is a description of test task',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('logs error when submit fails', async () => {
    renderTaskCreateBox();
    const mockError = new Error('Network Error');
    vi.mocked(axiosInstance.post).mockRejectedValueOnce(mockError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    // Act
    fireEvent.change(titleInput, { target: { value: 'Error Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'This task will fail' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/tasks', {
        title: 'Error Task',
        description: 'This task will fail',
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating task:', mockError);
    });
    consoleErrorSpy.mockRestore();
  });

  it('navigates back to home when cancel is clicked', () => {
    renderTaskCreateBox();
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  

});
