import React from 'react';
import { LogoIcon, LogoutIcon, HomeIcon, ChartBarIcon, XIcon } from './icons';
import { cn } from '../lib/utils';

type View = 'list' | 'form' | 'reports';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
  employeeName: string;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center p-3 w-full text-base font-normal rounded-lg transition duration-75 group",
          isActive
            ? "bg-sky-700 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="ml-3 flex-1 whitespace-nowrap text-left">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentView, employeeName, onLogout }) => {
  const sidebarClasses = cn(
    "fixed top-0 left-0 z-40 w-64 h-screen transition-transform md:translate-x-0 bg-gray-800",
    { "translate-x-0": isOpen, "-translate-x-full": !isOpen }
  );

  return (
    <>
      <aside className={sidebarClasses} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 pt-6 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-8 px-2.5">
            <div className="flex items-center">
              <LogoIcon className="h-8 w-8 text-sky-500" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-white ml-2">Cavinte</span>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-700 rounded-lg md:hidden">
              <XIcon className="w-6 h-6"/>
            </button>
          </div>
          <ul className="space-y-2 font-medium flex-grow">
            <NavItem
              icon={HomeIcon}
              label="Dashboard"
              isActive={currentView === 'list'}
              onClick={() => onNavigate('list')}
            />
            <NavItem
              icon={ChartBarIcon}
              label="Reports"
              isActive={currentView === 'reports'}
              onClick={() => onNavigate('reports')}
            />
          </ul>
          <div className="border-t border-gray-700 pt-4">
            <div className="p-2.5 rounded-lg bg-gray-700/50">
              <p className="text-sm text-gray-300">Signed in as</p>
              <p className="font-semibold text-white truncate">{employeeName}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center p-3 mt-2 w-full text-base font-normal rounded-lg transition duration-75 group text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogoutIcon className="h-6 w-6" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div
          className="bg-gray-900/50 fixed inset-0 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
