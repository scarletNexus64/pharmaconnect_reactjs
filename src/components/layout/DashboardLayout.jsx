import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Activity, Bell, LogOut, Home, Building, FolderOpen,
  Pill, MapPin, Package, ShoppingCart, Users
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home, path: '/dashboard' },
    { id: 'organizations', label: 'Organisations', icon: Building, path: '/organizations' },
    { id: 'projects', label: 'Projets', icon: FolderOpen, path: '/projects' },
    { id: 'users', label: 'Utilisateurs', icon: Users, path: '/users' },
    { id: 'medications', label: 'Médicaments', icon: Pill, path: '/medications' },
    { id: 'health-facilities', label: 'Formations', icon: MapPin, path: '/health-facilities' },
    { id: 'stock', label: 'Stock', icon: Package, path: '/stock' },
    { id: 'dispensation', label: 'Dispensation', icon: ShoppingCart, path: '/dispensation' }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
              </Link>
              <div className="hidden md:block text-sm text-gray-500">
                {user?.organization_name}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-700 font-medium">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {user?.access_level === 'COORDINATION' ? 'Coordinateur' :
                       user?.access_level === 'PROJECT' ? 'Projet' : 'Formation Sanitaire'}
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-500"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigation.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    active
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
