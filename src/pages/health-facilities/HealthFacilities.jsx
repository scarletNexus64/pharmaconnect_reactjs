import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Plus, Search, Filter, Eye, Building2, Users,
  ChevronRight, Activity, Bell, LogOut, Navigation,
  Grid, List, MoreVertical, Edit, Trash2, UserPlus,
  Clock, Info, TrendingUp, Map as MapIcon, Pill, Package,
  Maximize, Minimize
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMap } from 'react-leaflet';
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

// Composant pour gérer les actions de carte et exposer l'instance de map
const MapController = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

const HealthFacilities = () => {
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [facilitiesWithCoords, setFacilitiesWithCoords] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mapView, setMapView] = useState(false);
  const [mapLayer, setMapLayer] = useState('street'); // 'street', 'satellite', 'terrain'
  const [fullscreenMap, setFullscreenMap] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDistributorModal, setShowDistributorModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logout } = useAuth();

  // Référence pour l'instance de la carte Leaflet
  const mapRef = useRef(null);

  // Fonction pour fermer tous les popups de la carte
  const closeAllPopups = () => {
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
  };

  // Désactiver les interactions avec la carte quand un modal est ouvert
  useEffect(() => {
    const isModalOpen = showCreateModal || showEditModal || showDetailsModal || showDistributorModal;

    if (mapRef.current) {
      if (isModalOpen) {
        // Désactiver toutes les interactions avec la carte
        mapRef.current.dragging.disable();
        mapRef.current.touchZoom.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.scrollWheelZoom.disable();
        mapRef.current.boxZoom.disable();
        mapRef.current.keyboard.disable();
      } else {
        // Réactiver les interactions
        mapRef.current.dragging.enable();
        mapRef.current.touchZoom.enable();
        mapRef.current.doubleClickZoom.enable();
        mapRef.current.scrollWheelZoom.enable();
        mapRef.current.boxZoom.enable();
        mapRef.current.keyboard.enable();
      }
    }
  }, [showCreateModal, showEditModal, showDetailsModal, showDistributorModal]);

  // Position par défaut (centre de l'Afrique de l'Ouest)
  const defaultCenter = [12.5, -8.0];
  const defaultZoom = 6;

  // Calculer le centre et le zoom basés sur les formations disponibles
  const getMapCenter = () => {
    if (facilitiesWithCoords.length === 0) {
      return defaultCenter;
    }

    if (facilitiesWithCoords.length === 1) {
      const facility = facilitiesWithCoords[0];
      return [parseFloat(facility.latitude), parseFloat(facility.longitude)];
    }

    // Calculer le centre moyen de toutes les formations
    const avgLat = facilitiesWithCoords.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / facilitiesWithCoords.length;
    const avgLng = facilitiesWithCoords.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / facilitiesWithCoords.length;
    return [avgLat, avgLng];
  };

  const getMapZoom = () => {
    if (facilitiesWithCoords.length <= 1) {
      return 13; // Zoom plus proche pour 1 seule formation
    }
    return 8; // Zoom moyen pour plusieurs formations
  };

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

      setHealthFacilities(facilitiesRes.results || facilitiesRes || []);
      // L'endpoint with_coordinates retourne directement un tableau, pas une structure paginée
      setFacilitiesWithCoords(Array.isArray(facilitiesWithCoordsRes) ? facilitiesWithCoordsRes : (facilitiesWithCoordsRes.results || []));
      setDistributors(distributorsRes.results || distributorsRes || []);

      console.log('Formations avec coordonnées chargées:', Array.isArray(facilitiesWithCoordsRes) ? facilitiesWithCoordsRes : (facilitiesWithCoordsRes.results || []).length);
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
    closeAllPopups(); // Fermer les popups avant d'ouvrir le modal
    setSelectedFacility(facility);
    setShowDetailsModal(true);
  };

  const handleEditFacility = (facility) => {
    closeAllPopups(); // Fermer les popups avant d'ouvrir le modal
    setSelectedFacility(facility);
    setShowEditModal(true);
  };

  const handleDeleteFacility = async (facilityId) => {
    closeAllPopups(); // Fermer les popups avant l'action
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
    closeAllPopups(); // Fermer les popups avant d'ouvrir le modal
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

  // Palette de couleurs pour les zones de couverture
  const coverageColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
  ];

  // Obtenir une couleur unique pour chaque formation
  const getFacilityColor = (index) => {
    return coverageColors[index % coverageColors.length];
  };

  // Configuration des couches de carte
  const mapLayers = {
    street: {
      name: 'Carte',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    terrain: {
      name: 'Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  };

  // Rendu de la carte
  const renderMap = () => {
    const isModalOpen = showCreateModal || showEditModal || showDetailsModal || showDistributorModal;

    return (
      <div className={`${fullscreenMap ? 'h-screen' : 'h-[600px]'} bg-gray-100 rounded-lg overflow-hidden relative ${isModalOpen ? 'pointer-events-none opacity-60' : ''}`}>
        {/* Bouton plein écran */}
        <button
          onClick={() => setFullscreenMap(!fullscreenMap)}
          className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-100 p-2 rounded-lg shadow-lg border border-gray-300 transition-colors pointer-events-auto"
          title={fullscreenMap ? "Quitter le plein écran" : "Plein écran"}
        >
          {fullscreenMap ? (
            <Minimize className="h-5 w-5 text-gray-700" />
          ) : (
            <Maximize className="h-5 w-5 text-gray-700" />
          )}
        </button>

        <MapContainer
          center={getMapCenter()}
          zoom={getMapZoom()}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
          key={`map-${facilitiesWithCoords.length}`} // Force re-render when facilities change
        >
        {/* Contrôleur pour gérer l'instance de la carte */}
        <MapController onMapReady={(map) => { mapRef.current = map; }} />

        <TileLayer
          key={mapLayer}
          attribution={mapLayers[mapLayer].attribution}
          url={mapLayers[mapLayer].url}
          maxZoom={19}
        />

        {/* Rendu des zones de couverture (cercles et polygones) */}
        {facilitiesWithCoords.map((facility, index) => {
          const color = getFacilityColor(index);

          return (
            <React.Fragment key={`coverage-${facility.id}`}>
              {/* Cercle de couverture basé sur le rayon */}
              {facility.coverage_radius_km && (
                <Circle
                  center={[parseFloat(facility.latitude), parseFloat(facility.longitude)]}
                  radius={parseFloat(facility.coverage_radius_km) * 1000} // Convertir km en mètres
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.15,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm">Zone: {facility.name}</h3>
                      <p className="text-xs text-gray-600">Rayon: {facility.coverage_radius_km} km</p>
                    </div>
                  </Popup>
                </Circle>
              )}

              {/* Polygone de couverture personnalisé */}
              {facility.coverage_polygon && (
                <Polygon
                  positions={facility.coverage_polygon.coordinates[0].map(coord => [coord[1], coord[0]])}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.2,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm">Zone: {facility.name}</h3>
                      <p className="text-xs text-gray-600">Zone de couverture personnalisée</p>
                    </div>
                  </Popup>
                </Polygon>
              )}
            </React.Fragment>
          );
        })}

        {/* Marqueurs des formations */}
        {facilitiesWithCoords.map((facility, index) => {
          const color = getFacilityColor(index);

          return (
            <Marker
              key={`marker-${facility.id}`}
              position={[parseFloat(facility.latitude), parseFloat(facility.longitude)]}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    ></div>
                    <h3 className="font-semibold text-sm">{facility.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600">{facilityTypes.find(t => t.value === facility.type)?.label || facility.type}</p>
                  <p className="text-xs text-gray-600">{facility.location}</p>
                  {facility.coverage_radius_km && (
                    <p className="text-xs mt-1" style={{ color: color }}>
                      Zone de couverture: {facility.coverage_radius_km} km
                    </p>
                  )}
                  {facility.coverage_polygon && (
                    <p className="text-xs mt-1" style={{ color: color }}>
                      Zone personnalisée définie
                    </p>
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
                      onClick={() => handleEditFacility(facility)}
                    >
                      <Edit className="h-3 w-3" />
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
          );
        })}
      </MapContainer>
    </div>
    );
  };

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
            fullscreenMap ? (
              // Mode plein écran
              <div className="fixed inset-0 z-50 bg-white">
                {/* Contrôles en haut en mode plein écran */}
                <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-300 p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-700">Type de carte:</span>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => setMapLayer('street')}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          mapLayer === 'street'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        🗺️ Carte
                      </button>
                      <button
                        onClick={() => setMapLayer('satellite')}
                        className={`px-3 py-1.5 text-xs font-medium border-l border-gray-300 transition-colors ${
                          mapLayer === 'satellite'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        🛰️ Satellite
                      </button>
                      <button
                        onClick={() => setMapLayer('terrain')}
                        className={`px-3 py-1.5 text-xs font-medium border-l border-gray-300 transition-colors ${
                          mapLayer === 'terrain'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        🏔️ Terrain
                      </button>
                    </div>
                  </div>
                </div>

                {/* Légende en plein écran */}
                {facilitiesWithCoords.length > 0 && (
                  <div className="absolute top-4 right-20 z-[1000] bg-white border border-gray-200 rounded-lg p-3 max-w-xs shadow-lg">
                    <h3 className="text-xs font-semibold text-gray-700 mb-2">Légende</h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {facilitiesWithCoords.slice(0, 12).map((facility, index) => (
                        <div key={facility.id} className="flex items-center text-xs">
                          <div
                            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                            style={{ backgroundColor: getFacilityColor(index) }}
                          ></div>
                          <span className="text-gray-700 truncate">{facility.name}</span>
                        </div>
                      ))}
                      {facilitiesWithCoords.length > 12 && (
                        <p className="text-xs text-gray-500 italic">
                          +{facilitiesWithCoords.length - 12} autre(s)
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {renderMap()}
              </div>
            ) : (
              // Mode normal
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Carte des Formations Sanitaires</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Visualisez les formations sanitaires et leurs zones de couverture
                        </p>
                      </div>
                      {facilitiesWithCoords.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-md ml-4">
                          <h3 className="text-xs font-semibold text-gray-700 mb-2">Légende</h3>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {facilitiesWithCoords.slice(0, 8).map((facility, index) => (
                              <div key={facility.id} className="flex items-center text-xs">
                                <div
                                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                  style={{ backgroundColor: getFacilityColor(index) }}
                                ></div>
                                <span className="text-gray-700 truncate">{facility.name}</span>
                              </div>
                            ))}
                            {facilitiesWithCoords.length > 8 && (
                              <p className="text-xs text-gray-500 italic">
                                +{facilitiesWithCoords.length - 8} autre(s) formation(s)
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contrôles de la carte */}
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Type de carte:</span>
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                        <button
                          onClick={() => setMapLayer('street')}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            mapLayer === 'street'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          🗺️ Carte
                        </button>
                        <button
                          onClick={() => setMapLayer('satellite')}
                          className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                            mapLayer === 'satellite'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          🛰️ Satellite
                        </button>
                        <button
                          onClick={() => setMapLayer('terrain')}
                          className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                            mapLayer === 'terrain'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          🏔️ Terrain
                        </button>
                      </div>
                      <div className="ml-4 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                          💡 Utilisez la molette pour zoomer, cliquez et glissez pour déplacer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {renderMap()}
                {facilitiesWithCoords.length === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Aucune formation sanitaire avec coordonnées GPS.
                      Ajoutez des coordonnées GPS aux formations pour les voir sur la carte.
                    </p>
                  </div>
                )}
              </Card>
            )
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
                      
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {facility.latitude && facility.longitude && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <MapPin className="h-3 w-3 mr-1" />
                            Géolocalisé
                          </span>
                        )}

                        {facility.coverage_radius_km && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <Navigation className="h-3 w-3 mr-1" />
                            Zone: {facility.coverage_radius_km} km
                          </span>
                        )}

                        {facility.coverage_polygon && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            <MapIcon className="h-3 w-3 mr-1" />
                            Zone personnalisée
                          </span>
                        )}

                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
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

                  <div className="mt-4 flex flex-wrap gap-2">
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
                      onClick={() => handleEditFacility(facility)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
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

        {showEditModal && selectedFacility && (
          <HealthFacilityModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedFacility(null);
            }}
            onSave={loadData}
            facility={selectedFacility}
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