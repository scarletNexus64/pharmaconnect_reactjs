import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Building2, MapPin, Package, Users, AlertCircle, TrendingUp, Calendar, Euro } from 'lucide-react';

const OrgAdminDashboard = () => {
  const [selectedProject, setSelectedProject] = useState('all');

  // Données fictives pour l'Admin ONG (Médecins du Monde)
  const orgStats = [
    { label: 'Projets Actifs', value: '8', icon: Building2, color: 'bg-blue-500', change: '+1' },
    { label: 'Sites Terrain', value: '25', icon: MapPin, color: 'bg-green-500', change: '+3' },
    { label: 'Stock Total', value: '1.2M€', icon: Euro, color: 'bg-purple-500', change: '+125k€' },
    { label: 'Utilisateurs', value: '45', icon: Users, color: 'bg-orange-500', change: '+8' }
  ];

  const projects = [
    {
      id: 1,
      name: 'Santé Communautaire Bangangté',
      donor: 'GFFO5',
      budget: 45000,
      spent: 32150,
      sites: 1,
      users: 25,
      medicines: 148,
      status: 'active',
      progress: 71
    },
    {
      id: 2,
      name: 'Programme VIH Yaoundé',
      donor: 'PEPFAR',
      budget: 78000,
      spent: 56400,
      sites: 3,
      users: 12,
      medicines: 89,
      status: 'active',
      progress: 72
    },
    {
      id: 3,
      name: 'Nutrition Infantile Nord',
      donor: 'UNICEF',
      budget: 32000,
      spent: 18900,
      sites: 2,
      users: 8,
      medicines: 45,
      status: 'active',
      progress: 59
    }
  ];

  const sitePerformance = [
    { site: 'CS Bangangté', availability: 94, dispensations: 156, alerts: 2, status: 'excellent' },
    { site: 'Hôpital Yaoundé', availability: 89, dispensations: 289, alerts: 5, status: 'good' },
    { site: 'CS Garoua', availability: 76, dispensations: 134, alerts: 8, status: 'warning' },
    { site: 'Clinique Mobile Nord', availability: 82, dispensations: 98, alerts: 3, status: 'good' }
  ];

  const monthlyEvolution = [
    { month: 'Jan', stock: 980000, dispensations: 4200, couts: 28000 },
    { month: 'Fév', stock: 1050000, dispensations: 4650, couts: 31200 },
    { month: 'Mar', stock: 1120000, dispensations: 5100, couts: 34500 },
    { month: 'Avr', stock: 1080000, dispensations: 4890, couts: 32800 },
    { month: 'Mai', stock: 1180000, dispensations: 5340, couts: 36900 },
    { month: 'Juin', stock: 1200000, dispensations: 5580, couts: 38400 }
  ];

  const criticalAlerts = [
    {
      id: 1,
      type: 'Pré-rupture',
      site: 'CS Bangangté',
      medicine: 'Paracétamol 500mg',
      quantity: '12 unités restantes',
      severity: 'warning',
      action: 'Commande urgente'
    },
    {
      id: 2,
      type: 'Rupture',
      site: 'Hôpital Yaoundé',
      medicine: 'Artémether 80mg',
      quantity: '0 unités',
      severity: 'critical',
      action: 'Transfert inter-sites'
    },
    {
      id: 3,
      type: 'Expiration',
      site: 'CS Garoua',
      medicine: 'Amoxicilline Lot#A123',
      quantity: 'Exp: 15/11/2024',
      severity: 'warning',
      action: 'Redistribution'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Médecins du Monde - Coordination</h1>
          <p className="text-gray-600 mt-1">Tableau de bord organisationnel</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les projets</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Nouvelle Commande
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Générer Rapport
          </button>
        </div>
      </div>

      {/* Statistiques Organisation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orgStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} ce mois
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carte Interactive & Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte des projets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Carte des Projets
          </h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Carte OSM avec localisation des sites</p>
              <p className="text-sm text-gray-500 mt-2">Clusters par projet/bailleur</p>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Opérationnel</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Attention</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">Critique</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics opérationnelles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Stocks</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'stock' ? `${(value/1000).toFixed(0)}k€` : 
                  name === 'dispensations' ? value.toLocaleString() : 
                  `${(value/1000).toFixed(0)}k€`,
                  name === 'stock' ? 'Valeur Stock' :
                  name === 'dispensations' ? 'Dispensations' : 'Coûts'
                ]}
              />
              <Area type="monotone" dataKey="stock" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="couts" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projets & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des projets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projets Actifs</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">Bailleur: {project.donor}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Actif
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Sites:</span>
                    <span className="font-medium ml-1">{project.sites}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Utilisateurs:</span>
                    <span className="font-medium ml-1">{project.users}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Médicaments:</span>
                    <span className="font-medium ml-1">{project.medicines}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Budget: {project.budget.toLocaleString()}€</span>
                    <span>Dépensé: {project.spent.toLocaleString()}€</span>
                    <span>Restant: {(project.budget - project.spent).toLocaleString()}€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{project.progress}%</div>
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100">
                    📊 Détails
                  </button>
                  <button className="px-3 py-1 bg-gray-50 text-gray-700 rounded text-sm hover:bg-gray-100">
                    ⚙️ Config
                  </button>
                  <button className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100">
                    📋 Stocks
                  </button>
                  <button className="px-3 py-1 bg-purple-50 text-purple-700 rounded text-sm hover:bg-purple-100">
                    👥 Équipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes critiques */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Alertes Critiques
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs text-gray-600">{alert.site}</p>
                  </div>
                  <span className="text-xs font-medium">
                    {alert.severity === 'critical' ? '🔴' : '🟡'}
                  </span>
                </div>
                <p className="text-sm font-medium">{alert.medicine}</p>
                <p className="text-xs text-gray-600 mb-2">{alert.quantity}</p>
                <button className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-75">
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium">
            Voir toutes les alertes (12)
          </button>
        </div>
      </div>

      {/* Performance des sites */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Sites</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Site</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Disponibilité</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Dispensations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Alertes</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sitePerformance.map((site, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{site.site}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${site.availability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{site.availability}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{site.dispensations}/mois</td>
                  <td className="py-3 px-4 text-gray-600">{site.alerts}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                      {site.status === 'excellent' ? 'Excellent' :
                       site.status === 'good' ? 'Bon' :
                       site.status === 'warning' ? 'Attention' : 'Critique'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">Planifier Mission</p>
          </button>
          <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">Nouvelle Commande</p>
          </button>
          <button className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-purple-700 font-medium">Analytics Avancées</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminDashboard;