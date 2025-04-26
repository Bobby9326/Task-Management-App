import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsername, isAuthenticated } from '../../utils/authUtils';
import axiosInstance from "../../utils/axios";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchAuthData = async () => {
      const user = await getUsername();
      const auth = await isAuthenticated();
      setUsername(user);
      setAuthenticated(auth);
    };

    fetchAuthData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold flex items-center">
          <span className="text-orange-500 mr-2">●</span> Task Manager
        </Link>
        <div>
          {authenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Hello, {username}</span>
              <button 
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded border border-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;