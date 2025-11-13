import React, { useState, useEffect } from 'react';
import {
  Pill, Plus, Search, Filter, Eye, Package, DollarSign,
  ChevronRight, Activity, Bell, LogOut, Tag, AlertCircle,
  Grid, List, MoreVertical, Edit, Trash2, CheckCircle,
  Clock, Info, TrendingUp
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';
import CategoryModal from '../../components/Medications/CategoryModal';
import MedicationModal from '../../components/Medications/MedicationModal';
import MedicationDetailsModal from '../../components/Medications/MedicationDetailsModal';
import MedicationEditModal from '../../components/Medications/MedicationEditModal';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicationsRes, categoriesRes] = await Promise.all([
        apiService.getMedications(),
        apiService.request('/medication-categories/')
      ]);
      
      setMedications(medicationsRes.results || []);
      setCategories(categoriesRes.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setMedications([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleViewDetails = (medication) => {
    setSelectedMedication(medication);
    setShowDetailsModal(true);
  };

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    setShowEditModal(true);
  };

  const handleDeleteMedication = async (medicationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      try {
        await apiService.deleteMedication(medicationId);
        loadData(); // Recharger les données
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du médicament');
      }
    }
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = !searchTerm || 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      med.category === parseInt(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: medications.length,
    active: medications.filter(m => m.is_active).length,
    categories: categories.length,
    stockValue: medications.reduce((sum, med) => sum + (med.unit_price || 0), 0)
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des médicaments...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
                </div>
                <div className="hidden md:block text-sm text-gray-500">
                  Gestion des Médicaments
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-gray-700 font-medium">
                        {user?.first_name} {user?.last_name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {user?.organization_name}
                      </div>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="w-6 h-6" />
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 font-medium">Médicaments</span>
          </nav>

          {/* Page Title & Actions */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Médicaments</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos médicaments et catégories pour votre organisation.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowCategoryModal(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Tag className="w-4 h-4" />
                <span>Nouvelle Catégorie</span>
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Médicament</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Pill className="w-8 h-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Médicaments</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Actifs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="w-8 h-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Catégories</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.categories}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="w-8 h-8 text-orange-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Valeur Totale</p>
                  <p className="text-2xl font-semibold text-gray-900">{Math.round(stats.stockValue)}€</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>

          {/* Medications List */}
          {filteredMedications.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedications.map((medication) => (
                  <Card key={medication.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Pill className="w-6 h-6 text-white" />
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          medication.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {medication.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{medication.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Code: {medication.code}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {medication.dosage} - {medication.form}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Prix unitaire:</span>
                          <span className="font-medium">{medication.unit_price}€</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Catégorie:</span>
                          <span className="font-medium">
                            {categories.find(c => c.id === medication.category)?.name || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => handleViewDetails(medication)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Voir détails
                        </button>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditMedication(medication)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Éditer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Médicament
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
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
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                <Pill className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                                <div className="text-sm text-gray-500">{medication.dosage} - {medication.form}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {medication.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {categories.find(c => c.id === medication.category)?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {medication.unit_price}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              medication.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {medication.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleViewDetails(medication)}
                                className="text-green-600 hover:text-green-900"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditMedication(medication)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Éditer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteMedication(medication.id)}
                                className="text-gray-400 hover:text-red-600"
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
              </Card>
            )
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun médicament trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedCategory 
                    ? 'Aucun médicament ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre premier médicament.'}
                </p>
                {!searchTerm && !selectedCategory && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer mon premier médicament
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Gestion des médicaments</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Les médicaments et catégories créés ici appartiennent à votre organisation ({user?.organization_name}). 
                    Vous pouvez créer, modifier et gérer vos propres référentiels de médicaments indépendamment des autres organisations.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </main>

        {/* Modals */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSuccess={() => {
            setShowCategoryModal(false);
            loadData(); // Recharger les données après création
          }}
        />

        <MedicationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          categories={categories}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData(); // Recharger les données après création
          }}
        />

        <MedicationDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedMedication(null);
          }}
          medication={selectedMedication}
          categories={categories}
        />

        <MedicationEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMedication(null);
          }}
          categories={categories}
          medication={selectedMedication}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedMedication(null);
            loadData(); // Recharger les données après modification
          }}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Medications;