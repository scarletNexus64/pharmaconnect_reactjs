import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';
import apiService from '../../services/api';

const CollapsibleSection = ({ title, isExpanded, onToggle, children }) => (
  <div className="border border-gray-200 rounded-lg">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
    >
      <span className="font-medium text-gray-900">{title}</span>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
    {isExpanded && (
      <div className="p-4">
        {children}
      </div>
    )}
  </div>
);

const MedicationEditModal = ({ isOpen, onClose, onSuccess, categories, medication }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    dosage: '',
    form: '',
    packaging: '',
    unit_price: '',
    therapeutic_class: '',
    is_active: true,
    designation: '',
    administration_route: '',
    posology: '',
    posology_unit: '',
    care_level: '',
    pathology: '',
    pharmacotherapeutic: '',
    storage_conditions: '',
    structure_types: '',
    protocol: '',
    protocol_justification: '',
    precautions: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    principal: true,
    presentation: false,
    therapeutic: false,
    posology: false,
    indications: false,
    careLevel: false,
    protocol: false,
    precautions: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pré-remplir le formulaire avec les données du médicament
  useEffect(() => {
    if (medication && isOpen) {
      setFormData({
        code: medication.code || '',
        name: medication.name || '',
        category: medication.category || '',
        dosage: medication.dosage || '',
        form: medication.form || '',
        packaging: medication.packaging || '',
        unit_price: medication.unit_price || '',
        therapeutic_class: medication.therapeutic_class || '',
        is_active: medication.is_active ?? true,
        designation: medication.designation || '',
        administration_route: medication.administration_route || '',
        posology: medication.posology || '',
        posology_unit: medication.posology_unit || '',
        care_level: medication.care_level || '',
        pathology: medication.pathology || '',
        pharmacotherapeutic: medication.pharmacotherapeutic || '',
        storage_conditions: medication.storage_conditions || '',
        structure_types: medication.structure_types || '',
        protocol: medication.protocol || '',
        protocol_justification: medication.protocol_justification || '',
        precautions: medication.precautions || ''
      });
    }
  }, [medication, isOpen]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.code || !formData.name || !formData.category || !formData.form) {
      setError('Le code, nom, catégorie et forme sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      // Préparer les données pour l'envoi
      const dataToSend = {
        ...formData,
        category: parseInt(formData.category),
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : 0
      };
      
      await apiService.updateMedication(medication.id, dataToSend);
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError(error.message || 'Erreur lors de la mise à jour du médicament');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !medication) return null;

  const formsOptions = [
    'Comprimé',
    'Gélule',
    'Sirop',
    'Suspension',
    'Solution injectable',
    'Pommade',
    'Crème',
    'Gel',
    'Suppositoire',
    'Solution buvable',
    'Poudre',
    'Collyre',
    'Patch',
    'Spray'
  ];

  const administrationRouteOptions = [
    { value: 'ORAL', label: 'Voie orale' },
    { value: 'IV', label: 'Intraveineuse' },
    { value: 'IM', label: 'Intramusculaire' },
    { value: 'SC', label: 'Sous-cutanée' },
    { value: 'TOPIQUE', label: 'Application locale' },
    { value: 'INHALATION', label: 'Inhalation' },
    { value: 'RECTALE', label: 'Voie rectale' },
    { value: 'VAGINALE', label: 'Voie vaginale' },
    { value: 'OCULAIRE', label: 'Voie oculaire' },
    { value: 'NASALE', label: 'Voie nasale' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  const careLevelOptions = [
    { value: 'SSP', label: 'Soins de santé primaire' },
    { value: 'SSS', label: 'Soins de santé secondaire' },
    { value: 'TERTIAIRE', label: 'Soins tertiaires' },
    { value: 'TOUS', label: 'Tous niveaux' }
  ];

  const posologyUnits = [
    'mg', 'g', 'ml', 'comprimé(s)', 'gélule(s)', 'cuillère(s)', 'goutte(s)', 'application(s)', 'inhalation(s)'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Modifier le Médicament</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section Informations principales */}
          <CollapsibleSection
            title="Informations principales"
            isExpanded={expandedSections.principal}
            onToggle={() => toggleSection('principal')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: PARA500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du médicament *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Paracétamol"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Désignation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Désignation complète du médicament"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 500mg"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Présentation et conditionnement */}
          <CollapsibleSection
            title="Présentation et conditionnement"
            isExpanded={expandedSections.presentation}
            onToggle={() => toggleSection('presentation')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forme galénique *
                </label>
                <select
                  value={formData.form}
                  onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une forme</option>
                  {formsOptions.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conditionnement
                </label>
                <input
                  type="text"
                  value={formData.packaging}
                  onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Boîte de 20 comprimés"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix unitaire (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conditions de stockage
                </label>
                <input
                  type="text"
                  value={formData.storage_conditions}
                  onChange={(e) => setFormData({ ...formData, storage_conditions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: À conserver au frais"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Classification thérapeutique */}
          <CollapsibleSection
            title="Classification thérapeutique"
            isExpanded={expandedSections.therapeutic}
            onToggle={() => toggleSection('therapeutic')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classe thérapeutique
                </label>
                <input
                  type="text"
                  value={formData.therapeutic_class}
                  onChange={(e) => setFormData({ ...formData, therapeutic_class: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Antalgique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pharmacothérapeutique
                </label>
                <input
                  type="text"
                  value={formData.pharmacotherapeutic}
                  onChange={(e) => setFormData({ ...formData, pharmacotherapeutic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Classification pharmacothérapeutique"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Posologie et administration */}
          <CollapsibleSection
            title="Posologie et administration"
            isExpanded={expandedSections.posology}
            onToggle={() => toggleSection('posology')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voie d'administration
                </label>
                <select
                  value={formData.administration_route}
                  onChange={(e) => setFormData({ ...formData, administration_route: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une voie</option>
                  {administrationRouteOptions.map((route) => (
                    <option key={route.value} value={route.value}>
                      {route.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unité posologique
                </label>
                <select
                  value={formData.posology_unit}
                  onChange={(e) => setFormData({ ...formData, posology_unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une unité</option>
                  {posologyUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posologie
                </label>
                <textarea
                  value={formData.posology}
                  onChange={(e) => setFormData({ ...formData, posology: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Posologie détaillée (adulte, enfant, fréquence...)"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Indications et pathologies */}
          <CollapsibleSection
            title="Indications et pathologies"
            isExpanded={expandedSections.indications}
            onToggle={() => toggleSection('indications')}
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pathologies
                </label>
                <input
                  type="text"
                  value={formData.pathology}
                  onChange={(e) => setFormData({ ...formData, pathology: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Pathologies traitées"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Niveaux de soins et structures autorisées */}
          <CollapsibleSection
            title="Niveaux de soins et structures autorisées"
            isExpanded={expandedSections.careLevel}
            onToggle={() => toggleSection('careLevel')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau de soins
                </label>
                <select
                  value={formData.care_level}
                  onChange={(e) => setFormData({ ...formData, care_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un niveau</option>
                  {careLevelOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Types de structures
                </label>
                <input
                  type="text"
                  value={formData.structure_types}
                  onChange={(e) => setFormData({ ...formData, structure_types: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: CSI, CS, Hôpital"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Protocole et justification */}
          <CollapsibleSection
            title="Protocole et justification"
            isExpanded={expandedSections.protocol}
            onToggle={() => toggleSection('protocol')}
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protocole
                </label>
                <textarea
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Protocole d'utilisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification du protocole
                </label>
                <textarea
                  value={formData.protocol_justification}
                  onChange={(e) => setFormData({ ...formData, protocol_justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Justification médicale du protocole"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Section Contre-indications et précautions */}
          <CollapsibleSection
            title="Contre-indications et précautions"
            isExpanded={expandedSections.precautions}
            onToggle={() => toggleSection('precautions')}
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Précautions d'emploi
                </label>
                <textarea
                  value={formData.precautions}
                  onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="4"
                  placeholder="Contre-indications, interactions, précautions d'emploi..."
                />
              </div>
            </div>
          </CollapsibleSection>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
              Médicament actif
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              disabled={loading || categories.length === 0}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
            >
              {loading ? 'Modification...' : 'Modifier le médicament'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationEditModal;