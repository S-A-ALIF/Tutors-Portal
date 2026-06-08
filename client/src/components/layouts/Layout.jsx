import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="grid grid-cols-[220px_1fr] grid-rows-[64px_1fr] h-screen overflow-hidden bg-[#f7f7fb]">
            <div className="col-span-2 border-b border-gray-200">
                <Topbar />
            </div>
            <div className="w-[220px] h-full overflow-y-auto">
                <Sidebar />
            </div>
            <main className="p-[28px] overflow-y-auto bg-[#f7f7fb]">
                <Outlet /> 
            </main>
        </div>
    );
};

export default Layout;