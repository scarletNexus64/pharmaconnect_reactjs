import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Activity, AlertCircle, CheckCircle, Camera, FileText, Plus } from 'lucide-react';

const ProjectDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Données fictives pour le Gestionnaire de Projet (Bangangté)
  const projectStats = [
    { label: 'Médicaments', value: '15', icon: Package, color: 'bg-blue-500', change: '+2' },
    { label: 'Dispensations', value: '892', icon: Activity, color: 'bg-green-500', change: '+67' },
    { label: 'Alertes', value: '5', icon: AlertCircle, color: 'bg-red-500', change: '-2' },
    { label: 'Disponibilité', value: '98%', icon: CheckCircle, color: 'bg-purple-500', change: '+3%' }
  ];

  const weeklyData = [
    { week: 'S42', dispensations: 145, prescriptions: 156, stock: 94 },
    { week: 'S43', dispensations: 189, prescriptions: 201, stock: 91 },
    { week: 'S44', dispensations: 167, prescriptions: 178, stock: 89 },
    { week: 'S45', dispensations: 201, prescriptions: 215, stock: 87 },
    { week: 'S46', dispensations: 234, prescriptions: 245, stock: 85 },
    { week: 'S47', dispensations: 189, prescriptions: 198, stock: 88 },
    { week: 'S48', dispensations: 212, prescriptions: 225, stock: 86 }
  ];

  const standardList = [
    {
      id: 1,
      name: 'Amoxicilline 500mg',
      code: 'AMX-500',
      stock: 85,
      cmm: 67,
      status: 'ok',
      expiry: '6 mois',
      lastDispensation: '2h ago'
    },
    {
      id: 2,
      name: 'Paracétamol 500mg',
      code: 'PAR-500',
      stock: 12,
      cmm: 89,
      status: 'pre-rupture',
      expiry: '8 mois',
      lastDispensation: '30min ago'
    },
    {
      id: 3,
      name: 'Artémether 80mg/ml',
      code: 'ART-80',
      stock: 0,
      cmm: 15,
      status: 'rupture',
      expiry: '-',
      lastDispensation: '3 jours ago'
    },
    {
      id: 4,
      name: 'SRO Sachets',
      code: 'SRO-001',
      stock: 156,
      cmm: 45,
      status: 'ok',
      expiry: '12 mois',
      lastDispensation: '1h ago'
    },
    {
      id: 5,
      name: 'Cotrimoxazole 480mg',
      code: 'COT-480',
      stock: 23,
      cmm: 34,
      status: 'pre-rupture',
      expiry: '4 mois',
      lastDispensation: '45min ago'
    }
  ];

  const recentDispensations = [
    {
      id: 1,
      patient: 'Marie Ngono',
      age: 34,
      gender: 'F',
      prescriber: 'Dr. Mballa',
      medicines: ['Amoxicilline 500mg x12', 'Paracétamol 500mg x20'],
      total: '33.00€',
      time: '14:32',
      status: 'complete'
    },
    {
      id: 2,
      patient: 'Paul Etoa',
      age: 28,
      gender: 'M',
      prescriber: 'Dr. Fouda',
      medicines: ['Artémether 80mg x5'],
      total: '76.00€',
      time: '11:15',
      status: 'partial'
    },
    {
      id: 3,
      patient: 'Fatou Salam',
      age: 2,
      gender: 'F',
      prescriber: 'Inf. Kala',
      medicines: ['SRO x6', 'Paracétamol sirop x1'],
      total: '12.50€',
      time: '09:45',
      status: 'complete'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-100';
      case 'pre-rupture': return 'text-yellow-600 bg-yellow-100';
      case 'rupture': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return '✅';
      case 'pre-rupture': return '⚠️';
      case 'rupture': return '❌';
      default: return '⚪';
    }
  };

  const getDispensationStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projet Santé Communautaire - Bangangté</h1>
          <p className="text-gray-600 mt-1">MDM/GFFO5 - CS Bangangté</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Actif
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Nouvelle Dispensation
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Inventaire
          </button>
        </div>
      </div>

      {/* Statistiques Projet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projectStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} cette semaine
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

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
              { id: 'stock', label: 'Gestion Stock', icon: Package },
              { id: 'dispensations', label: 'Dispensations', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Suivi hebdomadaire */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suivi Hebdomadaire</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="dispensations" stroke="#3B82F6" strokeWidth={2} name="Dispensations" />
                    <Line type="monotone" dataKey="prescriptions" stroke="#10B981" strokeWidth={2} name="Prescriptions" />
                    <Line type="monotone" dataKey="stock" stroke="#8B5CF6" strokeWidth={2} name="Taux de stock %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Actions terrain */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Terrain</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex flex-col items-center">
                    <Camera className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-blue-700 font-medium">Nouvelle dispensation</span>
                  </button>
                  <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition flex flex-col items-center">
                    <Package className="w-8 h-8 text-green-500 mb-2" />
                    <span className="text-green-700 font-medium">Inventaire</span>
                  </button>
                  <button className="p-4 border-2 border-dashed border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition flex flex-col items-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-red-700 font-medium">Demande urgente</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Gestion Stock */}
          {activeTab === 'stock' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Liste Standard Active</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter Médicament
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Médicament</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">CMM</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Expiration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Dernière dispensation</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standardList.map((med) => (
                      <tr key={med.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(med.status)}`}>
                            {getStatusIcon(med.status)} {
                              med.status === 'ok' ? 'OK' :
                              med.status === 'pre-rupture' ? 'Pré-rupture' :
                              'Rupture'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{med.name}</div>
                            <div className="text-sm text-gray-600">{med.code}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{med.stock} unités</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{med.cmm}</td>
                        <td className="py-3 px-4 text-gray-600">{med.expiry}</td>
                        <td className="py-3 px-4 text-gray-600">{med.lastDispensation}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Détail</button>
                            {med.status === 'rupture' && (
                              <button className="text-red-600 hover:text-red-800 text-sm">Commande</button>
                            )}
                            {med.status === 'pre-rupture' && (
                              <button className="text-yellow-600 hover:text-yellow-800 text-sm">Alerte</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dispensations */}
          {activeTab === 'dispensations' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dispensations Récentes</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Nouvelle Dispensation
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Historique
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentDispensations.map((dispensation) => (
                  <div key={dispensation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {dispensation.patient} ({dispensation.age} ans, {dispensation.gender})
                          </h4>
                          <p className="text-sm text-gray-600">Prescripteur: {dispensation.prescriber}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDispensationStatusColor(dispensation.status)}`}>
                          {dispensation.status === 'complete' ? '✅ Complète' : '⚠️ Partielle'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{dispensation.total}</p>
                        <p className="text-sm text-gray-600">{dispensation.time}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded p-3 mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Médicaments dispensés:</p>
                      <ul className="text-sm text-gray-600">
                        {dispensation.medicines.map((med, index) => (
                          <li key={index}>• {med}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100">
                        👁️ Détails
                      </button>
                      <button className="px-3 py-1 bg-gray-50 text-gray-700 rounded text-sm hover:bg-gray-100">
                        📄 PDF
                      </button>
                      {dispensation.status === 'partial' && (
                        <button className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded text-sm hover:bg-yellow-100">
                          🔄 Compléter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;