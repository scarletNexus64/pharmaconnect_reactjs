import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Building, MapPin, Shield, 
  Calendar, Edit, Save, X, Camera 
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import apiService from '../../services/api';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/users/me/');
      setUserProfile(response);
      setFormData({
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
        phone: response.phone
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Impossible de charger le profil utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiService.request(`/users/${userProfile.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      
      setUserProfile(response);
      setEditing(false);
      setSuccess('Profil mis à jour avec succès');
      setError(null);
      
      // Mettre à jour le localStorage si nécessaire
      localStorage.setItem('user', JSON.stringify(response));
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      email: userProfile.email,
      phone: userProfile.phone
    });
    setEditing(false);
    setError(null);
  };

  const getAccessLevelLabel = (level) => {
    const labels = {
      'COORDINATION': 'Coordinateur',
      'PROJECT': 'Gestionnaire de Projet',
      'FACILITY': 'Formation Sanitaire'
    };
    return labels[level] || level;
  };

  const getAccessLevelColor = (level) => {
    const colors = {
      'COORDINATION': 'bg-green-100 text-green-800',
      'PROJECT': 'bg-blue-100 text-blue-800',
      'FACILITY': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !userProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={loadUserProfile} className="mt-4">
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Mon Profil
        </h1>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Informations Personnelles
              </h2>
              {editing && (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Annuler</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Photo de profil */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {userProfile.first_name} {userProfile.last_name}
                  </h3>
                  <p className="text-gray-500">@{userProfile.username}</p>
                  {editing && (
                    <Button variant="outline" className="mt-2 text-xs">
                      <Camera className="w-3 h-3 mr-1" />
                      Changer photo
                    </Button>
                  )}
                </div>
              </div>

              {/* Formulaire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  {editing ? (
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{userProfile.first_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  {editing ? (
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{userProfile.last_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{userProfile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  {editing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Votre numéro"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{userProfile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Informations organisationnelles */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations Professionnelles
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau d'accès
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(userProfile.access_level)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {getAccessLevelLabel(userProfile.access_level)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisation
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{userProfile.organization_name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formation Sanitaire
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{userProfile.health_facility_name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membre depuis
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {new Date(userProfile.date_joined).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;