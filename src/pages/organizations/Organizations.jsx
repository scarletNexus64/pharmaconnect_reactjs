import React, { useState, useEffect } from 'react';
import {
  Building, Users, MapPin, Calendar, ChevronRight,
  Activity, Package, AlertTriangle, TrendingUp, Bell, LogOut
} from 'lucide-react';
import Card from '../../components/ui/Card';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganizations();
      setOrganizations(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des organisations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des organisations...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
                </div>
                <div className="hidden md:block text-sm text-gray-500">
                  Gestion des Organisations
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <button 
                    onClick={() => window.location.href = '/profile'}
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
                        Administrateur Plateforme
                      </div>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="w-6 h-6" />
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 font-medium">Organisations</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mes Organisations</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos organisations et accédez aux détails de chaque structure.
              Les nouvelles organisations doivent être créées via l'interface d'administration Django.
            </p>
          </div>

          {/* Organizations Grid */}
          {organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        org.type === 'NGO' ? 'bg-green-100 text-green-800' :
                        org.type === 'GOVERNMENT' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {org.type === 'NGO' ? 'ONG' : 
                         org.type === 'GOVERNMENT' ? 'Gouvernement' : org.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Code: {org.code}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{org.country || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Créée le {new Date(org.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {org.contact_email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{org.contact_email}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => window.location.href = `/organizations/${org.id}`}
                      className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      Voir les détails
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune organisation trouvée
                </h3>
                <p className="text-gray-500">
                  Aucune organisation n'est associée à votre compte.
                  Contactez l'administrateur système pour être ajouté à une organisation.
                </p>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Information importante</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Les organisations sont gérées par l'administrateur de la plateforme via Django Admin. 
                    Si vous avez besoin de créer une nouvelle organisation ou de modifier les informations 
                    existantes, veuillez contacter l'administrateur système.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Organizations;