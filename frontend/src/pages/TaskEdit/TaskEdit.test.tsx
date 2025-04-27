// TaskEdit.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskEdit from './TaskEdit';
import axiosInstance from '../../utils/axios';
import { isAuthenticated } from '../../utils/authUtils';

// Mock axios
vi.mock('../../utils/axios', () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));


vi.mock('../../utils/authUtils', () => ({
    getUsername: vi.fn().mockResolvedValue('mockedUsername'),
    isAuthenticated: vi.fn(),
}));

// Mock useNavigate and useParams
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }),
    };
});

describe('Task Edit Page', () => {
    const renderTaskEditPage = () => {
        return render(
            <BrowserRouter>
                <TaskEdit />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads and displays', async () => {
        vi.mocked(isAuthenticated).mockResolvedValue(true);
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({
            data: { data: { id: '1', title: 'Old Task', description: 'Old Desc', status: 'PENDING' } },
        });

        renderTaskEditPage();

        const navbar = await screen.findByRole('navigation');
        const taskEditBox = await screen.findByTestId('taskEdit-box');

        expect(navbar).toBeInTheDocument();
        expect(taskEditBox).toBeInTheDocument();
    });
    


    it('navigates back home when clicking Cancel button', async () => {
        vi.mocked(isAuthenticated).mockResolvedValue(true);
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({
            data: { data: { id: '1', title: 'Old Task', description: 'Old Desc', status: 'PENDING' } },
        });

        renderTaskEditPage();

        const cancelButton = await screen.findByRole('button', { name: /cancel/i });

        fireEvent.click(cancelButton);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('redirects to login page if not authenticated', async () => {
        vi.mocked(isAuthenticated).mockResolvedValue(false);
    
        renderTaskEditPage();
    
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
    
});
