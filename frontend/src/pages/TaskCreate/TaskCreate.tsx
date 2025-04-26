import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import TaskCreateBox from '../../components/taskCreateBox/TaskCreateBox';
import { isAuthenticated } from '../../utils/authUtils';

const TaskCreate: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <TaskCreateBox />
      </div>
    </div>
  );
};

export default TaskCreate;