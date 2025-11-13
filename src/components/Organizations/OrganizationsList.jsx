import React, { useState, useEffect } from 'react';
import { 
  Building, Plus, Search, Edit, Trash2, Users, 
  MapPin, Calendar, Filter, MoreVertical, Eye
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import apiService from '../../services/api';

const OrganizationsList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganizations();
      setOrganizations(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des organisations:', error);
      setError('Impossible de charger les organisations');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'NGO': 'ONG',
      'GOVERNMENT': 'Programme étatique',
      'INTERNATIONAL': 'Organisation internationale'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      'NGO': 'bg-green-100 text-green-800',
      'GOVERNMENT': 'bg-blue-100 text-blue-800',
      'INTERNATIONAL': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = async (org) => {
    setSelectedOrg(org);
    setShowDetails(true);
    
    // Charger les détails supplémentaires (utilisateurs, projets)
    try {
      const [usersResponse, projectsResponse] = await Promise.all([
        apiService.request(`/organizations/${org.id}/users/`),
        apiService.request(`/organizations/${org.id}/projects/`)
      ]);
      
      setSelectedOrg({
        ...org,
        users: usersResponse,
        projects: projectsResponse
      });
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.country.toLowerCase().includes(searchTerm.toLowerCase())
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
            Organisations
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion des organisations partenaires
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Organisation</span>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher organisations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Liste des organisations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  <p className="text-sm text-gray-500">{org.code}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(org.type)}`}>
                  {getTypeLabel(org.type)}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{org.country}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Créée le {new Date(org.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <Button
                onClick={() => handleViewDetails(org)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir détails
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Détails de l'organisation
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <p className="text-sm text-gray-900">{selectedOrg.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <p className="text-sm text-gray-900">{selectedOrg.code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedOrg.type)}`}>
                      {getTypeLabel(selectedOrg.type)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pays</label>
                    <p className="text-sm text-gray-900">{selectedOrg.country}</p>
                  </div>
                </div>
              </div>

              {/* Utilisateurs */}
              {selectedOrg.users && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Utilisateurs ({selectedOrg.users.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrg.users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{user.access_level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projets */}
              {selectedOrg.projects && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Projets ({selectedOrg.projects.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrg.projects.map((project) => (
                      <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
      {!loading && filteredOrganizations.length === 0 && (
        <Card className="p-12 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune organisation trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Aucune organisation ne correspond à votre recherche.' : 'Commencez par ajouter une organisation.'}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une organisation
          </Button>
        </Card>
      )}
    </div>
  );
};

export default OrganizationsList;