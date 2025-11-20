import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Calendar, DollarSign, MapPin,
  ChevronRight, Activity, Building,
  Clock, CheckCircle, AlertCircle, Plus, Edit, Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProjectManagementModal from '../../components/Projects/ProjectManagementModal';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`)) {
      return;
    }

    try {
      await apiService.deleteProject(project.id);
      loadProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
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
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">Projets</span>
        </nav>

        {/* Page Title and Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Projets</h1>
            <p className="text-gray-600 mt-2">
              Consultez et gérez les projets de vos organisations.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau projet</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                        <div className="ml-4 flex flex-col space-y-2">
                          <Link
                            to={`/projects/${project.id}`}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                          >
                            Voir détails
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditProject(project);
                            }}
                            className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteProject(project);
                            }}
                            className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </button>
                        </div>
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
                <p className="text-gray-500 mb-4">
                  Aucun projet n'est associé à vos organisations.
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  <span>Créer votre premier projet</span>
                </Button>
              </div>
            </Card>
          )}

        {/* Modals */}
        {showCreateModal && (
          <ProjectManagementModal
            onClose={() => setShowCreateModal(false)}
            onSave={loadProjects}
          />
        )}

        {showEditModal && selectedProject && (
          <ProjectManagementModal
            project={selectedProject}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProject(null);
            }}
            onSave={loadProjects}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Projects;