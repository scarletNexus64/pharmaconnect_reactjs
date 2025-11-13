import React, { useState, useEffect } from 'react';
import { 
  Tag, Plus, Search, Edit, Trash2, Eye, 
  MoreVertical, Package, Info, Users, Calendar
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/medication-categories/');
      setCategories(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setError('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setShowDetails(true);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      code: category.code,
      description: category.description
    });
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleNewCategory = () => {
    setFormData({
      name: '',
      code: '',
      description: ''
    });
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        // Modification
        await apiService.request(`/medication-categories/${selectedCategory.id}/`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        });
      } else {
        // Création
        await apiService.request('/medication-categories/', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      
      setShowForm(false);
      await loadCategories();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (category) => {
    if (category.medications_count > 0) {
      setError('Impossible de supprimer une catégorie contenant des médicaments');
      return;
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      try {
        await apiService.request(`/medication-categories/${category.id}/`, {
          method: 'DELETE'
        });
        await loadCategories();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const getCategoryColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-orange-100 text-orange-800 border-orange-200'
    ];
    return colors[index % colors.length];
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
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
            Catégories de Médicaments
          </h1>
          <p className="text-gray-600 mt-1">
            Organisation et classification du référentiel thérapeutique
          </p>
        </div>
        <Button onClick={handleNewCategory} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </Button>
      </div>

      {/* Recherche */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher catégories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {categories.length} catégorie{categories.length > 1 ? 's' : ''} • {categories.reduce((sum, cat) => sum + cat.medications_count, 0)} médicaments
          </div>
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-sm text-red-700 underline mt-1"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Liste des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <Card key={category.id} className={`p-6 border-2 hover:shadow-lg transition-all ${getCategoryColor(index)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm opacity-75">{category.code}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 hover:bg-white hover:bg-opacity-30 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <p className="text-sm opacity-90 line-clamp-2">
                {category.description || 'Aucune description disponible'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {category.medications_count} médicament{category.medications_count > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs opacity-75">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(category.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleViewDetails(category)}
                variant="outline"
                size="sm"
                className="flex-1 bg-white bg-opacity-50 hover:bg-opacity-70"
              >
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              <Button
                onClick={() => handleEdit(category)}
                variant="outline"
                size="sm"
                className="bg-white bg-opacity-50 hover:bg-opacity-70"
              >
                <Edit className="w-4 h-4" />
              </Button>
              {category.medications_count === 0 && (
                <Button
                  onClick={() => handleDelete(category)}
                  variant="outline"
                  size="sm"
                  className="bg-white bg-opacity-50 hover:bg-opacity-70 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Détails de la catégorie
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p className="text-sm text-gray-900">{selectedCategory.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <p className="text-sm text-gray-900">{selectedCategory.code}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{selectedCategory.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Médicaments</label>
                  <p className="text-sm text-gray-900">{selectedCategory.medications_count} médicament{selectedCategory.medications_count > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Créée le</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedCategory.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                setShowDetails(false);
                handleEdit(selectedCategory);
              }}>
                Modifier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Antibiotiques"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: ATB"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Description de la catégorie..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {selectedCategory ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* État vide */}
      {!loading && filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune catégorie trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Aucune catégorie ne correspond à votre recherche.' : 'Commencez par créer des catégories pour organiser vos médicaments.'}
          </p>
          <Button onClick={handleNewCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Créer une catégorie
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CategoriesManager;