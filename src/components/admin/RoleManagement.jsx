import React, { useState } from 'react';
import { Shield, Plus, Edit3, Trash2, Users, Lock, Unlock, Eye, Save, X } from 'lucide-react';

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState('admin_ong');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Définition des modules et permissions
  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Accès aux tableaux de bord',
      permissions: ['view', 'stats']
    },
    {
      id: 'medications',
      name: 'Médicaments',
      description: 'Gestion du référentiel médicaments',
      permissions: ['view', 'create', 'edit', 'delete', 'import', 'export']
    },
    {
      id: 'dispensation',
      name: 'Dispensation',
      description: 'Processus de dispensation',
      permissions: ['view', 'create', 'edit', 'photo', 'validate']
    },
    {
      id: 'stock',
      name: 'Gestion Stocks',
      description: 'Entrées, sorties, inventaires',
      permissions: ['view', 'create', 'edit', 'inventory', 'reports']
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Analyses et rapports',
      permissions: ['view', 'export', 'advanced', 'epidemio']
    },
    {
      id: 'users',
      name: 'Utilisateurs',
      description: 'Gestion utilisateurs et permissions',
      permissions: ['view', 'create', 'edit', 'delete', 'roles']
    },
    {
      id: 'organizations',
      name: 'Organisations',
      description: 'Gestion des organisations',
      permissions: ['view', 'create', 'edit', 'delete', 'config']
    },
    {
      id: 'projects',
      name: 'Projets',
      description: 'Gestion des projets',
      permissions: ['view', 'create', 'edit', 'delete', 'budget']
    }
  ];

  // Rôles prédéfinis avec leurs permissions
  const roles = [
    {
      id: 'super_admin',
      name: 'Super Administrateur',
      description: 'Accès complet à toutes les fonctionnalités',
      color: 'bg-red-100 text-red-800',
      userCount: 2,
      isSystem: true,
      permissions: {
        dashboard: ['view', 'stats'],
        medications: ['view', 'create', 'edit', 'delete', 'import', 'export'],
        dispensation: ['view', 'create', 'edit', 'photo', 'validate'],
        stock: ['view', 'create', 'edit', 'inventory', 'reports'],
        analytics: ['view', 'export', 'advanced', 'epidemio'],
        users: ['view', 'create', 'edit', 'delete', 'roles'],
        organizations: ['view', 'create', 'edit', 'delete', 'config'],
        projects: ['view', 'create', 'edit', 'delete', 'budget']
      }
    },
    {
      id: 'admin_ong',
      name: 'Administrateur ONG',
      description: 'Gestion complète pour son organisation',
      color: 'bg-blue-100 text-blue-800',
      userCount: 8,
      isSystem: true,
      permissions: {
        dashboard: ['view', 'stats'],
        medications: ['view', 'create', 'edit', 'import', 'export'],
        dispensation: ['view', 'create', 'edit', 'photo', 'validate'],
        stock: ['view', 'create', 'edit', 'inventory', 'reports'],
        analytics: ['view', 'export', 'advanced', 'epidemio'],
        users: ['view', 'create', 'edit'],
        organizations: ['view', 'edit', 'config'],
        projects: ['view', 'create', 'edit', 'budget']
      }
    },
    {
      id: 'coordinateur',
      name: 'Coordinateur Projet',
      description: 'Coordination d\'un ou plusieurs projets',
      color: 'bg-green-100 text-green-800',
      userCount: 15,
      isSystem: true,
      permissions: {
        dashboard: ['view', 'stats'],
        medications: ['view', 'edit'],
        dispensation: ['view', 'create', 'edit', 'photo', 'validate'],
        stock: ['view', 'create', 'edit', 'inventory', 'reports'],
        analytics: ['view', 'export', 'epidemio'],
        users: ['view'],
        organizations: ['view'],
        projects: ['view', 'edit']
      }
    },
    {
      id: 'gestionnaire',
      name: 'Gestionnaire Stock',
      description: 'Gestion des stocks et inventaires',
      color: 'bg-yellow-100 text-yellow-800',
      userCount: 12,
      isSystem: true,
      permissions: {
        dashboard: ['view'],
        medications: ['view'],
        dispensation: ['view'],
        stock: ['view', 'create', 'edit', 'inventory', 'reports'],
        analytics: ['view', 'export'],
        users: [],
        organizations: ['view'],
        projects: ['view']
      }
    },
    {
      id: 'terrain',
      name: 'Utilisateur Terrain',
      description: 'Dispensation et saisie données terrain',
      color: 'bg-purple-100 text-purple-800',
      userCount: 45,
      isSystem: true,
      permissions: {
        dashboard: ['view'],
        medications: ['view'],
        dispensation: ['view', 'create', 'photo'],
        stock: ['view'],
        analytics: ['view'],
        users: [],
        organizations: ['view'],
        projects: ['view']
      }
    },
    {
      id: 'lecture',
      name: 'Lecture Seule',
      description: 'Consultation uniquement',
      color: 'bg-gray-100 text-gray-800',
      userCount: 23,
      isSystem: true,
      permissions: {
        dashboard: ['view'],
        medications: ['view'],
        dispensation: ['view'],
        stock: ['view'],
        analytics: ['view'],
        users: [],
        organizations: ['view'],
        projects: ['view']
      }
    }
  ];

  const getPermissionLabel = (permission) => {
    const labels = {
      view: 'Consulter',
      create: 'Créer',
      edit: 'Modifier',
      delete: 'Supprimer',
      import: 'Importer',
      export: 'Exporter',
      photo: 'Photos',
      validate: 'Valider',
      inventory: 'Inventaire',
      reports: 'Rapports',
      stats: 'Statistiques',
      advanced: 'Avancé',
      epidemio: 'Épidémiologie',
      roles: 'Rôles',
      config: 'Configuration',
      budget: 'Budget'
    };
    return labels[permission] || permission;
  };

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case 'view': return <Eye className="w-3 h-3" />;
      case 'create': return <Plus className="w-3 h-3" />;
      case 'edit': return <Edit3 className="w-3 h-3" />;
      case 'delete': return <Trash2 className="w-3 h-3" />;
      default: return <Lock className="w-3 h-3" />;
    }
  };

  const currentRole = roles.find(role => role.id === selectedRole);

  const CreateRoleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Créer un nouveau rôle</h3>
          <button onClick={() => setShowCreateModal(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du rôle</label>
              <input
                type="text"
                placeholder="ex: Responsable Pharmacie"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les organisations</option>
                <option value="mdm">Médecins du Monde</option>
                <option value="msf">MSF</option>
                <option value="unicef">UNICEF</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Description du rôle et de ses responsabilités..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions par module</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {modules.map(module => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{module.name}</h5>
                      <p className="text-xs text-gray-500">{module.description}</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.permissions.map(permission => (
                      <label key={permission} className="flex items-center space-x-1 text-xs">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span>{getPermissionLabel(permission)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
            Créer le rôle
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
            <Shield className="w-6 h-6 mr-2" />
            Gestion des Rôles & Permissions
          </h1>
          <p className="text-gray-600 mt-1">Définir les accès par rôle et fonctionnalité</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rôle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des rôles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Rôles disponibles</h3>
            <div className="space-y-2">
              {roles.map(role => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRole === role.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.name}
                        </span>
                        {role.isSystem && (
                          <Lock className="w-3 h-3 text-gray-400" title="Rôle système" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{role.userCount}</div>
                      <div className="text-xs text-gray-500">utilisateurs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Détail des permissions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${currentRole?.color}`}>
                    {currentRole?.name}
                  </span>
                  {currentRole?.isSystem && (
                    <Lock className="w-4 h-4 text-gray-400" title="Rôle système protégé" />
                  )}
                </h3>
                <p className="text-gray-600 mt-1">{currentRole?.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentRole?.userCount} utilisateur(s) avec ce rôle
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  disabled={currentRole?.isSystem}
                  className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Modifier
                </button>
                <button 
                  disabled={currentRole?.isSystem}
                  className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </button>
              </div>
            </div>

            {/* Matrice des permissions */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Permissions par module</h4>
              <div className="space-y-3">
                {modules.map(module => {
                  const modulePermissions = currentRole?.permissions[module.id] || [];
                  return (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{module.name}</h5>
                          <p className="text-sm text-gray-500">{module.description}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {modulePermissions.length} / {module.permissions.length} permissions
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {module.permissions.map(permission => {
                          const hasPermission = modulePermissions.includes(permission);
                          return (
                            <div
                              key={permission}
                              className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
                                hasPermission 
                                  ? 'bg-green-50 text-green-800 border border-green-200' 
                                  : 'bg-gray-50 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {hasPermission ? (
                                <Unlock className="w-3 h-3" />
                              ) : (
                                <Lock className="w-3 h-3" />
                              )}
                              <span>{getPermissionLabel(permission)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t flex justify-between">
              <div className="text-sm text-gray-500">
                {currentRole?.isSystem ? 
                  'Les rôles système ne peuvent pas être modifiés' : 
                  'Vous pouvez modifier les permissions de ce rôle'
                }
              </div>
              <button 
                disabled={currentRole?.isSystem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création */}
      {showCreateModal && <CreateRoleModal />}
    </div>
  );
};

export default RoleManagement;