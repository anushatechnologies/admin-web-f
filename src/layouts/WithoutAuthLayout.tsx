// src/layouts/WithoutAuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const WithoutAuthLayout: React.FC = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default WithoutAuthLayout;
