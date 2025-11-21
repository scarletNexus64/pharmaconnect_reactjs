import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Building, MapPin, Shield,
  Calendar, Edit, Save, X, ChevronRight, Camera, AlertTriangle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProtectedRoute from '../../components/ProtectedRoute';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
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

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
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
      'COORDINATION': 'bg-purple-100 text-purple-800',
      'PROJECT': 'bg-blue-100 text-blue-800',
      'FACILITY': 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !userProfile) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!userProfile) {
    return (
      <ProtectedRoute>
        <div className="space-y-8">
          <Card className="p-12">
            <div className="text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={loadUserProfile}>
                Réessayer
              </Button>
            </div>
          </Card>
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
          <span className="text-gray-700 font-medium">Mon Profil</span>
        </nav>

        {/* Page Title and Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et professionnelles.
            </p>
          </div>
          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </Button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Erreur</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {success && (
          <Card className="bg-green-50 border-green-200">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-900">Succès</h4>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
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
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500"
                    >
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder</span>
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center space-x-2 border-gray-300"
                    >
                      <X className="w-4 h-4" />
                      <span>Annuler</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Photo de profil */}
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
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
                  </div>
                </div>

                {/* Formulaire */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{userProfile.first_name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{userProfile.last_name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{userProfile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    {editing ? (
                      <Input
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Votre numéro"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{userProfile.phone || 'Non renseigné'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Activité
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600 mt-1">Projets</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600 mt-1">Dispensations</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600 mt-1">Alertes</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Informations organisationnelles */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations Professionnelles
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'accès
                  </label>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getAccessLevelColor(userProfile.access_level)}`}>
                    <Shield className="w-4 h-4 mr-2" />
                    {getAccessLevelLabel(userProfile.access_level)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation
                  </label>
                  <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{userProfile.organization_name || 'Non assigné'}</span>
                  </div>
                </div>

                {userProfile.health_facility_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formation Sanitaire
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{userProfile.health_facility_name}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membre depuis
                  </label>
                  <div className="flex items-center space-x-2 text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
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

            <Card className="bg-blue-50 border-blue-200">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Information</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Certaines informations comme votre organisation et votre niveau d'accès
                      sont gérées par l'administrateur système. Contactez-le pour toute modification.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
