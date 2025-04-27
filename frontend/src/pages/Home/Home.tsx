import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Task from '../../components/task/Task';
import { Task as TaskType } from '../../types/task';
import axiosInstance from '../../utils/axios';
import { isAuthenticated } from '../../utils/authUtils';
import { FaPlus } from 'react-icons/fa';

const Home: React.FC = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const fetchAuthData = async () => {
          const auth = await isAuthenticated();
          setAuthenticated(auth);
        };
        fetchAuthData();
      }, []);
      
      useEffect(() => {
        const fetchTasks = async () => {
          if (authenticated) {
            try {
              const response = await axiosInstance.get('/tasks');
              setTasks(response.data.data || []);
            } catch (error) {
              console.error('Error fetching tasks:', error);
              setError('Failed to load tasks. Please try again.');
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        };
      
        fetchTasks();
      }, [authenticated]);
      

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await axiosInstance.get('/tasks');
            setTasks(response.data.data || []);
        } catch (error) {
            console.error('Error refreshing tasks:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {!authenticated ? (
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-white">Welcome to Task Manager</h2>
                        <p className="mb-6 text-gray-300">Please login to view and manage your tasks.</p>
                        <Link
                            to="/login"
                            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300"
                        >
                            Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
                            <button
                                onClick={() => {navigate('/task/create')}}
                                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300"
                            >
                                <FaPlus className="mr-2" />
                                Add Task
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div role="status" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                                <p className="text-gray-300 mb-4">You don't have any tasks yet.</p>
                                <button
                                    onClick={() => navigate('/task/create')}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                                >
                                    Create Your First Task
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        onDelete={handleDeleteTask}
                                        onUpdateStatus={handleUpdateStatus}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;