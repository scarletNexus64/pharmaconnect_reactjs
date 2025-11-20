import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import apiService from '../../services/api';

const StockEntryModal = ({ isOpen, onClose, onSave, stockEntry = null }) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    project: '',
    medication: '',
    delivery_date: '',
    quantity_ordered: '',
    quantity_delivered: '',
    expiry_date: '',
    unit_price: '',
    supplier: '',
    batch_number: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (stockEntry) {
        setFormData({
          project: stockEntry.project || '',
          medication: stockEntry.medication || '',
          delivery_date: stockEntry.delivery_date || '',
          quantity_ordered: stockEntry.quantity_ordered || '',
          quantity_delivered: stockEntry.quantity_delivered || '',
          expiry_date: stockEntry.expiry_date || '',
          unit_price: stockEntry.unit_price || '',
          supplier: stockEntry.supplier || '',
          batch_number: stockEntry.batch_number || ''
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, stockEntry]);

  const loadInitialData = async () => {
    try {
      const [projectsRes, medicationsRes] = await Promise.all([
        apiService.getProjects(),
        apiService.getMedications()
      ]);

      const loadedProjects = projectsRes.results || [];
      const loadedMedications = medicationsRes.results || [];

      console.log('Projets chargés:', loadedProjects);
      console.log('Médicaments chargés:', loadedMedications);

      setProjects(loadedProjects);
      setMedications(loadedMedications);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      project: '',
      medication: '',
      delivery_date: '',
      quantity_ordered: '',
      quantity_delivered: '',
      expiry_date: '',
      unit_price: '',
      supplier: '',
      batch_number: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project) newErrors.project = 'Le projet est requis';
    if (!formData.medication) newErrors.medication = 'Le médicament est requis';
    if (!formData.delivery_date) newErrors.delivery_date = 'La date de livraison est requise';
    if (!formData.quantity_delivered) newErrors.quantity_delivered = 'La quantité livrée est requise';
    if (!formData.expiry_date) newErrors.expiry_date = 'La date d\'expiration est requise';
    if (!formData.unit_price) newErrors.unit_price = 'Le prix unitaire est requis';

    // Validation des dates
    if (formData.delivery_date && formData.expiry_date) {
      const deliveryDate = new Date(formData.delivery_date);
      const expiryDate = new Date(formData.expiry_date);
      if (expiryDate <= deliveryDate) {
        newErrors.expiry_date = 'La date d\'expiration doit être après la date de livraison';
      }
    }

    // Validation des quantités
    if (formData.quantity_ordered && formData.quantity_delivered) {
      const ordered = parseInt(formData.quantity_ordered);
      const delivered = parseInt(formData.quantity_delivered);
      if (delivered > ordered) {
        newErrors.quantity_delivered = 'La quantité livrée ne peut pas dépasser la quantité commandée';
      }
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
      // Le backend assignera automatiquement l'organisation de l'utilisateur
      const stockData = {
        project: parseInt(formData.project),
        medication: parseInt(formData.medication),
        delivery_date: formData.delivery_date,
        quantity_ordered: parseInt(formData.quantity_ordered) || 0,
        quantity_delivered: parseInt(formData.quantity_delivered),
        expiry_date: formData.expiry_date,
        unit_price: parseFloat(formData.unit_price),
        supplier: formData.supplier,
        batch_number: formData.batch_number
      };

      console.log('Données à envoyer au backend:', stockData);

      if (stockEntry) {
        await apiService.updateStockEntry(stockEntry.id, stockData);
      } else {
        await apiService.createStockEntry(stockData);
      }

      onSave();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({
        submit: error.message || 'Une erreur est survenue lors de la sauvegarde'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {stockEntry ? 'Modifier l\'entrée de stock' : 'Nouvelle entrée de stock'}
              </h2>
              <p className="text-sm text-gray-500">
                {stockEntry ? 'Modifier les informations de l\'entrée' : 'Ajouter une nouvelle entrée au stock'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Erreur générale */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projet <span className="text-red-500">*</span>
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.project ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.code})
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="mt-1 text-sm text-red-600">{errors.project}</p>
              )}
            </div>

            {/* Médicament */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médicament <span className="text-red-500">*</span>
              </label>
              <select
                name="medication"
                value={formData.medication}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.medication ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un médicament</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.name} - {med.dosage} ({med.form})
                  </option>
                ))}
              </select>
              {errors.medication && (
                <p className="mt-1 text-sm text-red-600">{errors.medication}</p>
              )}
            </div>

            {/* Date de livraison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de livraison <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.delivery_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.delivery_date && (
                <p className="mt-1 text-sm text-red-600">{errors.delivery_date}</p>
              )}
            </div>

            {/* Date d'expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.expiry_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>
              )}
            </div>

            {/* Quantité commandée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité commandée
              </label>
              <input
                type="number"
                name="quantity_ordered"
                value={formData.quantity_ordered}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Quantité livrée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité livrée <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity_delivered"
                value={formData.quantity_delivered}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.quantity_delivered ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantity_delivered && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity_delivered}</p>
              )}
            </div>

            {/* Prix unitaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.unit_price ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.unit_price && (
                <p className="mt-1 text-sm text-red-600">{errors.unit_price}</p>
              )}
            </div>

            {/* Fournisseur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Numéro de lot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de lot
              </label>
              <input
                type="text"
                name="batch_number"
                value={formData.batch_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>{stockEntry ? 'Modifier' : 'Ajouter'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEntryModal;
