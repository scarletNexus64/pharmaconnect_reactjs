import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Building, DollarSign, MapPin, Calendar, Loader } from 'lucide-react';
import Button from '../ui/Button';
import apiService from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ProjectManagementModal = ({ project, onClose, onSave }) => {
  const { user: currentUser } = useAuth();

  // État du formulaire - l'organisation sera remplie après le chargement
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    organization: '',
    donor: '',
    health_facility: '',
    start_date: '',
    end_date: '',
    order_frequency_months: 3,
    delivery_delay_months: 1,
    buffer_stock_months: 0.5
  });

  const [organizations, setOrganizations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditMode = !!project;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        code: project.code || '',
        description: project.description || '',
        organization: project.organization || '',
        donor: project.donor || '',
        health_facility: project.health_facility || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        order_frequency_months: project.order_frequency_months || 3,
        delivery_delay_months: project.delivery_delay_months || 1,
        buffer_stock_months: project.buffer_stock_months || 0.5
      });
    }
  }, [project]);

  const loadData = async () => {
    try {
      const [orgsRes, donorsRes, facilitiesRes] = await Promise.all([
        apiService.getOrganizations(),
        apiService.getDonors(),
        apiService.getHealthFacilities()
      ]);

      const loadedOrgs = orgsRes.results || [];
      setOrganizations(loadedOrgs);
      setDonors(donorsRes.results || []);

      // Filtrer les formations sanitaires pour n'afficher que celles de l'organisation de l'utilisateur
      const allFacilities = facilitiesRes.results || [];
      const filteredFacilities = currentUser?.organization
        ? allFacilities.filter(f => f.organization === currentUser.organization)
        : allFacilities;

      setHealthFacilities(filteredFacilities);

      // Après le chargement, pré-remplir l'organisation pour un nouveau projet
      if (!project && loadedOrgs.length > 0) {
        // Le backend ne retourne que l'organisation de l'utilisateur
        // Donc on peut automatiquement sélectionner la première (et unique) organisation
        setFormData(prev => ({
          ...prev,
          organization: loadedOrgs[0].id
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code du projet est requis';
    }

    if (!formData.organization) {
      newErrors.organization = 'L\'organisation est requise';
    }

    if (!formData.donor) {
      newErrors.donor = 'Le bailleur de fonds est requis';
    }

    if (!formData.health_facility) {
      newErrors.health_facility = 'La formation sanitaire est requise';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'La date de début est requise';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La date de fin est requise';
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = 'La date de fin doit être postérieure à la date de début';
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

      if (isEditMode) {
        await apiService.updateProject(project.id, formData);
      } else {
        await apiService.createProject(formData);
      }

      if (onSave) {
        onSave();
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setErrors({ submit: error.message || 'Erreur lors de l\'enregistrement du projet' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? 'Modifier le projet' : 'Nouveau projet'}
                </h2>
                <p className="text-green-100 text-sm">
                  {isEditMode ? 'Modifier les informations du projet' : 'Créer un nouveau projet'}
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
                    Nom du projet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Projet Santé Publique 2024"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code du projet *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.code ? 'border-red-300' : 'border-gray-300'
                    } ${isEditMode ? 'bg-gray-50' : ''}`}
                    placeholder="PROJ-2024-001"
                  />
                  {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Description du projet..."
                  />
                </div>
              </div>
            </div>

            {/* Entités liées */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Entités liées</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organisation *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.organization ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner une organisation</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Seule votre organisation apparaît dans la liste
                  </p>
                  {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bailleur de fonds *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="donor"
                      value={formData.donor}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.donor ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner un bailleur</option>
                      {donors.map(donor => (
                        <option key={donor.id} value={donor.id}>{donor.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.donor && <p className="mt-1 text-sm text-red-600">{errors.donor}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formation sanitaire *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="health_facility"
                      value={formData.health_facility}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.health_facility ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner une formation sanitaire</option>
                      {healthFacilities.map(facility => (
                        <option key={facility.id} value={facility.id}>{facility.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.health_facility && <p className="mt-1 text-sm text-red-600">{errors.health_facility}</p>}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Période du projet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.start_date ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.end_date ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                </div>
              </div>
            </div>

            {/* Paramètres de stock */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fréquence des commandes (mois)
                  </label>
                  <input
                    type="number"
                    name="order_frequency_months"
                    value={formData.order_frequency_months}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Périodicité des commandes de médicaments</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de livraison (mois)
                  </label>
                  <input
                    type="number"
                    name="delivery_delay_months"
                    value={formData.delivery_delay_months}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Délai moyen de livraison</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock tampon (mois)
                  </label>
                  <input
                    type="number"
                    name="buffer_stock_months"
                    value={formData.buffer_stock_months}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Stock de sécurité en mois</p>
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

export default ProjectManagementModal;
