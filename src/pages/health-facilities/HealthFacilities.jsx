import React, { useState, useEffect } from 'react';
import {
  MapPin, Plus, Search, Filter, Eye, Building2, Users,
  ChevronRight, Activity, Bell, LogOut, Navigation,
  Grid, List, MoreVertical, Edit, Trash2, UserPlus,
  Clock, Info, TrendingUp, Map as MapIcon, Pill, Package
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';
import HealthFacilityModal from '../../components/HealthFacilities/HealthFacilityModal';
import HealthFacilityDetailsModal from '../../components/HealthFacilities/HealthFacilityDetailsModal';
import DistributorManagementModal from '../../components/HealthFacilities/DistributorManagementModal';

// Correction du problème des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HealthFacilities = () => {
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [facilitiesWithCoords, setFacilitiesWithCoords] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mapView, setMapView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDistributorModal, setShowDistributorModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logout } = useAuth();

  // Position par défaut (centre de l'Afrique de l'Ouest)
  const defaultCenter = [12.5, -8.0];
  const defaultZoom = 6;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facilitiesRes, facilitiesWithCoordsRes, distributorsRes] = await Promise.all([
        apiService.getHealthFacilities(),
        apiService.getHealthFacilitiesWithCoordinates(),
        apiService.getAllHealthFacilityDistributors()
      ]);
      
      setHealthFacilities(facilitiesRes.results || []);
      setFacilitiesWithCoords(facilitiesWithCoordsRes.results || []);
      setDistributors(distributorsRes.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setHealthFacilities([]);
      setFacilitiesWithCoords([]);
      setDistributors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
    setShowDetailsModal(true);
  };

  const handleDeleteFacility = async (facilityId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation sanitaire ?')) {
      try {
        await apiService.deleteHealthFacility(facilityId);
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la formation sanitaire');
      }
    }
  };

  const handleAssignDistributor = (facility) => {
    setSelectedFacility(facility);
    setShowDistributorModal(true);
  };

  const filteredFacilities = healthFacilities.filter(facility => {
    const matchesSearch = !searchTerm || 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || facility.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const stats = {
    total: healthFacilities.length,
    withCoordinates: facilitiesWithCoords.length,
    totalDistributors: distributors.length,
    activeDistributors: distributors.filter(d => d.is_active).length
  };

  const facilityTypes = [
    { value: 'CSI', label: 'Centre de Santé Intégré' },
    { value: 'CS', label: 'Centre de Santé' },
    { value: 'HOSPITAL', label: 'Hôpital' },
    { value: 'MOBILE_CLINIC', label: 'Clinique mobile' },
    { value: 'ASC', label: 'Agent de Santé Communautaire' }
  ];

  // Rendu de la carte
  const renderMap = () => (
    <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilitiesWithCoords.map((facility) => (
          <Marker 
            key={facility.id} 
            position={[parseFloat(facility.latitude), parseFloat(facility.longitude)]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{facility.name}</h3>
                <p className="text-xs text-gray-600">{facility.type}</p>
                <p className="text-xs text-gray-600">{facility.location}</p>
                {facility.coverage_polygon && (
                  <p className="text-xs text-blue-600">Zone de couverture définie</p>
                )}
                <div className="mt-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(facility)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAssignDistributor(facility)}
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Rendu des polygones de couverture */}
        {facilitiesWithCoords
          .filter(facility => facility.coverage_polygon)
          .map((facility) => (
            <Polygon 
              key={`polygon-${facility.id}`}
              positions={facility.coverage_polygon.coordinates[0].map(coord => [coord[1], coord[0]])}
              pathOptions={{ 
                color: '#3b82f6', 
                fillColor: '#3b82f6', 
                fillOpacity: 0.2 
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">Zone: {facility.name}</h3>
                  <p className="text-xs text-gray-600">Zone de couverture</p>
                </div>
              </Popup>
            </Polygon>
          ))
        }
      </MapContainer>
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des formations sanitaires...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Formations</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avec Coordonnées</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.withCoordinates}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Distributeurs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalDistributors}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Actifs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeDistributors}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les types</option>
                {facilityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setMapView(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                    !mapView 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setMapView(true)}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                    mapView 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Formation</span>
              </Button>
            </div>
          </div>

          {/* Vue carte ou liste */}
          {mapView ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Carte des Formations Sanitaires</h2>
              {renderMap()}
            </Card>
          ) : (
            /* Vue liste */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Card key={facility.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {facility.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Code: {facility.code}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Type: {facilityTypes.find(t => t.value === facility.type)?.label || facility.type}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Localisation: {facility.location}
                      </p>
                      {facility.address && (
                        <p className="text-sm text-gray-600 mb-2">
                          Adresse: {facility.address}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3">
                        {facility.latitude && facility.longitude && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <MapPin className="h-3 w-3 mr-1" />
                            Géolocalisé
                          </span>
                        )}
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <Users className="h-3 w-3 mr-1" />
                          {facility.distributors_count || 0} distributeurs
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(facility)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssignDistributor(facility)}
                      className="flex-1"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Distributeurs
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteFacility(facility.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredFacilities.length === 0 && (
            <Card className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune formation sanitaire trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre première formation sanitaire.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une formation sanitaire
              </Button>
            </Card>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && (
          <HealthFacilityModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={loadData}
          />
        )}

        {showDetailsModal && selectedFacility && (
          <HealthFacilityDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            facility={selectedFacility}
          />
        )}

        {showDistributorModal && selectedFacility && (
          <DistributorManagementModal
            facility={selectedFacility}
            onClose={() => {
              setShowDistributorModal(false);
              setSelectedFacility(null);
            }}
            onUpdate={loadData}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default HealthFacilities;