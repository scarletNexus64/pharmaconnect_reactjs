import React, { useState, useEffect } from 'react';
import {
  Building, Users, MapPin, Calendar, ChevronRight, AlertTriangle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganizations();
      setOrganizations(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des organisations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des organisations...</p>
          </div>
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
          <span className="text-gray-700 font-medium">Organisations</span>
        </nav>

        {/* Page Title */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Organisations</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos organisations et accédez aux détails de chaque structure.
              Les nouvelles organisations doivent être créées via l'interface d'administration Django.
            </p>
        </div>

        {/* Organizations Grid */}
          {organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        org.type === 'NGO' ? 'bg-green-100 text-green-800' :
                        org.type === 'GOVERNMENT' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {org.type === 'NGO' ? 'ONG' : 
                         org.type === 'GOVERNMENT' ? 'Gouvernement' : org.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Code: {org.code}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{org.country || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Créée le {new Date(org.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {org.contact_email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{org.contact_email}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/organizations/${org.id}`}
                      className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      Voir les détails
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune organisation trouvée
                </h3>
                <p className="text-gray-500">
                  Aucune organisation n'est associée à votre compte.
                  Contactez l'administrateur système pour être ajouté à une organisation.
                </p>
              </div>
            </Card>
          )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Information importante</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Les organisations sont gérées par l'administrateur de la plateforme via Django Admin. 
                    Si vous avez besoin de créer une nouvelle organisation ou de modifier les informations 
                    existantes, veuillez contacter l'administrateur système.
                  </p>
                </div>
              </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Organizations;