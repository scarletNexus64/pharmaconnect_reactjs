import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building, Users, MapPin, Calendar, ChevronRight, ChevronLeft,
  Activity, Bell, LogOut, FolderOpen, User, Settings,
  Mail, Phone, Globe, FileText, TrendingUp, Package
} from 'lucide-react';
import Card from '../../components/ui/Card';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';

const OrganizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadOrganizationData();
  }, [id]);

  const loadOrganizationData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [orgRes, projectsRes, usersRes] = await Promise.all([
        apiService.request(`/organizations/${id}/`),
        apiService.request(`/organizations/${id}/projects/`).catch(() => []),
        apiService.request(`/organizations/${id}/users/`).catch(() => [])
      ]);

      setOrganization(orgRes);
      setProjects(projectsRes);
      setUsers(usersRes);

      // Calculer les statistiques
      const activeProjects = projectsRes.filter(p => {
        const now = new Date();
        return new Date(p.start_date) <= now && new Date(p.end_date) >= now;
      });

      setStats({
        totalProjects: projectsRes.length,
        activeProjects: activeProjects.length,
        totalUsers: usersRes.length,
        completedProjects: projectsRes.filter(p => new Date(p.end_date) < new Date()).length
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      if (error.message.includes('404')) {
        navigate('/organizations');
      }
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
            <p className="text-gray-600">Chargement des détails de l'organisation...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!organization) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Organisation non trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              L'organisation demandée n'existe pas ou vous n'y avez pas accès.
            </p>
            <button
              onClick={() => navigate('/organizations')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Retour aux organisations
            </button>
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
                  Détails de l'Organisation
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
            <a href="/organizations" className="hover:text-gray-700">Organisations</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 font-medium">{organization.name}</span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => navigate('/organizations')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour aux organisations</span>
          </button>

          {/* Organization Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white mb-8">
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
                    <p className="text-blue-100 mb-1">Code: {organization.code}</p>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        organization.type === 'NGO' ? 'bg-green-500 bg-opacity-20' :
                        organization.type === 'GOVERNMENT' ? 'bg-blue-500 bg-opacity-20' :
                        'bg-gray-500 bg-opacity-20'
                      }`}>
                        {organization.type === 'NGO' ? 'ONG' : 
                         organization.type === 'GOVERNMENT' ? 'Gouvernement' : organization.type}
                      </span>
                      <span className="flex items-center text-blue-100">
                        <MapPin className="w-4 h-4 mr-1" />
                        {organization.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderOpen className="w-8 h-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Projets</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Projets Actifs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Projets Terminés</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedProjects}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
                { id: 'projects', label: 'Projets', icon: FolderOpen },
                { id: 'users', label: 'Utilisateurs', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Organization Info */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'Organisation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-gray-900">{organization.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Code</label>
                    <p className="text-gray-900">{organization.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900">
                      {organization.type === 'NGO' ? 'ONG' : 
                       organization.type === 'GOVERNMENT' ? 'Programme gouvernemental' : organization.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pays</label>
                    <p className="text-gray-900">{organization.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date de création</label>
                    <p className="text-gray-900">{new Date(organization.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </Card>

              {/* Recent Projects */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Projets Récents</h3>
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucun projet disponible</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {projects.length > 0 ? projects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/projects/${project.id}`)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Code: {project.code}</span>
                        <span>•</span>
                        <span>{new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              )) : (
                <Card className="p-12">
                  <div className="text-center">
                    <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet</h3>
                    <p className="text-gray-500">Cette organisation n'a pas encore de projets.</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {users.length > 0 ? (
                <Card className="p-6">
                  <div className="space-y-4">
                    {users.map((orgUser) => (
                      <div key={orgUser.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {orgUser.first_name?.[0]}{orgUser.last_name?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {orgUser.first_name} {orgUser.last_name}
                          </h4>
                          <p className="text-sm text-gray-500">{orgUser.email}</p>
                          <p className="text-xs text-gray-400">
                            {orgUser.access_level === 'COORDINATION' ? 'Coordinateur' : 
                             orgUser.access_level === 'PROJECT' ? 'Projet' : 'Formation Sanitaire'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            orgUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {orgUser.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-12">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur</h3>
                    <p className="text-gray-500">Cette organisation n'a pas encore d'utilisateurs assignés.</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default OrganizationDetail;