import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import { Sidebar, ModernSidebarDemo } from './ModernSidebar';

function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <ModernSidebarDemo />
      </Sidebar>

      <div className="flex flex-col md:pl-20">
        <Header onMenuClick={() => setOpen(!open)} />
        
        <main className="flex-1 pt-16 md:pt-6 min-h-screen">
          <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
