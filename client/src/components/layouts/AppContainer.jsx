import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const AppContainer = ({ children }) => {
  return (
    <div className="grid grid-cols-[220px_1fr] grid-rows-[auto_1fr] min-h-screen">
      <Topbar />
      <Sidebar />
      <main className="p-[28px] overflow-y-auto bg-[#f7f7fb]">
        {children}
      </main>
    </div>
  );
};

export default AppContainer;