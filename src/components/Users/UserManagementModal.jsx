import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, Shield, Eye, EyeOff, Loader } from 'lucide-react';
import Button from '../ui/Button';
import apiService from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const UserManagementModal = ({ user, onClose, onSave }) => {
  const { user: currentUser } = useAuth();

  // Initialiser avec l'organisation de l'utilisateur connecté si disponible
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: '',
    organization: currentUser?.organization || '',
    health_facility: '',
    access_level: 'FACILITY',
    is_active: true
  });

  const [organizations, setOrganizations] = useState([]);
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!user;

  const loadData = async () => {
    try {
      const [orgsRes, facilitiesRes] = await Promise.all([
        apiService.getOrganizations(),
        apiService.getHealthFacilities()
      ]);
      setOrganizations(orgsRes.results || []);

      // Filtrer les formations sanitaires pour n'afficher que celles de l'organisation de l'utilisateur
      const allFacilities = facilitiesRes.results || [];
      const filteredFacilities = currentUser?.organization
        ? allFacilities.filter(f => f.organization === currentUser.organization)
        : allFacilities;

      setHealthFacilities(filteredFacilities);

      // Après le chargement, si c'est un nouveau user et qu'on a l'organisation, la définir
      if (!user && currentUser?.organization) {
        setFormData(prev => ({
          ...prev,
          organization: currentUser.organization
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        password: '',
        password_confirm: '',
        organization: user.organization || '',
        health_facility: user.health_facility || '',
        access_level: user.access_level || 'FACILITY',
        is_active: user.is_active !== undefined ? user.is_active : true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }

      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
      }
    } else if (formData.password && formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.organization) {
      newErrors.organization = 'L\'organisation est requise';
    }

    if (!formData.access_level) {
      newErrors.access_level = 'Le niveau d\'accès est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      // Préparer les données
      const userData = { ...formData };

      // Ne pas envoyer les mots de passe vides en mode édition
      if (isEditMode && !userData.password) {
        delete userData.password;
        delete userData.password_confirm;
      }

      if (isEditMode) {
        await apiService.updateUserProfile(user.id, userData);
      } else {
        await apiService.createUser(userData);
      }

      if (onSave) {
        onSave();
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setErrors({ submit: error.message || 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    } finally {
      setLoading(false);
    }
  };

  const accessLevels = [
    { value: 'COORDINATION', label: 'Coordination', description: 'Accès à tous les projets de l\'organisation' },
    { value: 'PROJECT', label: 'Projet', description: 'Accès aux projets spécifiques' },
    { value: 'FACILITY', label: 'Formation Sanitaire', description: 'Accès limité à une formation sanitaire' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h2>
                <p className="text-green-100 text-sm">
                  {isEditMode ? 'Modifier les informations de l\'utilisateur' : 'Créer un nouveau compte utilisateur'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Informations de base */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'utilisateur *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={isEditMode}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      } ${isEditMode ? 'bg-gray-50' : ''}`}
                      placeholder="john.doe"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditMode ? 'Modifier le mot de passe (optionnel)' : 'Mot de passe *'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe {!isEditMode && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe {!isEditMode && '*'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.password_confirm ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password_confirm && <p className="mt-1 text-sm text-red-600">{errors.password_confirm}</p>}
                </div>
              </div>
              {!isEditMode && (
                <p className="mt-2 text-sm text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères
                </p>
              )}
            </div>

            {/* Organisation et accès */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisation et accès</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organisation *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.organization ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Sélectionner une organisation</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  {!isEditMode && (
                    <p className="mt-1 text-xs text-gray-500">
                      Les utilisateurs sont automatiquement assignés à votre organisation
                    </p>
                  )}
                  {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau d'accès *
                  </label>
                  <div className="space-y-2">
                    {accessLevels.map(level => (
                      <label key={level.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="access_level"
                          value={level.value}
                          checked={formData.access_level === level.value}
                          onChange={handleChange}
                          className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-900">{level.label}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.access_level && <p className="mt-1 text-sm text-red-600">{errors.access_level}</p>}
                </div>

                {formData.access_level === 'FACILITY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formation sanitaire
                    </label>
                    <select
                      name="health_facility"
                      value={formData.health_facility}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner une formation sanitaire</option>
                      {healthFacilities.map(facility => (
                        <option key={facility.id} value={facility.id}>{facility.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="mr-2 text-green-600 focus:ring-green-500 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    Compte actif
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>{isEditMode ? 'Modifier' : 'Créer'}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;
