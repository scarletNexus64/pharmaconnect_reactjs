import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, Plus, Search, Edit, Calendar, MapPin, 
  Building, Users, DollarSign, Clock, MoreVertical, Eye
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjects();
      setProjects(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      setError('Impossible de charger les projets');
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return { status: 'À venir', color: 'bg-blue-100 text-blue-800' };
    } else if (now > end) {
      return { status: 'Terminé', color: 'bg-gray-100 text-gray-800' };
    } else {
      return { status: 'En cours', color: 'bg-green-100 text-green-800' };
    }
  };

  const calculateProjectProgress = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.donor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Projets
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion des projets et programmes
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet</span>
        </Button>
      </div>

      {/* Recherche */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher projets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {projects.length} projet{projects.length > 1 ? 's' : ''} au total
          </div>
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Liste des projets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const projectStatus = getProjectStatus(project.start_date, project.end_date);
          const progress = calculateProjectProgress(project.start_date, project.end_date);
          const daysRemaining = getDaysRemaining(project.end_date);
          
          return (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 leading-tight">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.code}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${projectStatus.color}`}>
                    {projectStatus.status}
                  </span>
                  {daysRemaining > 0 && (
                    <span className="text-xs text-gray-500">
                      {daysRemaining} jours restants
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span className="truncate">{project.donor_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{project.health_facility_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(project.start_date).toLocaleDateString('fr-FR')} - 
                      {new Date(project.end_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Configuration logistique */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Clock className="w-3 h-3 mx-auto mb-1 text-gray-400" />
                  <div className="font-medium">{project.order_frequency_months}m</div>
                  <div className="text-gray-500">Commandes</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <DollarSign className="w-3 h-3 mx-auto mb-1 text-gray-400" />
                  <div className="font-medium">{project.delivery_delay_months}m</div>
                  <div className="text-gray-500">Livraison</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Users className="w-3 h-3 mx-auto mb-1 text-gray-400" />
                  <div className="font-medium">{project.buffer_stock_months}m</div>
                  <div className="text-gray-500">Stock tampon</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleViewDetails(project)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Détails
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Détails du projet
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* En-tête du projet */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedProject.name}</h3>
                  <p className="text-gray-600">{selectedProject.code}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectStatus(selectedProject.start_date, selectedProject.end_date).color}`}>
                      {getProjectStatus(selectedProject.start_date, selectedProject.end_date).status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {calculateProjectProgress(selectedProject.start_date, selectedProject.end_date)}% complété
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Informations Générales</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Organisation</label>
                      <p className="text-sm text-gray-900">{selectedProject.organization_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bailleur</label>
                      <p className="text-sm text-gray-900">{selectedProject.donor_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Formation sanitaire</label>
                      <p className="text-sm text-gray-900">{selectedProject.health_facility_name}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Période d'exécution</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de début</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedProject.start_date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedProject.end_date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Durée</label>
                      <p className="text-sm text-gray-900">
                        {Math.ceil((new Date(selectedProject.end_date) - new Date(selectedProject.start_date)) / (1000 * 60 * 60 * 24 * 30))} mois
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration logistique */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Configuration Logistique</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Fréquence des commandes</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedProject.order_frequency_months} mois</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Délai de livraison</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{selectedProject.delivery_delay_months} mois</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Stock tampon</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{selectedProject.buffer_stock_months} mois</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              <Button>
                Modifier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {!loading && filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Commencez par créer votre premier projet.'}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Créer un projet
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProjectsList;