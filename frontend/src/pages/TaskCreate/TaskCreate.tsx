import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import TaskCreateBox from '../../components/taskCreateBox/TaskCreateBox';
import { isAuthenticated } from '../../utils/authUtils';

const TaskCreate: React.FC = () => {
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

  if (authenticated === null) {
    return null; // กำลังโหลดสถานะ
  }

  if (!authenticated) {
    return null; // ถ้าไม่ได้ auth, รอ redirect
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div data-testid="taskCreate-box" className="container mx-auto px-4 py-8">
        <TaskCreateBox />
      </div>
    </div>
  );
};

export default TaskCreate;
