import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import TaskEditBox from '../../components/taskEditBox/TaskEditBox';
import { isAuthenticated } from '../../utils/authUtils';
const TaskEdit: React.FC = () => {
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
        <TaskEditBox />
      </div>
    </div>
  );
};

export default TaskEdit;