import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BookmarkIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  UserCircleIcon as UserOutline,
  PlusIcon as PlusOutline,
  ChatBubbleLeftIcon as ChatOutline,
} from "@heroicons/react/24/outline";
import useAuth from "../contexts/useAuthContext";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: HomeOutline, 
      activeIcon: HomeIcon 
    },
    { 
      path: "/recipes", 
      label: "Search", 
      icon: SearchOutline, 
      activeIcon: MagnifyingGlassIcon 
    },
    { 
      path: "/create-recipe", 
      label: "Create", 
      icon: PlusOutline, 
      activeIcon: PlusIcon 
    },
    ...(user ? [
      {
        path: `/profile/${user?.id}`,
        label: "Profile",
        icon: UserOutline,
        activeIcon: UserCircleIcon,
      },
    ] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-64 min-h-screen bg-white border-r border-orange-100 shadow-sm">
      {/* Logo/Brand */}
      <div className="p-6 lg:p-8">
        <Link to="/" className="flex items-center justify-center lg:justify-start group">
          <div className="relative">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <span className="text-white font-bold text-lg lg:text-xl">R</span>
            </div>
          </div>
          <h1 className="hidden lg:block ml-4 text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
            RecipeHub
          </h1>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 lg:px-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = isActive(item.path) ? item.activeIcon : item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`
                    flex items-center justify-center lg:justify-start p-3 lg:p-4 rounded-2xl
                    transition-all duration-200 group relative
                    ${active 
                      ? 'bg-orange-50 text-orange-700' 
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }
                  `}
                >
                  <div className="relative">
                    <Icon className={`h-7 w-7 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-orange-600' : ''}`} />
                    {active && (
                      <div className="absolute -inset-1 bg-orange-200 rounded-full opacity-30 animate-pulse"></div>
                    )}
                  </div>
                  <span className={`hidden lg:block ml-4 font-medium text-base transition-colors duration-200 ${active ? 'text-orange-700' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-l-full lg:hidden"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-3 lg:p-6 border-t border-orange-100">
        {user ? (
          <>
            
            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full mt-2 flex items-center justify-center lg:justify-start p-3 lg:p-4 rounded-2xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:block ml-4 font-medium text-base">
                Logout
              </span>
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <Link 
              to="/login" 
              className="flex items-center justify-center lg:justify-start p-3 lg:p-4 rounded-2xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
            >
              <AiOutlineLogin className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:block ml-4 font-medium text-base">
                Login
              </span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center justify-center lg:justify-start p-3 lg:p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <AiOutlineLogout className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:block ml-4 font-medium text-base">
                Sign Up
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative z-[10000]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Logout Confirmation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;