import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import RegisterBox from '../../components/registerBox/RegisterBox';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div data-testid="register-box" className="container mx-auto px-4 py-8">
        <RegisterBox />
      </div>
    </div>
  );
};

export default Login;