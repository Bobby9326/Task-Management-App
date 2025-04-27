// Task.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import Task from './Task';
import { TaskStatus } from '../../types/task';
import axiosInstance from '../../utils/axios';

// Mock useNavigate และ axios
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../utils/axios', () => ({
  default: {
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Task Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task Title',
    description: 'Test Task Description',
    status: TaskStatus.PENDING,
    userId: 'user-123',
  };

  const mockOnDelete = vi.fn();
  const mockOnUpdateStatus = vi.fn();

  const renderTask = (task = mockTask) =>
    render(
      <BrowserRouter>
        <Task task={task} onDelete={mockOnDelete} onUpdateStatus={mockOnUpdateStatus} />
      </BrowserRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays', () => {
    renderTask();

    const titel = screen.getByText('Test Task Title')
    const description = screen.getByText('Test Task Description')
    const status = screen.getByText('PENDING')
    const statusButton = screen.getByTitle('Update status')
    const editButton = screen.getByTitle('Edit task')
    const deleteButton = screen.getByTitle('Delete task')

    expect(titel).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(status).toBeInTheDocument();
    expect(statusButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
  
  it('navigates to edit page when edit button is clicked', () => {
    renderTask();

    const editButton = screen.getByTitle('Edit task');
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/task/edit/${mockTask.id}`);
  });

  it('calls delete API and onDelete when delete confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
    vi.mocked(axiosInstance.delete).mockResolvedValueOnce({});
    renderTask();

    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith(`/tasks/${mockTask.id}`);
      expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    });
  });

  it('logs error when delete API fails', async () => {
    const mockError = new Error('Delete failed');
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
    vi.mocked(axiosInstance.delete).mockRejectedValueOnce(mockError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderTask();

    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting task:', mockError);
    });
    consoleErrorSpy.mockRestore();
  });

  it('does not call delete API if delete not confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false);
    renderTask();

    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.delete).not.toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('calls patch API and onUpdateStatus when update status button clicked', async () => {
    vi.mocked(axiosInstance.patch).mockResolvedValueOnce({});
    renderTask();

    const updateButton = screen.getByTitle('Update status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(`/tasks/${mockTask.id}`, { status: TaskStatus.IN_PROGRESS });
      expect(mockOnUpdateStatus).toHaveBeenCalled();
    });
  });

  it('logs error when update status API fails', async () => {
    const mockError = new Error('Update status failed');
    vi.mocked(axiosInstance.patch).mockRejectedValueOnce(mockError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderTask();

    const updateButton = screen.getByTitle('Update status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating task status:', mockError);
    });
    consoleErrorSpy.mockRestore();
  });

  it('disables update button if task is COMPLETED', () => {
    const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    renderTask(completedTask);

    const updateButton = screen.getByTitle('Task already completed');

    expect(updateButton).toBeDisabled();
  });

  it('updates status from PENDING to IN_PROGRESS', async () => {
    vi.mocked(axiosInstance.patch).mockResolvedValueOnce({});
    renderTask();
  
    fireEvent.click(screen.getByTitle('Update status'));
  
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(`/tasks/${mockTask.id}`, { status: TaskStatus.IN_PROGRESS });
    });
  });
  
  it('updates status from IN_PROGRESS to COMPLETED', async () => {
    vi.mocked(axiosInstance.patch).mockResolvedValueOnce({});
    renderTask({ ...mockTask, status: TaskStatus.IN_PROGRESS });
  
    fireEvent.click(screen.getByTitle('Update status'));
  
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(`/tasks/${mockTask.id}`, { status: TaskStatus.COMPLETED });
    });
  });
  
  it('does not update status for unknown status', async () => {
    renderTask({ ...mockTask, status: 'UNKNOWN' as TaskStatus });
  
    const updateButton = screen.getByTitle('Update status');
    fireEvent.click(updateButton);
  
    await waitFor(() => {
      expect(axiosInstance.patch).not.toHaveBeenCalled();
    });
  });
  
});
