import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Calendar, DollarSign, MapPin, 
  ChevronRight, Activity, Bell, LogOut, Building,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjects();
      setProjects(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const getProjectStatus = (project) => {
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);

    if (now < startDate) {
      return { label: 'À venir', color: 'bg-blue-100 text-blue-800', icon: Clock };
    } else if (now > endDate) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    } else {
      return { label: 'En cours', color: 'bg-green-100 text-green-800', icon: Activity };
    }
  };

  const calculateProgress = (project) => {
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    
    const total = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / total) * 100);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des projets...</p>
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
                  Gestion des Projets
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
            <span className="text-gray-700 font-medium">Projets</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mes Projets</h1>
            <p className="text-gray-600 mt-2">
              Consultez et gérez les projets de vos organisations.
              Les nouveaux projets doivent être créés via l'interface d'administration Django.
            </p>
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
                  <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">En cours</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => {
                      const now = new Date();
                      return new Date(p.start_date) <= now && new Date(p.end_date) >= now;
                    }).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">À venir</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => new Date(p.start_date) > new Date()).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Terminés</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => new Date(p.end_date) < new Date()).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Projects List */}
          {projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project) => {
                const status = getProjectStatus(project);
                const progress = calculateProgress(project);
                const StatusIcon = status.icon;

                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Building className="w-4 h-4 mr-2" />
                              <span>{project.organization_name || 'Organisation'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <DollarSign className="w-4 h-4 mr-2" />
                              <span>{project.donor_name || 'Bailleur'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{project.health_facility_name || 'Formation sanitaire'}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">{progress}%</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => window.location.href = `/projects/${project.id}`}
                          className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
                        >
                          Voir détails
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-500">
                  Aucun projet n'est associé à vos organisations.
                  Contactez l'administrateur système pour créer un nouveau projet.
                </p>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Information importante</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Les projets sont gérés par l'administrateur de la plateforme via Django Admin. 
                    Si vous avez besoin de créer un nouveau projet ou de modifier les informations 
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

export default Projects;