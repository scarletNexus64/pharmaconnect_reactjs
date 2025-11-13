import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Bug, Droplets, Baby, Heart, AlertTriangle, TrendingUp, Activity, Shield, CheckCircle, Package } from 'lucide-react';

const PharmacoepiDashboard = () => {
  const [activeTab, setActiveTab] = useState('antibiotics');

  // Données fictives pour la pharmacoépidémiologie
  const antibioticsData = {
    prescriptionRate: 67.3,
    combinationRate: 12.4,
    protocolCompliance: 89.2,
    repeatedPrescriptions: 23,
    weeklyTrend: [
      { week: 'S42', rate: 62.1, compliance: 87.5 },
      { week: 'S43', rate: 65.4, compliance: 88.2 },
      { week: 'S44', rate: 67.8, compliance: 89.1 },
      { week: 'S45', rate: 69.2, compliance: 88.9 },
      { week: 'S46', rate: 67.3, compliance: 89.2 },
    ],
    byType: [
      { name: 'Amoxicilline', prescriptions: 245, percentage: 35, color: '#3B82F6' },
      { name: 'Cotrimoxazole', prescriptions: 156, percentage: 22, color: '#10B981' },
      { name: 'Métronidazole', prescriptions: 134, percentage: 19, color: '#F59E0B' },
      { name: 'Doxycycline', prescriptions: 89, percentage: 13, color: '#8B5CF6' },
      { name: 'Autres', prescriptions: 78, percentage: 11, color: '#EF4444' }
    ]
  };

  const malariaData = {
    epidemicTrend: 234,
    tdrTreatmentRate: 87.6,
    severeCases: 45,
    pregnantWomen: 23,
    childrenUnder5: 67,
    totalCases: 178,
    weeklyData: [
      { week: 'S42', cases: 89, tdr: 45, treated: 42 },
      { week: 'S43', cases: 123, tdr: 67, treated: 59 },
      { week: 'S44', cases: 156, tdr: 89, treated: 78 },
      { week: 'S45', cases: 178, tdr: 95, treated: 83 },
      { week: 'S46', cases: 134, tdr: 78, treated: 68 },
    ],
    alertThreshold: true
  };

  const pediatricData = {
    diarrheaCases: 89,
    orstMetronidazole: 89,
    malnutritionKits: 12,
    diarrheeaTrend: 189,
    weeklyPediatric: [
      { week: 'S42', diarrhea: 34, malnutrition: 8, respiratory: 56 },
      { week: 'S43', diarrhea: 45, malnutrition: 12, respiratory: 67 },
      { week: 'S44', diarrhea: 67, malnutrition: 15, respiratory: 78 },
      { week: 'S45', diarrhea: 89, malnutrition: 12, respiratory: 89 },
      { week: 'S46', diarrhea: 78, malnutrition: 10, respiratory: 76 },
    ]
  };

  const pregnantWomenData = {
    cpnCompliance: 86.5,
    oxytocinDispensed: 28,
    deliveryKits: 28,
    totalDeliveries: 32,
    weeklyData: [
      { week: 'S42', cpn: 12, deliveries: 8, oxytocin: 6 },
      { week: 'S43', cpn: 15, deliveries: 12, oxytocin: 10 },
      { week: 'S44', cpn: 18, deliveries: 15, oxytocin: 12 },
      { week: 'S45', cpn: 22, deliveries: 18, oxytocin: 15 },
      { week: 'S46', cpn: 20, deliveries: 16, oxytocin: 14 },
    ]
  };

  const getAlertColor = (value, threshold, type = 'above') => {
    if (type === 'above') {
      return value > threshold ? 'text-red-600' : 'text-green-600';
    } else {
      return value < threshold ? 'text-red-600' : 'text-green-600';
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, alert = false }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 ${alert ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${alert ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
          <p className={`text-sm mt-1 ${alert ? 'text-red-600' : 'text-gray-600'}`}>{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {alert && (
        <div className="mt-3 flex items-center text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 mr-1" />
          <span>Alerte active</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacoépidémiologie</h1>
          <p className="text-gray-600 mt-1">Surveillance des tendances et résistances thérapeutiques</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Dernières 4 semaines</option>
            <option>Dernier trimestre</option>
            <option>Dernière année</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Générer Rapport
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'antibiotics', label: 'Antibiotiques', icon: Bug },
              { id: 'malaria', label: 'Paludisme', icon: Droplets },
              { id: 'pediatric', label: 'Pédiatrie', icon: Baby },
              { id: 'pregnancy', label: 'Femmes Enceintes', icon: Heart }
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
          {/* Surveillance Antibiotiques */}
          {activeTab === 'antibiotics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Taux prescription ATB"
                  value={`${antibioticsData.prescriptionRate}%`}
                  subtitle="⚠️ >50% - Alerte OMS"
                  icon={Bug}
                  color="bg-red-500"
                  alert={antibioticsData.prescriptionRate > 50}
                />
                <StatCard
                  title="Multithérapie ATB"
                  value={`${antibioticsData.combinationRate}%`}
                  subtitle="des prescriptions ATB"
                  icon={Shield}
                  color="bg-orange-500"
                />
                <StatCard
                  title="Conformité protocoles"
                  value={`${antibioticsData.protocolCompliance}%`}
                  subtitle="🟢 Objectif >85%"
                  icon={CheckCircle}
                  color="bg-green-500"
                />
                <StatCard
                  title="Prescriptions répétées"
                  value={antibioticsData.repeatedPrescriptions}
                  subtitle="patients détectés"
                  icon={Activity}
                  color="bg-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Temporelle</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={antibioticsData.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} name="Taux prescription %" />
                      <Line type="monotone" dataKey="compliance" stroke="#10B981" strokeWidth={2} name="Conformité %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={antibioticsData.byType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="prescriptions"
                      >
                        {antibioticsData.byType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} prescriptions`, 'Total']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {antibioticsData.byType.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm text-gray-600">{entry.name}: {entry.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alertes Antibiorésistance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">🚨 Surprescription détectée</h4>
                    <p className="text-sm text-gray-600">Taux de prescription ATB (67.3%) dépasse le seuil OMS de 50%</p>
                    <button className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium">
                      → Plan d'action requis
                    </button>
                  </div>
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">⚠️ Patients récidivistes</h4>
                    <p className="text-sm text-gray-600">23 patients avec prescriptions ATB répétées ce mois</p>
                    <button className="mt-2 text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                      → Voir la liste
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Surveillance Paludisme */}
          {activeTab === 'malaria' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                  title="Tendance épidémique"
                  value={`+${malariaData.epidemicTrend}%`}
                  subtitle="vs moyenne 3 ans"
                  icon={TrendingUp}
                  color="bg-red-500"
                  alert={true}
                />
                <StatCard
                  title="TDR+/Traitement"
                  value={`${malariaData.tdrTreatmentRate}%`}
                  subtitle={`${malariaData.totalCases} cas traités`}
                  icon={Activity}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Artésunate prescrit"
                  value={malariaData.severeCase}
                  subtitle="cas de palu grave"
                  icon={Droplets}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Femmes enceintes"
                  value={malariaData.pregnantWomen}
                  subtitle="cas détectés"
                  icon={Heart}
                  color="bg-pink-500"
                />
                <StatCard
                  title="Enfants <5ans"
                  value={malariaData.childrenUnder5}
                  subtitle="42% des cas totaux"
                  icon={Baby}
                  color="bg-green-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Hebdomadaire</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={malariaData.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cases" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Cas totaux" />
                      <Area type="monotone" dataKey="tdr" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="TDR positifs" />
                      <Area type="monotone" dataKey="treated" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Traités" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs Clés</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Taux de couverture TDR</span>
                      <span className="font-bold">{((malariaData.totalCases / 200) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Délai diagnostic moyen</span>
                      <span className="font-bold">2.3 heures</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Conformité protocole</span>
                      <span className="font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Létalité</span>
                      <span className="font-bold text-red-600">0.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  🚨 ALERTE: Dépassement seuil épidémique semaine 43
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">📈 Hausse significative</h4>
                    <p className="text-sm text-gray-600">+234% vs moyenne 3 ans | 67 cas cette semaine</p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">💊 Stock Artémether</h4>
                    <p className="text-sm text-gray-600">🔴 Insuffisant (3 sites en rupture)</p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">🎯 Actions requises</h4>
                    <p className="text-sm text-gray-600">Commande urgente, renfort équipes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Surveillance Pédiatrique */}
          {activeTab === 'pediatric' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="SRO + Métronidazole"
                  value={pediatricData.orstMetronidazole}
                  subtitle="prescriptions"
                  icon={Baby}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Pic diarrhées"
                  value={`+${pediatricData.diarrheeaTrend}%`}
                  subtitle="vs moyenne (⚠️ Alerte)"
                  icon={AlertTriangle}
                  color="bg-red-500"
                  alert={true}
                />
                <StatCard
                  title="Kits malnutrition"
                  value={pediatricData.malnutritionKits}
                  subtitle="thérapeutiques dispensés"
                  icon={Heart}
                  color="bg-green-500"
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances Pédiatriques</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={pediatricData.weeklyPediatric}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="diarrhea" fill="#3B82F6" name="Diarrhées" />
                    <Bar dataKey="respiratory" fill="#10B981" name="Respiratoires" />
                    <Bar dataKey="malnutrition" fill="#F59E0B" name="Malnutrition" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Surveillance Diarrhées Infantiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">💧 Pic épidémique détecté</h4>
                    <p className="text-sm text-gray-600">+189% vs moyenne hebdomadaire</p>
                    <p className="text-sm text-gray-600 mt-1">Possible contamination source eau</p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">📊 Actions recommandées</h4>
                    <p className="text-sm text-gray-600">• Renforcer stock SRO</p>
                    <p className="text-sm text-gray-600">• Investigation épidémiologique</p>
                    <p className="text-sm text-gray-600">• Sensibilisation hygiène</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Surveillance Femmes Enceintes */}
          {activeTab === 'pregnancy' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="CPN conforme"
                  value={`${pregnantWomenData.cpnCompliance}%`}
                  subtitle="45/52 consultations"
                  icon={Heart}
                  color="bg-pink-500"
                />
                <StatCard
                  title="Ocytocine dispensée"
                  value={pregnantWomenData.oxytocinDispensed}
                  subtitle="accouchements"
                  icon={Activity}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Kits accouchement"
                  value={pregnantWomenData.deliveryKits}
                  subtitle="distribués"
                  icon={Package}
                  color="bg-green-500"
                />
                <StatCard
                  title="Taux couverture"
                  value={`${((pregnantWomenData.deliveryKits / pregnantWomenData.totalDeliveries) * 100).toFixed(1)}%`}
                  subtitle="kits vs accouchements"
                  icon={Shield}
                  color="bg-blue-500"
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suivi Maternité</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={pregnantWomenData.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpn" stroke="#EC4899" strokeWidth={2} name="CPN" />
                    <Line type="monotone" dataKey="deliveries" stroke="#8B5CF6" strokeWidth={2} name="Accouchements" />
                    <Line type="monotone" dataKey="oxytocin" stroke="#10B981" strokeWidth={2} name="Ocytocine" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Indicateurs Positifs</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Taux CPN conforme: 86.5% (objectif: >80%)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Disponibilité ocytocine: 100%
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Kits accouchement: Stock suffisant
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Points d'amélioration</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                      Augmenter sensibilisation CPN précoce
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                      Améliorer suivi post-partum
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                      Renforcer formation accoucheuses
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacoepiDashboard;