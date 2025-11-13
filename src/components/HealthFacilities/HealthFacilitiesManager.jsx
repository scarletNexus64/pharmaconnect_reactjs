import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Search, Filter, Edit, Trash2, Eye, 
  Building, Users, Calendar, Activity, MoreVertical,
  Home, Truck, Heart
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const HealthFacilitiesManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [error, setError] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const facilityTypes = [
    { value: 'CSI', label: 'Centre de Santé Intégré' },
    { value: 'CS', label: 'Centre de Santé' },
    { value: 'HOSPITAL', label: 'Hôpital' },
    { value: 'MOBILE_CLINIC', label: 'Clinique mobile' },
    { value: 'ASC', label: 'Agent de Santé Communautaire' }
  ];

  const levelsOfCare = [
    { value: 'PRIMARY', label: 'Soins de santé primaire' },
    { value: 'SECONDARY', label: 'Soins de santé secondaire' },
    { value: 'HIV', label: 'Programme VIH' },
    { value: 'MALARIA', label: 'Programme Paludisme' },
    { value: 'TB', label: 'Programme Tuberculose' },
    { value: 'NUTRITION', label: 'Programme Nutrition' },
    { value: 'LABORATORY', label: 'Programme Laboratoire' }
  ];

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/health-facilities/');
      setFacilities(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des formations sanitaires:', error);
      setError('Impossible de charger les formations sanitaires');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
    setShowDetails(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'HOSPITAL':
        return Heart;
      case 'MOBILE_CLINIC':
        return Truck;
      case 'ASC':
        return Users;
      default:
        return Building;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'CSI': 'bg-blue-100 text-blue-800',
      'CS': 'bg-green-100 text-green-800',
      'HOSPITAL': 'bg-red-100 text-red-800',
      'MOBILE_CLINIC': 'bg-yellow-100 text-yellow-800',
      'ASC': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      'PRIMARY': 'bg-green-100 text-green-800',
      'SECONDARY': 'bg-blue-100 text-blue-800',
      'HIV': 'bg-red-100 text-red-800',
      'MALARIA': 'bg-yellow-100 text-yellow-800',
      'TB': 'bg-orange-100 text-orange-800',
      'NUTRITION': 'bg-purple-100 text-purple-800',
      'LABORATORY': 'bg-indigo-100 text-indigo-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const typeObj = facilityTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getLevelLabel = (level) => {
    const levelObj = levelsOfCare.find(l => l.value === level);
    return levelObj ? levelObj.label : level;
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === '' || facility.type === selectedType;
    const matchesLevel = selectedLevel === '' || facility.level_of_care === selectedLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map(i => (
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
            Formations Sanitaires
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion des sites et centres de santé
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Formation</span>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher formations sanitaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tous types</option>
              {facilityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tous niveaux</option>
              {levelsOfCare.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          {filteredFacilities.length} formation{filteredFacilities.length > 1 ? 's' : ''} trouvée{filteredFacilities.length > 1 ? 's' : ''}
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Liste des formations sanitaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => {
          const TypeIcon = getTypeIcon(facility.type);
          
          return (
            <Card key={facility.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-500 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 leading-tight">{facility.name}</h3>
                    <p className="text-sm text-gray-500">{facility.code}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(facility.type)}`}>
                    {getTypeLabel(facility.type)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(facility.level_of_care)}`}>
                      {getLevelLabel(facility.level_of_care)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{facility.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Créée le {new Date(facility.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleViewDetails(facility)}
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
      {showDetails && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Détails de la formation sanitaire
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
              {/* En-tête de la formation */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-500 rounded-xl flex items-center justify-center">
                  {React.createElement(getTypeIcon(selectedFacility.type), { 
                    className: "w-8 h-8 text-white" 
                  })}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedFacility.name}</h3>
                  <p className="text-gray-600">{selectedFacility.code}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedFacility.type)}`}>
                      {getTypeLabel(selectedFacility.type)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(selectedFacility.level_of_care)}`}>
                      {getLevelLabel(selectedFacility.level_of_care)}
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
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <p className="text-sm text-gray-900">{selectedFacility.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Code</label>
                      <p className="text-sm text-gray-900">{selectedFacility.code}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{getTypeLabel(selectedFacility.type)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Niveau de soins</label>
                      <p className="text-sm text-gray-900">{getLevelLabel(selectedFacility.level_of_care)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Localisation</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <p className="text-sm text-gray-900">{selectedFacility.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de création</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedFacility.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Activité</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">-</div>
                    <div className="text-sm text-blue-600">Projets actifs</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">-</div>
                    <div className="text-sm text-green-600">Médicaments</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">-</div>
                    <div className="text-sm text-purple-600">Dispensations</div>
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
      {!loading && filteredFacilities.length === 0 && (
        <Card className="p-12 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune formation sanitaire trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedType || selectedLevel ? 
              'Aucune formation ne correspond à vos critères.' : 
              'Commencez par ajouter des formations sanitaires.'}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une formation
          </Button>
        </Card>
      )}
    </div>
  );
};

export default HealthFacilitiesManager;