import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TaskEditBox from './TaskEditBox';
import axiosInstance from '../../utils/axios';
import { TaskStatus } from '../../types/task';

vi.mock('../../utils/axios', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

describe('TaskEditBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTaskEditBox = () => {
    return render(
      <BrowserRouter>
        <TaskEditBox />
      </BrowserRouter>
    );
  };

  it('loads and display', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: {
          id: '123',
          title: 'Test Task',
          description: 'Test description',
          status: TaskStatus.PENDING,
        },
      },
    });
    renderTaskEditBox();
    const editTask = await screen.findByRole('heading', { name: /edit task/i })
    const title = screen.getByLabelText(/title/i)
    const description = screen.getByLabelText(/description/i)
    const status = screen.getByLabelText(/status/i)
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })


    expect(editTask).toBeInTheDocument();
    expect(title).toHaveValue('Test Task');
    expect(description).toHaveValue('Test description');
    expect(status).toHaveValue('pending');
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('shows error when task loading fails', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Failed to fetch'));
    renderTaskEditBox();
    const failed = await screen.findByText(/failed to load task details/i)
    
    expect(failed).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back home/i })).toBeInTheDocument();
  });

  it('navigates home when Cancel button clicked', async () => {
    // Arrange
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: {
          id: '123',
          title: 'Test Task',
          description: '',
          status: 'PENDING',
        },
      },
    });
    renderTaskEditBox();
    const cancelButton = await screen.findByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('submits updated task successfully', async () => {
    // Arrange
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: {
          id: '123',
          title: 'Old Title',
          description: '',
          status: TaskStatus.PENDING,
        },
      },
    });
    vi.mocked(axiosInstance.patch).mockResolvedValueOnce({});
    renderTaskEditBox();
    const titleInput = await screen.findByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /confirm/i });

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.click(submitButton);


    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith('/tasks/123', {
        title: 'Updated Title',
        description: '',
        status: TaskStatus.PENDING,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('logs error when submit fails', async () => {
    // Arrange
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: {
          id: '123',
          title: 'Test Task',
          description: '',
          status: TaskStatus.PENDING,
        },
      },
    });
    vi.mocked(axiosInstance.patch).mockRejectedValueOnce(new Error('Failed to update'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderTaskEditBox();
    const titleInput = await screen.findByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /confirm/i });

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating task:', expect.any(Error));
    });
    consoleErrorSpy.mockRestore();
  });

  it('navigates home when Go Back Home button clicked after error', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Failed to fetch'));
    renderTaskEditBox();
    const goBackButton = await screen.findByRole('button', { name: /go back home/i });
    const error = await screen.findByText(/Failed to load task details/i)

    fireEvent.click(goBackButton);
    expect(error).toBeInTheDocument();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates home when Go Back Home button clicked after task not found', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: null,
      },
    });

    renderTaskEditBox();
    const goBackButton = await screen.findByRole('button', { name: /go back home/i });
    const error = await screen.findByText(/Task not found/i)
    
    fireEvent.click(goBackButton);

    expect(error).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });


});
