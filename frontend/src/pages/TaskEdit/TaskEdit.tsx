import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import TaskEditBox from '../../components/taskEditBox/TaskEditBox';
import { isAuthenticated } from '../../utils/authUtils';

const TaskEdit: React.FC = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setAuthenticated(auth);
      if (!auth) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);
  
  if (!authenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div data-testid="taskEdit-box" className="container mx-auto px-4 py-8">
        <TaskEditBox />
      </div>
    </div>
  );
};

export default TaskEdit;
