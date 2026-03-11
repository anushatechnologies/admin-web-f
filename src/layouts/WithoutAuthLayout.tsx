// src/layouts/WithoutAuthLayout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const WithoutAuthLayout: React.FC = () => {
  useEffect(() => {
    // Force light theme on login/auth pages to prevent dark mode layout leakage
    document.body.classList.remove('dark-theme', 'glass-theme');
    document.body.classList.add('light-theme');
  }, []);

  return (
    <div className="relative">
      <Outlet />
    </div>
  );
};

export default WithoutAuthLayout;
