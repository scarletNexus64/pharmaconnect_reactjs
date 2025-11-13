import React, { useState } from 'react';
import { Building, Plus, Search, Filter, MapPin, Users, Briefcase, Edit3, Trash2, Settings, MoreVertical, Globe, Phone, Mail, X } from 'lucide-react';

const OrganizationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Données fictives des organisations
  const organizations = [
    {
      id: 1,
      name: 'Médecins du Monde',
      type: 'ONG',
      country: 'France',
      headquarters: 'Paris',
      email: 'contact@mdm.org',
      phone: '+33 1 44 92 15 15',
      website: 'https://www.medecinsdumonde.org',
      projects: 8,
      sites: 25,
      users: 156,
      budget: '2.5M€',
      status: 'active',
      founded: '1980',
      description: 'ONG médicale française intervenant dans l\'urgence et le développement'
    },
    {
      id: 2,
      name: 'Médecins Sans Frontières',
      type: 'ONG',
      country: 'Belgique',
      headquarters: 'Bruxelles',
      email: 'info@msf.org',
      phone: '+32 2 280 18 81',
      website: 'https://www.msf.org',
      projects: 12,
      sites: 45,
      users: 289,
      budget: '5.8M€',
      status: 'active',
      founded: '1971',
      description: 'Organisation médicale humanitaire internationale'
    },
    {
      id: 3,
      name: 'UNICEF Cameroun',
      type: 'Agence ONU',
      country: 'Cameroun',
      headquarters: 'Yaoundé',
      email: 'yaounde@unicef.org',
      phone: '+237 222 23 98 00',
      website: 'https://www.unicef.org/cameroon',
      projects: 6,
      sites: 18,
      users: 67,
      budget: '12.3M€',
      status: 'active',
      founded: '1975',
      description: 'Fonds des Nations Unies pour l\'enfance'
    },
    {
      id: 4,
      name: 'Programme VIH National',
      type: 'Gouvernement',
      country: 'Cameroun',
      headquarters: 'Yaoundé',
      email: 'pnls@minsante.cm',
      phone: '+237 222 23 40 30',
      website: 'https://minsante.cm',
      projects: 3,
      sites: 12,
      users: 45,
      budget: '8.7M€',
      status: 'active',
      founded: '2001',
      description: 'Programme National de Lutte contre le Sida'
    },
    {
      id: 5,
      name: 'Action Contre la Faim',
      type: 'ONG',
      country: 'France',
      headquarters: 'Paris',
      email: 'info@actioncontrelafaim.org',
      phone: '+33 1 43 35 88 88',
      website: 'https://www.actioncontrelafaim.org',
      projects: 4,
      sites: 8,
      users: 23,
      budget: '1.2M€',
      status: 'pending',
      founded: '1979',
      description: 'ONG de lutte contre la faim et la malnutrition'
    }
  ];

  const organizationTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'ong', label: 'ONG' },
    { value: 'agence_onu', label: 'Agence ONU' },
    { value: 'gouvernement', label: 'Gouvernement' },
    { value: 'prive', label: 'Secteur Privé' }
  ];

  const countries = [
    { value: 'all', label: 'Tous les pays' },
    { value: 'france', label: 'France' },
    { value: 'cameroun', label: 'Cameroun' },
    { value: 'belgique', label: 'Belgique' },
    { value: 'senegal', label: 'Sénégal' },
    { value: 'burkina', label: 'Burkina Faso' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'inactive': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ONG': return 'bg-blue-100 text-blue-800';
      case 'Agence ONU': return 'bg-purple-100 text-purple-800';
      case 'Gouvernement': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || org.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || org.country.toLowerCase().includes(selectedCountry.toLowerCase());
    
    return matchesSearch && matchesType && matchesCountry;
  });

  const CreateOrganizationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Créer une nouvelle organisation</h3>
          <button onClick={() => setShowCreateModal(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Informations générales</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'organisation *</label>
              <input
                type="text"
                placeholder="ex: Médecins du Monde"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d'organisation *</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                {organizationTypes.slice(1).map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {countries.slice(1).map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Siège social</label>
                <input
                  type="text"
                  placeholder="ex: Paris"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Description de l'organisation et de ses activités..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact et configuration */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Contact et configuration</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email principal *</label>
              <input
                type="email"
                placeholder="contact@organisation.org"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                placeholder="+33 1 23 45 67 89"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
              <input
                type="url"
                placeholder="https://www.organisation.org"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget annuel estimé</label>
              <input
                type="text"
                placeholder="ex: 2.5M€"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année de création</label>
              <input
                type="number"
                placeholder="ex: 1980"
                min="1900"
                max="2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Configuration permissions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Configuration initiale</h4>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm">Accès à la cartographie</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm">Analytics avancées</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm">Import/Export données</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm">Gestion multi-projets</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button 
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Créer l'organisation
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="w-6 h-6 mr-2" />
            Gestion des Organisations
          </h1>
          <p className="text-gray-600 mt-1">Administrer les ONG, programmes et partenaires</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Carte
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Organisation
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Organisations</p>
              <p className="text-xl font-semibold">{organizations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Projets Actifs</p>
              <p className="text-xl font-semibold">{organizations.reduce((sum, org) => sum + org.projects, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Sites Déployés</p>
              <p className="text-xl font-semibold">{organizations.reduce((sum, org) => sum + org.sites, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-xl font-semibold">{organizations.reduce((sum, org) => sum + org.users, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {organizationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {countries.map(country => (
                <option key={country.value} value={country.value}>{country.label}</option>
              ))}
            </select>
            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des organisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <div key={org.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(org.type)}`}>
                      {org.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                      {getStatusText(org.status)}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{org.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {org.headquarters}, {org.country}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {org.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {org.phone}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{org.projects}</p>
                <p className="text-xs text-gray-500">Projets</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{org.sites}</p>
                <p className="text-xs text-gray-500">Sites</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{org.users}</p>
                <p className="text-xs text-gray-500">Utilisateurs</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Budget: {org.budget}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création */}
      {showCreateModal && <CreateOrganizationModal />}
    </div>
  );
};

export default OrganizationManagement;