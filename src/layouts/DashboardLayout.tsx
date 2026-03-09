import React from 'react';
import SideNav from '@components/layout/SideNav/SideNav';
import AppBar from '@components/layout/AppBar/AppBar';
import { Box } from '@mui/material';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SideNav />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <AppBar />
        <main className="flex-1 p-2 bg-gray-50 overflow-auto">
          <Box className="max-w-full overflow-x-auto">{children}</Box>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
