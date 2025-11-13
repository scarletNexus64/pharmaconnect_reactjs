import React from 'react';
import { X, Pill, Tag, Package, DollarSign, Activity } from 'lucide-react';

const MedicationDetailsModal = ({ isOpen, onClose, medication, categories }) => {
  if (!isOpen || !medication) return null;

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const administrationRouteLabels = {
    'ORAL': 'Voie orale',
    'IV': 'Intraveineuse',
    'IM': 'Intramusculaire',
    'SC': 'Sous-cutanée',
    'TOPIQUE': 'Application locale',
    'INHALATION': 'Inhalation',
    'RECTALE': 'Voie rectale',
    'VAGINALE': 'Voie vaginale',
    'OCULAIRE': 'Voie oculaire',
    'NASALE': 'Voie nasale',
    'AUTRE': 'Autre'
  };

  const careLevelLabels = {
    'SSP': 'Soins de santé primaire',
    'SSS': 'Soins de santé secondaire',
    'TERTIAIRE': 'Soins tertiaires',
    'TOUS': 'Tous niveaux'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{medication.name}</h3>
              <p className="text-gray-600">Code: {medication.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Informations générales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p className="text-gray-900">{medication.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <p className="text-gray-900">{medication.code}</p>
                </div>
                {medication.designation && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Désignation</label>
                    <p className="text-gray-900">{medication.designation}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <p className="text-gray-900">{getCategoryName(medication.category)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <p className="text-gray-900">{medication.dosage || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Présentation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-500" />
                Présentation et conditionnement
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Forme galénique</label>
                  <p className="text-gray-900">{medication.form}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Conditionnement</label>
                  <p className="text-gray-900">{medication.packaging || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix unitaire</label>
                  <p className="text-gray-900">{medication.unit_price}€</p>
                </div>
                {medication.storage_conditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conditions de stockage</label>
                    <p className="text-gray-900">{medication.storage_conditions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Classification thérapeutique */}
            {(medication.therapeutic_class || medication.pharmacotherapeutic) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-purple-500" />
                  Classification thérapeutique
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medication.therapeutic_class && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Classe thérapeutique</label>
                      <p className="text-gray-900">{medication.therapeutic_class}</p>
                    </div>
                  )}
                  {medication.pharmacotherapeutic && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pharmacothérapeutique</label>
                      <p className="text-gray-900">{medication.pharmacotherapeutic}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Posologie et administration */}
            {(medication.administration_route || medication.posology || medication.posology_unit) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Posologie et administration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medication.administration_route && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Voie d'administration</label>
                      <p className="text-gray-900">{administrationRouteLabels[medication.administration_route] || medication.administration_route}</p>
                    </div>
                  )}
                  {medication.posology_unit && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unité posologique</label>
                      <p className="text-gray-900">{medication.posology_unit}</p>
                    </div>
                  )}
                  {medication.posology && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Posologie</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{medication.posology}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Indications et niveaux de soins */}
            {(medication.pathology || medication.care_level || medication.structure_types) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Indications et niveaux de soins
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medication.pathology && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pathologies</label>
                      <p className="text-gray-900">{medication.pathology}</p>
                    </div>
                  )}
                  {medication.care_level && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Niveau de soins</label>
                      <p className="text-gray-900">{careLevelLabels[medication.care_level] || medication.care_level}</p>
                    </div>
                  )}
                  {medication.structure_types && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Types de structures</label>
                      <p className="text-gray-900">{medication.structure_types}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Protocole */}
            {(medication.protocol || medication.protocol_justification) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Protocole et justification
                </h4>
                <div className="space-y-4">
                  {medication.protocol && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Protocole</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{medication.protocol}</p>
                    </div>
                  )}
                  {medication.protocol_justification && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Justification du protocole</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{medication.protocol_justification}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Précautions */}
            {medication.precautions && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Contre-indications et précautions
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Précautions d'emploi</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{medication.precautions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar avec informations complémentaires */}
          <div className="space-y-6">
            {/* Statut */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Statut</h4>
              <div className="flex items-center">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  medication.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {medication.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            {/* Informations de création */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Informations</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 text-gray-900">{medication.id}</span>
                </div>
                {medication.created_at && (
                  <div>
                    <span className="text-gray-600">Créé le:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(medication.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {medication.updated_at && (
                  <div>
                    <span className="text-gray-600">Modifié le:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(medication.updated_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsModal;