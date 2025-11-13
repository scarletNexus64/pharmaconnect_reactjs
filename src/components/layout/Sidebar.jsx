import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Pill, Activity, BarChart3, MapPin, 
  Settings, Users, Building, Upload, Download, Bell, LogOut,
  ChevronDown, ChevronRight, Camera, FileText, Calendar,
  Shield, Globe, AlertTriangle, TrendingUp
} from 'lucide-react';

const Sidebar = ({ userRole, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['dashboard']);

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Menu configuration based on user role
  const getMenuItems = () => {
    const baseMenus = [
      {
        id: 'dashboard',
        label: 'Tableau de Bord',
        icon: LayoutDashboard,
        path: '/dashboard',
        roles: ['Super Admin', 'Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site']
      }
    ];

    const adminMenus = [
      {
        id: 'administration',
        label: 'Administration',
        icon: Shield,
        roles: ['Super Admin'],
        children: [
          { label: 'Dashboard Admin', path: '/admin', icon: LayoutDashboard },
          { label: 'Gestion Utilisateurs', path: '/admin/users', icon: Users },
          { label: 'Rôles & Permissions', path: '/admin/roles', icon: Shield },
          { label: 'Organisations', path: '/admin/organizations', icon: Building },
          { label: 'Paramètres Système', path: '/admin/settings', icon: Settings }
        ]
      }
    ];

    const orgMenus = [
      {
        id: 'projects',
        label: 'Projets & Sites',
        icon: Globe,
        roles: ['Admin ONG', 'Gestionnaire Projet'],
        children: [
          { label: 'Projets', path: '/projects', icon: Globe },
          { label: 'Formations Sanitaires', path: '/health-facilities', icon: MapPin },
          { label: 'Équipes', path: '/teams', icon: Users }
        ]
      }
    ];

    const medicationMenus = [
      {
        id: 'medications',
        label: 'Médicaments',
        icon: Pill,
        roles: ['Super Admin', 'Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site'],
        children: [
          { label: 'Référentiel', path: '/medications', icon: Pill },
          { label: 'Listes Standard', path: '/standard-lists', icon: FileText },
          { label: 'Substitutions', path: '/substitutions', icon: TrendingUp }
        ]
      }
    ];

    const stockMenus = [
      {
        id: 'stock',
        label: 'Gestion Stocks',
        icon: Package,
        roles: ['Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site'],
        children: [
          { label: 'Stock Actuel', path: '/stock/current', icon: Package },
          { label: 'Entrées', path: '/stock/entries', icon: Upload },
          { label: 'Inventaires', path: '/stock/inventories', icon: FileText },
          { label: 'Mouvements', path: '/stock/movements', icon: Activity }
        ]
      }
    ];

    const dispensationMenus = [
      {
        id: 'dispensation',
        label: 'Dispensation',
        icon: Activity,
        roles: ['Gestionnaire Projet', 'Utilisateur Site'],
        children: [
          { label: 'Nouvelle Dispensation', path: '/dispensation/new', icon: Camera },
          { label: 'Historique', path: '/dispensation/history', icon: FileText },
          { label: 'Rapports', path: '/dispensation/reports', icon: BarChart3 }
        ]
      }
    ];

    const analyticsMenus = [
      {
        id: 'analytics',
        label: 'Analytics & Rapports',
        icon: BarChart3,
        roles: ['Super Admin', 'Admin ONG', 'Gestionnaire Projet'],
        children: [
          { label: 'Dashboard Analytics', path: '/analytics', icon: BarChart3 },
          { label: 'Pharmacoépidémiologie', path: '/analytics/pharmacoepi', icon: Activity },
          { label: 'Rapports Personnalisés', path: '/analytics/reports', icon: FileText },
          { label: 'Exports', path: '/exports', icon: Download }
        ]
      }
    ];

    const mapMenus = [
      {
        id: 'mapping',
        label: 'Cartographie',
        icon: MapPin,
        roles: ['Super Admin', 'Admin ONG'],
        children: [
          { label: 'Carte Interactive', path: '/map', icon: MapPin },
          { label: 'Suivi Logistique', path: '/map/logistics', icon: Activity },
          { label: 'Analyse Épidémio', path: '/map/epidemio', icon: TrendingUp }
        ]
      }
    ];

    const importExportMenus = [
      {
        id: 'import-export',
        label: 'Import/Export',
        icon: Upload,
        roles: ['Super Admin', 'Admin ONG', 'Gestionnaire Projet'],
        children: [
          { label: 'Import Données', path: '/import', icon: Upload },
          { label: 'Templates', path: '/templates', icon: FileText },
          { label: 'Historique', path: '/import/history', icon: Calendar }
        ]
      }
    ];

    const settingsMenus = [
      {
        id: 'settings',
        label: 'Paramètres',
        icon: Settings,
        roles: ['Super Admin', 'Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site'],
        children: [
          { label: 'Profil Utilisateur', path: '/settings/user', icon: Users },
          { label: 'Organisation', path: '/settings/organization', icon: Building },
          { label: 'Notifications', path: '/settings/notifications', icon: Bell }
        ]
      }
    ];

    // Combine menus based on role
    let allMenus = [...baseMenus];
    
    if (userRole === 'Super Admin') {
      allMenus = [...allMenus, ...adminMenus, ...orgMenus, ...medicationMenus, ...stockMenus, ...analyticsMenus, ...mapMenus, ...importExportMenus, ...settingsMenus];
    } else if (userRole === 'Admin ONG') {
      allMenus = [...allMenus, ...orgMenus, ...medicationMenus, ...stockMenus, ...analyticsMenus, ...mapMenus, ...importExportMenus, ...settingsMenus];
    } else if (userRole === 'Gestionnaire Projet') {
      allMenus = [...allMenus, ...orgMenus, ...medicationMenus, ...stockMenus, ...dispensationMenus, ...analyticsMenus, ...importExportMenus, ...settingsMenus];
    } else if (userRole === 'Utilisateur Site') {
      allMenus = [...allMenus, ...medicationMenus, ...stockMenus, ...dispensationMenus, ...settingsMenus];
    }

    return allMenus.filter(menu => menu.roles.includes(userRole));
  };

  const isActiveMenu = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-blue-400">PharmaConnect</h1>
              <p className="text-xs text-gray-400 mt-1">{userRole}</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {getMenuItems().map((menu) => (
          <div key={menu.id}>
            {/* Menu Principal */}
            <div
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                menu.children 
                  ? 'hover:bg-gray-800' 
                  : isActiveMenu(menu.path)
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-800'
              }`}
              onClick={() => {
                if (menu.children) {
                  toggleMenu(menu.id);
                } else {
                  handleNavigation(menu.path);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <menu.icon className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="font-medium">{menu.label}</span>
                )}
              </div>
              {!isCollapsed && menu.children && (
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  expandedMenus.includes(menu.id) ? 'rotate-180' : ''
                }`} />
              )}
            </div>

            {/* Sous-menus */}
            {menu.children && expandedMenus.includes(menu.id) && !isCollapsed && (
              <div className="ml-8 mt-2 space-y-1">
                {menu.children.map((submenu, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                      isActiveMenu(submenu.path)
                        ? 'bg-blue-600'
                        : 'hover:bg-gray-800'
                    }`}
                    onClick={() => handleNavigation(submenu.path)}
                  >
                    <submenu.icon className="w-4 h-4" />
                    <span className="text-sm">{submenu.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="mb-4">
            <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{localStorage.getItem('username') || 'Utilisateur'}</p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg hover:bg-red-600 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;