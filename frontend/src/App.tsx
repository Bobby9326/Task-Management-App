import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import TaskCreate from './pages/TaskCreate/TaskCreate';
import TaskEdit from './pages/TaskEdit/TaskEdit';
import { isAuthenticated } from './utils/authUtils';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/task/create" 
          element={
            <ProtectedRoute>
              <TaskCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/task/edit/:id" 
          element={
            <ProtectedRoute>
              <TaskEdit />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;