import React, { useState, useEffect } from 'react';
import { X, MapPin, Save, Building2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import apiService from '../../services/api';

// Configuration Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour capturer les clics sur la carte
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      // Formater les coordonnées pour respecter les contraintes Django
      const formattedLat = parseFloat(e.latlng.lat.toFixed(8));
      const formattedLng = parseFloat(e.latlng.lng.toFixed(8));
      setPosition([formattedLat, formattedLng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const HealthFacilityModal = ({ isOpen, onClose, onSave, facility = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'CSI',
    level_of_care: 'PRIMARY',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    coverage_radius_km: ''
  });
  const [mapPosition, setMapPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const facilityTypes = [
    { value: 'CSI', label: 'Centre de Santé Intégré' },
    { value: 'CS', label: 'Centre de Santé' },
    { value: 'HOSPITAL', label: 'Hôpital' },
    { value: 'MOBILE_CLINIC', label: 'Clinique mobile' },
    { value: 'ASC', label: 'Agent de Santé Communautaire' }
  ];

  const levelOfCareOptions = [
    { value: 'PRIMARY', label: 'Soins de santé primaire' },
    { value: 'SECONDARY', label: 'Soins de santé secondaire' },
    { value: 'HIV', label: 'Programme VIH' },
    { value: 'MALARIA', label: 'Programme Paludisme' },
    { value: 'TB', label: 'Programme Tuberculose' },
    { value: 'NUTRITION', label: 'Programme Nutrition' },
    { value: 'LABORATORY', label: 'Programme Laboratoire' }
  ];

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || '',
        code: facility.code || '',
        type: facility.type || 'HEALTH_CENTER',
        level_of_care: facility.level_of_care || 'PRIMARY',
        location: facility.location || '',
        address: facility.address || '',
        latitude: facility.latitude || '',
        longitude: facility.longitude || '',
        coverage_radius_km: facility.coverage_radius_km || ''
      });

      if (facility.latitude && facility.longitude) {
        setMapPosition([parseFloat(facility.latitude), parseFloat(facility.longitude)]);
      }
    }
  }, [facility]);

  useEffect(() => {
    if (mapPosition) {
      setFormData(prev => ({
        ...prev,
        latitude: mapPosition[0].toFixed(8),
        longitude: mapPosition[1].toFixed(8)
      }));
    }
  }, [mapPosition]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Formater automatiquement les coordonnées lors de la saisie
    if (name === 'latitude' || name === 'longitude') {
      if (value && !isNaN(value)) {
        const numValue = parseFloat(value);
        // Limiter à 8 décimales max
        if (value.includes('.')) {
          const parts = value.split('.');
          if (parts[1] && parts[1].length > 8) {
            processedValue = numValue.toFixed(8);
          }
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }

    // Validation des coordonnées si fournies
    if (formData.latitude) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude invalide (-90 à 90)';
      } else {
        // Vérifier le format (max 2 chiffres avant virgule, 8 après)
        const latStr = lat.toString();
        const parts = latStr.split('.');
        if (parts[0].replace('-', '').length > 2 || (parts[1] && parts[1].length > 8)) {
          newErrors.latitude = 'Latitude: max 2 chiffres avant virgule, 8 après (ex: 12.34567890)';
        }
      }
    }

    if (formData.longitude) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude invalide (-180 à 180)';
      } else {
        // Vérifier le format (max 3 chiffres avant virgule, 8 après)
        const lngStr = lng.toString();
        const parts = lngStr.split('.');
        if (parts[0].replace('-', '').length > 3 || (parts[1] && parts[1].length > 8)) {
          newErrors.longitude = 'Longitude: max 3 chiffres avant virgule, 8 après (ex: -123.45678901)';
        }
      }
    }

    if (formData.coverage_radius_km && (isNaN(formData.coverage_radius_km) || formData.coverage_radius_km < 0)) {
      newErrors.coverage_radius_km = 'Le rayon de couverture doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Préparer les données avec formatage des coordonnées
      const dataToSend = {
        ...formData,
        latitude: formData.latitude ? parseFloat(parseFloat(formData.latitude).toFixed(8)) : null,
        longitude: formData.longitude ? parseFloat(parseFloat(formData.longitude).toFixed(8)) : null,
        coverage_radius_km: formData.coverage_radius_km ? parseFloat(formData.coverage_radius_km) : null
      };

      if (facility) {
        // Modification
        await apiService.updateHealthFacility(facility.id, dataToSend);
      } else {
        // Création
        await apiService.createHealthFacility(dataToSend);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Traiter les erreurs de validation du serveur
      if (error.response && error.response.data) {
        const serverErrors = {};
        Object.keys(error.response.data).forEach(key => {
          if (Array.isArray(error.response.data[key])) {
            serverErrors[key] = error.response.data[key][0];
          } else {
            serverErrors[key] = error.response.data[key];
          }
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: 'Erreur lors de la sauvegarde' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              {facility ? 'Modifier la formation sanitaire' : 'Nouvelle formation sanitaire'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex h-[calc(90vh-8rem)]">
          {/* Formulaire */}
          <div className="flex-1 p-6 overflow-y-auto">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la formation *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Centre de santé de..."
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="CS001"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de formation
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {facilityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de soins
                </label>
                <select
                  name="level_of_care"
                  value={formData.level_of_care}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levelOfCareOptions.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Commune, Région"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adresse détaillée"
                />
              </div>

              {/* Géolocalisation */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2 mt-6">Géolocalisation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cliquez sur la carte ou saisissez manuellement les coordonnées. 
                  Les coordonnées seront automatiquement formatées.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="0.00000001"
                  min="-90"
                  max="90"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.latitude ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="12.63920000"
                />
                {errors.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="0.00000001"
                  min="-180"
                  max="180"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.longitude ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="-8.00290000"
                />
                {errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rayon de couverture (km)
                </label>
                <input
                  type="number"
                  name="coverage_radius_km"
                  value={formData.coverage_radius_km}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.coverage_radius_km ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="5.0"
                />
                {errors.coverage_radius_km && (
                  <p className="mt-1 text-sm text-red-600">{errors.coverage_radius_km}</p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{showMap ? 'Masquer la carte' : 'Sélectionner sur la carte'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Carte */}
          {showMap && (
            <div className="w-1/2 border-l border-gray-200">
              <div className="h-full">
                <MapContainer
                  center={mapPosition || [12.5, -8.0]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthFacilityModal;