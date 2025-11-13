import React, { useState, useEffect } from 'react';
import { 
  Activity, Package, AlertTriangle, Users, TrendingUp, 
  Calendar, MapPin, Bell, Settings, LogOut, Home,
  ShoppingCart, FileText, BarChart3, Map, Upload,
  Camera, CheckCircle, XCircle, Clock, Shield
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DemoDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Récupérer les infos de démo depuis localStorage
  const username = localStorage.getItem('username') || 'Coordinateur';
  const organization = localStorage.getItem('organization') || 'Médecins du Monde';
  const project = localStorage.getItem('project') || 'Santé Communautaire Bangangté';
  const site = localStorage.getItem('site') || 'CS Bangangté';
  const isDemoMode = localStorage.getItem('isDemoMode') === 'true';

  // Données fictives pour la démo
  const stats = {
    medications: 148,
    activeStock: 95,
    dispensations: 892,
    alerts: 5,
    ruptures: 3,
    preRuptures: 7,
    patientsTreated: 1245,
    coverage: 87.5
  };

  const recentDispensations = [
    { id: 1, patient: 'Marie Ngono', age: 35, medication: 'Amoxicilline 500mg', quantity: 12, date: '28/10/24', status: 'complete' },
    { id: 2, patient: 'Paul Etoa', age: 8, medication: 'Paracétamol sirop', quantity: 2, date: '28/10/24', status: 'complete' },
    { id: 3, patient: 'Jeanne Mballa', age: 28, medication: 'Artémether 80mg', quantity: 6, date: '27/10/24', status: 'partial' },
    { id: 4, patient: 'Joseph Fouda', age: 45, medication: 'Cotrimoxazole', quantity: 30, date: '27/10/24', status: 'complete' },
    { id: 5, patient: 'Alice Nkomo', age: 22, medication: 'Fer + Acide folique', quantity: 60, date: '27/10/24', status: 'complete' }
  ];

  const criticalAlerts = [
    { id: 1, type: 'rupture', message: 'Rupture Artémether 80mg/ml', severity: 'critical', time: '2h' },
    { id: 2, type: 'expiration', message: 'Expiration proche Amoxicilline Lot#A123', severity: 'warning', time: '1j' },
    { id: 3, type: 'prerupture', message: 'Pré-rupture Paracétamol 500mg', severity: 'medium', time: '3j' },
    { id: 4, type: 'epidemie', message: 'Pic paludisme détecté (+234% vs moyenne)', severity: 'critical', time: '5h' },
    { id: 5, type: 'stock', message: 'Livraison MDM/GFFO5 en cours', severity: 'info', time: '6h' }
  ];

  const stockStatus = [
    { name: 'Amoxicilline 500mg', stock: 145, cmm: 67, status: 'ok', expiration: '6 mois' },
    { name: 'Paracétamol 500mg', stock: 45, cmm: 67, status: 'prerupture', expiration: '8 mois' },
    { name: 'Artémether 80mg/ml', stock: 0, cmm: 12, status: 'rupture', expiration: '-' },
    { name: 'ORS Sachets', stock: 234, cmm: 89, status: 'ok', expiration: '12 mois' },
    { name: 'Cotrimoxazole 960mg', stock: 67, cmm: 45, status: 'ok', expiration: '10 mois' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'rupture': return 'bg-red-500';
      case 'prerupture': return 'bg-yellow-500';
      case 'ok': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">PharmaConnect</h2>
              <p className="text-xs text-gray-500">{organization}</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Vue d'ensemble</span>
            </button>

            <button
              onClick={() => setActiveTab('dispensation')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dispensation' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Dispensation</span>
              {isDemoMode && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('stock')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'stock' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Gestion Stock</span>
              {stats.alerts > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{stats.alerts}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Rapports</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'map' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Map className="w-5 h-5" />
              <span>Cartographie</span>
            </button>

            {/* Administration - pour Super Admin uniquement */}
            {(username === 'Super Admin' || localStorage.getItem('userRole') === 'Super Admin') && (
              <button
                onClick={() => window.location.href = '/admin'}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Administration</span>
              </button>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Tableau de bord'}
                {activeTab === 'dispensation' && 'Dispensation'}
                {activeTab === 'stock' && 'Gestion des Stocks'}
                {activeTab === 'reports' && 'Rapports'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'map' && 'Cartographie'}
                {activeTab === 'settings' && 'Paramètres'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {project} - {site}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900"
                >
                  <Bell className="w-5 h-5" />
                  {criticalAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {criticalAlerts.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {criticalAlerts.map(alert => (
                        <div key={alert.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${getSeverityColor(alert.severity)}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">Il y a {alert.time}</p>
                            </div>
                            <AlertTriangle className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{username}</p>
                  <p className="text-xs text-gray-600">Coordinateur Terrain</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">CD</span>
                </div>
              </div>

              {/* Demo Badge */}
              {isDemoMode && (
                <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Mode Démo
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Médicaments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.medications}</p>
                      <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Dispensations</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.dispensations}</p>
                      <p className="text-xs text-green-600 mt-1">Cette semaine</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Alertes Actives</p>
                      <p className="text-2xl font-bold text-red-600">{stats.alerts}</p>
                      <p className="text-xs text-red-600 mt-1">{stats.ruptures} ruptures</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </Card>

                <Card className="bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Couverture</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.coverage}%</p>
                      <p className="text-xs text-blue-600 mt-1">Population couverte</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Dispensations */}
              <Card className="bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Dispensations Récentes</h2>
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Patient</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Âge</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Médicament</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quantité</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDispensations.map(disp => (
                        <tr key={disp.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{disp.patient}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{disp.age} ans</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{disp.medication}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{disp.quantity}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{disp.date}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              disp.status === 'complete' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {disp.status === 'complete' ? 'Complète' : 'Partielle'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Stock Status */}
              <Card className="bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">État des Stocks</h2>
                  <div className="flex space-x-2">
                    <span className="flex items-center text-xs">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> OK
                    </span>
                    <span className="flex items-center text-xs">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Pré-rupture
                    </span>
                    <span className="flex items-center text-xs">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> Rupture
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {stockStatus.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">CMM: {item.cmm} | Exp: {item.expiration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{item.stock}</p>
                        <p className="text-xs text-gray-600">unités</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'dispensation' && (
            <div className="space-y-6">
              <Card className="bg-white">
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Nouvelle Dispensation</h2>
                  <p className="text-gray-600 mb-6">La photo de l'ordonnance est obligatoire pour continuer</p>
                  <Button variant="primary" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Commencer une dispensation
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Nouvelle entrée
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Inventaire
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Commande
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-4">Alertes Stock</h3>
                  <div className="space-y-2">
                    {criticalAlerts.filter(a => a.type === 'rupture' || a.type === 'prerupture' || a.type === 'expiration').map(alert => (
                      <div key={alert.id} className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{alert.message}</span>
                          <span className="text-xs">{alert.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Card className="bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pharmacoépidémiologie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Surveillance Antibiotiques</h3>
                    <p className="text-2xl font-bold text-red-600">67.3%</p>
                    <p className="text-sm text-red-700">Taux prescription ATB</p>
                    <p className="text-xs text-red-600 mt-1">⚠️ Alerte OMS (&gt;50%)</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">Surveillance Paludisme</h3>
                    <p className="text-2xl font-bold text-orange-600">+234%</p>
                    <p className="text-sm text-orange-700">vs moyenne 3 ans</p>
                    <p className="text-xs text-orange-600 mt-1">Pic épidémique détecté</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              <Card className="bg-white h-96">
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Carte interactive OpenStreetMap</p>
                    <p className="text-sm text-gray-500 mt-1">Module cartographique en mode démo</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card className="bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Rapports Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer">
                    <FileText className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Rapport Mensuel</h3>
                    <p className="text-sm text-gray-600">Octobre 2024</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer">
                    <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Analytics Pharmacoépidémio</h3>
                    <p className="text-sm text-gray-600">Semaine 43</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Français</option>
                      <option>English</option>
                      <option>العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" checked className="mr-2" />
                        <span className="text-sm text-gray-700">Alertes ruptures</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked className="mr-2" />
                        <span className="text-sm text-gray-700">Alertes épidémiques</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DemoDashboard;