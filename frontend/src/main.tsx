import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);