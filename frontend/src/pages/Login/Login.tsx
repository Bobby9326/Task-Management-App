import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import LoginBox from '../../components/loginBox/LoginBox';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div data-testid="login-box" className="container mx-auto px-4 py-8">
        <LoginBox />
      </div>
    </div>
  );
};

export default Login;