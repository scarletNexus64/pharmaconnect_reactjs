import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Mail, Shield, MoreVertical, Edit3, Trash2, UserX, UserCheck, Download, Upload } from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Données fictives des utilisateurs
  const users = [
    {
      id: 1,
      name: 'Dr. Alain Martin',
      email: 'alain.martin@mdm.org',
      organization: 'Médecins du Monde',
      role: 'Admin ONG',
      status: 'active',
      lastLogin: '2 min',
      projects: ['Santé Comm. Bangangté', 'Urgence Yaoundé'],
      avatar: null
    },
    {
      id: 2,
      name: 'Inf. Marie Kala',
      email: 'marie.kala@mdm.org',
      organization: 'Médecins du Monde',
      role: 'Terrain',
      status: 'active',
      lastLogin: '1h',
      projects: ['Santé Comm. Bangangté'],
      avatar: null
    },
    {
      id: 3,
      name: 'Pharmacien Jules',
      email: 'jules.mballa@msf.org',
      organization: 'MSF',
      role: 'Gestionnaire Stock',
      status: 'active',
      lastLogin: '3h',
      projects: ['Urgence Cameroun', 'VIH Prevention'],
      avatar: null
    },
    {
      id: 4,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.j@unicef.org',
      organization: 'UNICEF',
      role: 'Coordinateur',
      status: 'inactive',
      lastLogin: '2 jours',
      projects: ['Nutrition Infantile'],
      avatar: null
    },
    {
      id: 5,
      name: 'Tech. Paul Etoa',
      email: 'paul.etoa@gov.cm',
      organization: 'Ministère Santé',
      role: 'Lecture seule',
      status: 'pending',
      lastLogin: 'Jamais',
      projects: [],
      avatar: null
    }
  ];

  const roles = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin_ong', label: 'Admin ONG' },
    { value: 'coordinateur', label: 'Coordinateur' },
    { value: 'gestionnaire', label: 'Gestionnaire Stock' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'lecture', label: 'Lecture seule' }
  ];

  const organizations = [
    { value: 'all', label: 'Toutes organisations' },
    { value: 'mdm', label: 'Médecins du Monde' },
    { value: 'msf', label: 'MSF' },
    { value: 'unicef', label: 'UNICEF' },
    { value: 'gov', label: 'Gouvernement' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase().includes(selectedRole.toLowerCase());
    const matchesOrg = selectedOrg === 'all' || user.organization.toLowerCase().includes(selectedOrg.toLowerCase());
    
    return matchesSearch && matchesRole && matchesOrg;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const InviteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Inviter un utilisateur</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="utilisateur@organisation.org"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {organizations.slice(1).map(org => (
                <option key={org.value} value={org.value}>{org.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {roles.slice(1).map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message personnalisé (optionnel)</label>
            <textarea
              placeholder="Bienvenue dans l'équipe..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={() => setShowInviteModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Envoyer l'invitation
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
            <Users className="w-6 h-6 mr-2" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-1">Gérer les utilisateurs, rôles et permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </button>
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Inviter Utilisateur
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Utilisateurs</p>
              <p className="text-xl font-semibold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-xl font-semibold">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Mail className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-xl font-semibold">{users.filter(u => u.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserX className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Inactifs</p>
              <p className="text-xl font-semibold">{users.filter(u => u.status === 'inactive').length}</p>
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
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {organizations.map(org => (
                <option key={org.value} value={org.value}>{org.label}</option>
              ))}
            </select>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions en masse */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedUsers.length} utilisateur(s) sélectionné(s)
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Activer
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                Désactiver
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organisation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.organization}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Affichage de {filteredUsers.length} utilisateur(s) sur {users.length} au total
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Précédent</button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Suivant</button>
        </div>
      </div>

      {/* Modal d'invitation */}
      {showInviteModal && <InviteModal />}
    </div>
  );
};

export default UserManagement;