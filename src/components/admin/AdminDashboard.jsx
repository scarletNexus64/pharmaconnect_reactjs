import React, { useState } from 'react';
import { Users, Building, Shield, Settings, Activity, AlertTriangle, UserCheck, UserX, CheckCircle, XCircle } from 'lucide-react';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import OrganizationManagement from './OrganizationManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const adminStats = [
    { label: 'Utilisateurs Totaux', value: '2,547', icon: Users, color: 'bg-blue-500', change: '+12% ce mois' },
    { label: 'Organisations', value: '45', icon: Building, color: 'bg-green-500', change: '+3 nouvelles' },
    { label: 'Rôles Actifs', value: '12', icon: Shield, color: 'bg-purple-500', change: '2 personnalisés' },
    { label: 'Sessions Actives', value: '156', icon: Activity, color: 'bg-orange-500', change: 'Temps réel' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_created',
      user: 'Dr. Marie Dubois',
      action: 'Nouvel utilisateur créé',
      organization: 'Médecins du Monde',
      time: '5 min ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'role_modified',
      user: 'Admin System',
      action: 'Rôle "Coordinateur" modifié',
      organization: 'Global',
      time: '15 min ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'org_created',
      user: 'Super Admin',
      action: 'Organisation "Action Contre Faim" ajoutée',
      organization: 'System',
      time: '1h ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'security_alert',
      user: 'Security Bot',
      action: 'Tentative accès non autorisé détectée',
      organization: 'Security',
      time: '2h ago',
      status: 'warning'
    },
    {
      id: 5,
      type: 'user_disabled',
      user: 'Admin ONG',
      action: 'Utilisateur "Paul Martin" désactivé',
      organization: 'MSF',
      time: '3h ago',
      status: 'error'
    }
  ];

  const securityAlerts = [
    {
      id: 1,
      type: 'Accès Suspect',
      message: 'Tentatives de connexion multiples depuis IP inconnue',
      severity: 'high',
      time: '10 min ago',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      type: 'Permission Elevée',
      message: 'Attribution rôle Super Admin à nouvel utilisateur',
      severity: 'medium',
      time: '1h ago',
      user: 'admin.system@pharmaconnect.org'
    },
    {
      id: 3,
      type: 'Export Massif',
      message: 'Export de données importantes par utilisateur terrain',
      severity: 'medium',
      time: '2h ago',
      records: '15,000 enregistrements'
    }
  ];

  const quickActions = [
    {
      title: 'Créer Utilisateur',
      description: 'Ajouter un nouvel utilisateur au système',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      action: () => setActiveTab('users')
    },
    {
      title: 'Nouvelle Organisation',
      description: 'Enregistrer une ONG ou programme',
      icon: Building,
      color: 'bg-green-100 text-green-600',
      action: () => setActiveTab('organizations')
    },
    {
      title: 'Gérer Rôles',
      description: 'Configurer permissions et accès',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600',
      action: () => setActiveTab('roles')
    },
    {
      title: 'Paramètres Système',
      description: 'Configuration globale',
      icon: Settings,
      color: 'bg-gray-100 text-gray-600',
      action: () => alert('Paramètres système à implémenter')
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_created': return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'user_disabled': return <UserX className="w-4 h-4 text-red-500" />;
      case 'role_modified': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'org_created': return <Building className="w-4 h-4 text-green-500" />;
      case 'security_alert': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'roles', label: 'Rôles & Permissions', icon: Shield },
    { id: 'organizations', label: 'Organisations', icon: Building }
  ];

  if (activeTab === 'users') {
    return <UserManagement />;
  }

  if (activeTab === 'roles') {
    return <RoleManagement />;
  }

  if (activeTab === 'organizations') {
    return <OrganizationManagement />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration PharmaConnect</h1>
          <p className="text-gray-600 mt-1">Gestion centralisée des utilisateurs, rôles et organisations</p>
        </div>
        <div className="flex space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-gray-900">{action.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">par {activity.user}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">{activity.organization}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes sécurité */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Alertes Sécurité
            </h3>
            <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
              Paramètres
            </button>
          </div>
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs mt-1">{alert.message}</p>
                    {alert.ip && (
                      <p className="text-xs text-gray-600 mt-1">IP: {alert.ip}</p>
                    )}
                    {alert.user && (
                      <p className="text-xs text-gray-600 mt-1">Utilisateur: {alert.user}</p>
                    )}
                    {alert.records && (
                      <p className="text-xs text-gray-600 mt-1">{alert.records}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">{alert.time}</span>
                    <div className="flex space-x-1 mt-2">
                      <button className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200">
                        <CheckCircle className="w-3 h-3" />
                      </button>
                      <button className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200">
                        <XCircle className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 text-sm font-medium">
            Voir toutes les alertes sécurité
          </button>
        </div>
      </div>

      {/* Statistiques d'utilisation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation du Système</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-gray-600 mt-1">Disponibilité système</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">2.3s</div>
            <div className="text-sm text-gray-600 mt-1">Temps de réponse moyen</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600 mt-1">Utilisateurs connectés</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;