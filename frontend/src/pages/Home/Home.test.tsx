import '@testing-library/jest-dom';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import axiosInstance from '../../utils/axios';
import { isAuthenticated } from '../../utils/authUtils';
import { Task } from '../../types/task'; 


vi.mock('../../utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../utils/authUtils', () => ({
  isAuthenticated: vi.fn(),
  getUsername: vi.fn(),
}));



const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('loads and displays when unauthenticated', async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(false);
    renderHome();
  
    const navbar = await screen.findByRole('navigation'); 
    const loginButton = within(navbar).getByRole('link', { name: /login/i });    
    const welcomeBox = await screen.findByRole('heading', { name: /welcome to task manager/i });
    const container = welcomeBox.closest('div');
    const loginLink = within(container!).getByRole('link', { name: /login/i });
  
    expect(loginButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  it('loads and displays when authenticated', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    const mockedTasks = [
      { id: '1', title: 'Test Task 1', description: 'Description 1', status: 'PENDING' },
    ];
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockedTasks } });
    renderHome();
  
    expect(await screen.findByRole('heading', { name: /my tasks/i })).toBeInTheDocument();
    expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
  });
  

  it('shows error message when task loading fails', async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Failed to fetch'));
    renderHome();

    const failLoad = await screen.findByText(/failed to load tasks/i)

    expect(failLoad).toBeInTheDocument();
  });

  it('navigates to create task page when clicking Add Task button', async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: [],
      },
    });
    renderHome();
    const addButton = await screen.findByRole('button', { name: /add task/i });

    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/task/create');
  });

  it('navigates to create task page when clicking Create Your First Task button', async () => {
    // Arrange
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        data: [],
      },
    });
    renderHome();
    const createFirstTaskButton = await screen.findByRole('button', { name: /create your first task/i });

    fireEvent.click(createFirstTaskButton);

    expect(mockNavigate).toHaveBeenCalledWith('/task/create');
  });

  it('removes task from the list after clicking delete', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    const mockedTasks = [{ id: '1', title: 'Task 1', description: 'desc', status: 'PENDING' }];
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockedTasks } });
    vi.mocked(axiosInstance.delete).mockResolvedValue({});
    renderHome();
    const taskTitle = await screen.findByText('Task 1');
    expect(taskTitle).toBeInTheDocument();
  
    const deleteButton = screen.getByTitle('Delete task'); 
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(taskTitle).not.toBeInTheDocument();
    });
  });


  it('refreshes tasks when clicking update status button', async () => {
    vi.mock('../../components/task/Task', () => ({
      default: ({ task, onDelete, onUpdateStatus }: { task: Task; onDelete: (id: string) => void; onUpdateStatus: () => void }) => (
        <div>
          <p>{task.title}</p>
          <button onClick={() => onUpdateStatus()} data-testid={`update-${task.id}`}>
            Update Status
          </button>
          <button onClick={() => onDelete(task.id)} title="Delete task">
            Delete
          </button>
        </div>
      ),
    }));
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    const initialTasks = [
      { id: '1', title: 'Old Task', description: 'desc', status: 'PENDING' },
    ];
    const refreshedTasks = [
      { id: '1', title: 'Updated Task', description: 'desc', status: 'COMPLETED' },
    ];
    vi.mocked(axiosInstance.get)
      .mockResolvedValueOnce({ data: { data: initialTasks } }) 
      .mockResolvedValueOnce({ data: { data: refreshedTasks } });
    renderHome();
    const oldTask = await screen.findByText('Old Task')
    expect(oldTask).toBeInTheDocument();
    const updateButton = screen.getByTestId('update-1');

    fireEvent.click(updateButton);
    const updateTask = await screen.findByText('Updated Task')
  
    expect(updateTask).toBeInTheDocument();
  });
  

  it('refreshes tasks fails when clicking update status button', async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    const initialTasks = [
      { id: '1', title: 'Old Task', description: 'desc', status: 'PENDING' },
    ];
    vi.mocked(axiosInstance.get)
      .mockResolvedValueOnce({ data: { data: initialTasks } }) 
      .mockRejectedValueOnce(new Error('Failed to refresh tasks')); 
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderHome();
    const oldTask = await screen.findByText('Old Task')
    expect(oldTask).toBeInTheDocument();
    const updateButton = screen.getByTestId('update-1');

    fireEvent.click(updateButton);
  
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error refreshing tasks'), expect.any(Error));
    });
    consoleErrorSpy.mockRestore();
  });
  
  

});
