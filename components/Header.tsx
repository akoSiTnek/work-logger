import React from 'react';
import { MenuIcon, ChevronLeftIcon } from './icons';

interface HeaderProps {
  title: string;
  view: 'list' | 'form' | 'reports';
  onBack: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, view, onBack, onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {view === 'form' ? (
          <div className="py-4">
            <button onClick={onBack} className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-slate-800 mb-2">
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onToggleSidebar}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md md:hidden"
                aria-label="Open sidebar"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-slate-800 ml-4 md:ml-0">{title}</h1>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;