import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Globe, Users, Building, Package, AlertTriangle, TrendingUp, MapPin, Activity, Plus } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Données fictives pour le Super Admin Dashboard
  const globalStats = [
    { label: 'ONG Actives', value: '25', icon: Building, color: 'bg-blue-500', change: '+3' },
    { label: 'Projets', value: '156', icon: Globe, color: 'bg-green-500', change: '+12' },
    { label: 'Médicaments', value: '50k', icon: Package, color: 'bg-purple-500', change: '+2.1k' },
    { label: 'Utilisateurs', value: '2.5k', icon: Users, color: 'bg-orange-500', change: '+234' }
  ];

  const dispensationData = [
    { region: 'Afrique de l\'Ouest', value: 15420, color: '#8884d8' },
    { region: 'Afrique Centrale', value: 12890, color: '#82ca9d' },
    { region: 'Afrique de l\'Est', value: 18760, color: '#ffc658' },
    { region: 'Afrique Australe', value: 9340, color: '#ff7c7c' }
  ];

  const monthlyTrends = [
    { month: 'Jan', dispensations: 24000, alerts: 45, organizations: 22 },
    { month: 'Fév', dispensations: 26500, alerts: 38, organizations: 23 },
    { month: 'Mar', dispensations: 28900, alerts: 52, organizations: 24 },
    { month: 'Avr', dispensations: 31200, alerts: 41, organizations: 24 },
    { month: 'Mai', dispensations: 29800, alerts: 47, organizations: 25 },
    { month: 'Juin', dispensations: 33400, alerts: 35, organizations: 25 }
  ];

  const criticalAlerts = [
    {
      id: 1,
      type: 'Rupture Stock',
      location: 'Cameroun - 3 sites',
      medicine: 'Artémether',
      severity: 'critical',
      time: '2h ago'
    },
    {
      id: 2,
      type: 'Expiration',
      location: 'RDC - CS Kinshasa',
      medicine: 'Lots Amoxicilline',
      severity: 'warning',
      time: '4h ago'
    },
    {
      id: 3,
      type: 'Surconsommation',
      location: 'Tchad - Région Sud',
      medicine: 'Antibiotiques',
      severity: 'warning',
      time: '6h ago'
    }
  ];

  const organizationPerformance = [
    { name: 'Médecins du Monde', projects: 8, sites: 25, performance: 94, trend: 'up' },
    { name: 'MSF', projects: 12, sites: 45, performance: 91, trend: 'up' },
    { name: 'UNICEF', projects: 6, sites: 18, performance: 88, trend: 'stable' },
    { name: 'Programme VIH Cameroun', projects: 3, sites: 12, performance: 85, trend: 'down' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble globale du système PharmaConnect</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les régions</option>
            <option value="west">Afrique de l'Ouest</option>
            <option value="central">Afrique Centrale</option>
            <option value="east">Afrique de l'Est</option>
            <option value="south">Afrique Australe</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Exporter Rapport
          </button>
        </div>
      </div>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => {
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

      {/* Carte Mondiale & Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte de répartition */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Répartition Géographique
          </h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Carte interactive OpenStreetMap</p>
              <p className="text-sm text-gray-500 mt-2">Visualisation des organisations par région</p>
            </div>
          </div>
        </div>

        {/* Dispensations par région */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispensations par Région</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={dispensationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {dispensationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toLocaleString()} dispensations`, 'Total']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dispensationData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendances & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendances temporelles */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Temporelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dispensations" stroke="#3B82F6" strokeWidth={2} name="Dispensations" />
              <Line type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} name="Alertes" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alertes critiques */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Alertes Critiques
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs mt-1">{alert.location}</p>
                    <p className="text-xs text-gray-600">{alert.medicine}</p>
                  </div>
                  <span className="text-xs">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium">
            Voir toutes les alertes (15)
          </button>
        </div>
      </div>

      {/* Performance des organisations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance des Organisations</h3>
          <button className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm">
            Gérer Organisations
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Organisation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Projets</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sites</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tendance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizationPerformance.map((org, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{org.name}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{org.projects}</td>
                  <td className="py-3 px-4 text-gray-600">{org.sites}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${org.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{org.performance}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getTrendIcon(org.trend)}
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

      {/* Widgets Administration Rapide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Utilisateurs Connectés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            Utilisateurs Connectés
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Actifs maintenant</p>
                <p className="text-sm text-green-600">En ligne</p>
              </div>
              <span className="text-2xl font-bold text-green-700">47</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dernières 24h</span>
                <span className="font-medium">156 utilisateurs</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sessions moyennes</span>
                <span className="font-medium">2h 15min</span>
              </div>
            </div>
            <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Gérer Utilisateurs
            </button>
          </div>
        </div>

        {/* Alertes Système */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Alertes Système
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-800">Accès non autorisé</p>
              <p className="text-xs text-red-600">3 tentatives detectées - 2h ago</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Maintenance serveur</p>
              <p className="text-xs text-yellow-600">Prévue demain 2h-4h - Plannifiée</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Backup automatique</p>
              <p className="text-xs text-blue-600">Réussi ce matin - 03:00</p>
            </div>
            <button className="w-full mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
              Voir Toutes Alertes
            </button>
          </div>
        </div>

        {/* Actions Rapides Admin */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-500" />
            Actions Rapides
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center">
              <Plus className="w-4 h-4 mr-3 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Nouvelle Organisation</p>
                <p className="text-xs text-gray-600">Ajouter ONG/Programme</p>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center">
              <Users className="w-4 h-4 mr-3 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Inviter Utilisateur</p>
                <p className="text-xs text-gray-600">Envoyer invitation</p>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center">
              <Package className="w-4 h-4 mr-3 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Import Données</p>
                <p className="text-xs text-gray-600">Excel/CSV</p>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center">
              <TrendingUp className="w-4 h-4 mr-3 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Rapport Global</p>
                <p className="text-xs text-gray-600">Générer PDF</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;