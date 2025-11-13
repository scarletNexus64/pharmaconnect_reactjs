import React, { useState, useEffect } from 'react';
import { 
  Pill, Plus, Search, Filter, Edit, Trash2, Eye, 
  Package, DollarSign, AlertTriangle, CheckCircle,
  MoreVertical, Download, Upload, Tag, MapPin,
  Activity, Clock, Info
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import apiService from '../../services/api';

const MedicationsManager = () => {
  const [medications, setMedications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicationsResponse, categoriesResponse] = await Promise.all([
        apiService.getMedications(),
        apiService.request('/medication-categories/')
      ]);
      
      setMedications(medicationsResponse.results || medicationsResponse);
      setCategories(categoriesResponse.results || categoriesResponse);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (medication) => {
    setSelectedMedication(medication);
    setShowDetails(true);
    
    // Charger les substitutions si disponibles
    try {
      const substitutions = await apiService.request(`/medications/${medication.id}/substitutions/`);
      setSelectedMedication({
        ...medication,
        substitutions
      });
    } catch (error) {
      console.error('Erreur chargement substitutions:', error);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.therapeutic_class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
      med.category_name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Référentiel Médicaments
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion des médicaments et base de données thérapeutique
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Importer</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau Médicament</span>
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, code ou classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Package className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredMedications.length} médicament{filteredMedications.length > 1 ? 's' : ''} trouvé{filteredMedications.length > 1 ? 's' : ''}</span>
          <div className="flex items-center space-x-4">
            {categories.map(cat => (
              <span key={cat.id} className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>{cat.name} ({cat.medications_count})</span>
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Vue grille */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedications.map((medication) => (
            <Card key={medication.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{medication.name}</h3>
                    <p className="text-xs text-gray-500">{medication.code}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(medication.is_active)}`}>
                    {medication.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  <span className="text-xs text-gray-500">{medication.category_name}</span>
                </div>

                <div className="text-xs text-gray-600">
                  <div className="flex items-center space-x-1 mb-1">
                    <Tag className="w-3 h-3" />
                    <span>{medication.dosage} - {medication.form}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    <Package className="w-3 h-3" />
                    <span>{medication.packaging}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">{medication.unit_price} FCFA</span>
                  </div>
                </div>

                {medication.therapeutic_class && (
                  <div className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                    {medication.therapeutic_class}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleViewDetails(medication)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Détails
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Vue liste */}
      {viewMode === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médicament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forme/Dosage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix Unitaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                          <div className="text-sm text-gray-500">{medication.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {medication.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{medication.form}</div>
                      <div className="text-gray-500">{medication.dosage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medication.unit_price} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(medication.is_active)}`}>
                        {medication.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleViewDetails(medication)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal de détails */}
      {showDetails && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Détails du médicament
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* En-tête du médicament */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMedication.name}</h3>
                  <p className="text-gray-600">{selectedMedication.code}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMedication.is_active)}`}>
                      {selectedMedication.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Catégorie: {selectedMedication.category_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations pharmaceutiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Informations Pharmaceutiques</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Forme galénique</label>
                      <p className="text-sm text-gray-900">{selectedMedication.form}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosage</label>
                      <p className="text-sm text-gray-900">{selectedMedication.dosage}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Conditionnement</label>
                      <p className="text-sm text-gray-900">{selectedMedication.packaging}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prix unitaire</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedMedication.unit_price} FCFA</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Classe thérapeutique</label>
                      <p className="text-sm text-gray-900">{selectedMedication.therapeutic_class}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Informations Thérapeutiques</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Indications</label>
                      <p className="text-sm text-gray-900">
                        {selectedMedication.indications || 'Non renseignées'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contre-indications</label>
                      <p className="text-sm text-gray-900">
                        {selectedMedication.contraindications || 'Non renseignées'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Effets secondaires</label>
                      <p className="text-sm text-gray-900">
                        {selectedMedication.side_effects || 'Non renseignés'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Posologie</label>
                      <p className="text-sm text-gray-900">
                        {selectedMedication.dosage_instructions || 'Non renseignée'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Substitutions */}
              {selectedMedication.substitutions && selectedMedication.substitutions.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Substitutions Possibles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedMedication.substitutions.map((sub) => (
                      <div key={sub.id} className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-blue-900">{sub.substitute_medication_name}</p>
                        <p className="text-sm text-blue-600">{sub.substitute_medication_code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              <Button>
                Modifier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {!loading && filteredMedications.length === 0 && (
        <Card className="p-12 text-center">
          <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun médicament trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory ? 'Aucun médicament ne correspond à vos critères.' : 'Commencez par ajouter des médicaments au référentiel.'}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un médicament
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MedicationsManager;