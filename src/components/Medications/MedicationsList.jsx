import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Eye, Edit, Trash2, Package } from 'lucide-react';

const MedicationsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedForm, setSelectedForm] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedication, setSelectedMedication] = useState(null);

  // Données fictives des médicaments
  const medications = [
    {
      id: 1,
      code: 'M001',
      name: 'Amoxicilline',
      dosage: '500mg',
      form: 'Gélule',
      category: 'Antibiotique',
      indication: 'Infections respiratoires, ORL, urinaires',
      contraindication: 'Allergie pénicillines',
      posology: '1g/jour en 2-3 prises',
      authorizedLevels: ['CSI', 'CS', 'Hôpital', 'Mobile'],
      price: 2.50,
      stockStatus: 'available',
      lastUpdated: '2024-10-01'
    },
    {
      id: 2,
      code: 'M002',
      name: 'Paracétamol',
      dosage: '500mg',
      form: 'Comprimé',
      category: 'Antalgique',
      indication: 'Douleur, fièvre',
      contraindication: 'Insuffisance hépatique sévère',
      posology: '1-2 cp toutes les 6h max',
      authorizedLevels: ['CSI', 'CS', 'Hôpital', 'Mobile', 'ASC'],
      price: 0.15,
      stockStatus: 'low',
      lastUpdated: '2024-09-28'
    },
    {
      id: 3,
      name: 'Artémether',
      code: 'M003',
      dosage: '80mg/ml',
      form: 'Injectable',
      category: 'Antipaludique',
      indication: 'Paludisme grave',
      contraindication: 'Allergie artémisinine',
      posology: '3.2mg/kg IM puis 1.6mg/kg/j',
      authorizedLevels: ['Hôpital', 'CS'],
      price: 15.20,
      stockStatus: 'out',
      lastUpdated: '2024-10-02'
    },
    {
      id: 4,
      code: 'M004',
      name: 'ORS (Sels de Réhydratation)',
      dosage: '20.5g',
      form: 'Sachet',
      category: 'Réhydratation',
      indication: 'Diarrhée, déshydratation',
      contraindication: 'Occlusion intestinale',
      posology: '1 sachet dans 1L d\'eau',
      authorizedLevels: ['CSI', 'CS', 'Hôpital', 'Mobile', 'ASC'],
      price: 0.35,
      stockStatus: 'available',
      lastUpdated: '2024-09-30'
    },
    {
      id: 5,
      code: 'M005',
      name: 'Cotrimoxazole',
      dosage: '480mg',
      form: 'Comprimé',
      category: 'Antibiotique',
      indication: 'Infections urinaires, pneumocystose',
      contraindication: 'Allergie sulfamides',
      posology: '1 cp x2/j pendant 5-10j',
      authorizedLevels: ['CSI', 'CS', 'Hôpital'],
      price: 0.45,
      stockStatus: 'low',
      lastUpdated: '2024-09-29'
    }
  ];

  const categories = ['Tous', 'Antibiotique', 'Antalgique', 'Antipaludique', 'Réhydratation', 'Antifongique'];
  const forms = ['Toutes', 'Comprimé', 'Gélule', 'Injectable', 'Sirop', 'Sachet', 'Crème'];
  const levels = ['Tous', 'CSI', 'CS', 'Hôpital', 'Mobile', 'ASC'];

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (status) => {
    switch (status) {
      case 'available': return '🟢';
      case 'low': return '🟡';
      case 'out': return '🔴';
      default: return '⚪';
    }
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    const matchesForm = selectedForm === 'all' || med.form === selectedForm;
    const matchesLevel = selectedLevel === 'all' || med.authorizedLevels.includes(selectedLevel);
    
    return matchesSearch && matchesCategory && matchesForm && matchesLevel;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Référentiel Médicaments</h1>
          <p className="text-gray-600 mt-1">Gestion des médicaments et produits pharmaceutiques</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Import Excel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Recherche */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou code..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'Tous' ? 'all' : cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Forme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forme</label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {forms.map(form => (
                <option key={form} value={form === 'Toutes' ? 'all' : form}>{form}</option>
              ))}
            </select>
          </div>

          {/* Niveau soins */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level === 'Tous' ? 'all' : level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            {filteredMedications.length} médicament(s) trouvé(s)
          </p>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="actifs" className="rounded" />
            <label htmlFor="actifs" className="text-sm text-gray-600">Actifs uniquement</label>
          </div>
        </div>
      </div>

      {/* Liste des médicaments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nom</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Dosage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Forme</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Prix</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med) => (
                <tr key={med.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{med.code}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{med.name}</div>
                      <div className="text-sm text-gray-600">{med.category}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{med.dosage}</td>
                  <td className="py-3 px-4 text-gray-600">{med.form}</td>
                  <td className="py-3 px-4 font-medium">{med.price}€</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(med.stockStatus)}`}>
                      {getStockStatusIcon(med.stockStatus)} {
                        med.stockStatus === 'available' ? 'Disponible' :
                        med.stockStatus === 'low' ? 'Faible' : 'Rupture'
                      }
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedMedication(med)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détail médicament */}
      {selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMedication.name}</h2>
                  <p className="text-gray-600">{selectedMedication.dosage} - {selectedMedication.form}</p>
                </div>
                <button 
                  onClick={() => setSelectedMedication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🏷️ Informations générales</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div><span className="font-medium">Code:</span> {selectedMedication.code}</div>
                      <div><span className="font-medium">Catégorie:</span> {selectedMedication.category}</div>
                      <div><span className="font-medium">Prix:</span> {selectedMedication.price}€</div>
                      <div><span className="font-medium">Dernière MAJ:</span> {selectedMedication.lastUpdated}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">💊 Posologie</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800">{selectedMedication.posology}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">📋 Indications</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-green-800">{selectedMedication.indication}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">⚠️ Contre-indications</h3>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-red-800">{selectedMedication.contraindication}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🏥 Niveaux autorisés</h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedMedication.authorizedLevels.map((level, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-sm">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedMedication(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsList;