import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  MapIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  UserGroupIcon,
  CpuChipIcon,
  SunIcon,
  DocumentCheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  ChevronRightIcon,
  SparklesIcon 
} from '@heroicons/react/24/solid';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const LandingPage = ({ onLogin }) => {
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [activeChallenge, setActiveChallenge] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveChallenge((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '60%', label: 'Réduction des pertes', color: 'text-emerald-600' },
    { number: '80%', label: 'Disponibilité améliorée', color: 'text-blue-600' },
    { number: '100%', label: 'Autonomie énergétique', color: 'text-amber-600' },
    { number: '24/7', label: 'Support continu', color: 'text-purple-600' }
  ];

  const challenges = [
    {
      icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      title: "Protocoles médicaux anarchiques",
      issues: [
        "Posologies dangereuses pour les patients",
        "Mauvais suivi des femmes enceintes",
        "Méconnaissance des standards de soins"
      ]
    },
    {
      icon: <BeakerIcon className="w-6 h-6" />,
      title: "Gestion catastrophique des stocks",
      issues: [
        "Ruptures fréquentes en pics épidémiques",
        "Péremptions massives et pertes financières",
        "Produits dormants dans les centres"
      ]
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Absence de données fiables",
      issues: [
        "Aucune visibilité sur les consommations",
        "Commandes sur/sous-évaluées",
        "Décisions non éclairées"
      ]
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Résistance aux antibiotiques",
      issues: [
        "Prescriptions abusives d'antimicrobiens",
        "Émergence de résistances thérapeutiques",
        "Menace pour la santé publique"
      ]
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Personnel non qualifié",
      issues: [
        "Méconnaissance des bonnes pratiques",
        "Erreurs de dispensation fréquentes",
        "Formation inadéquate"
      ]
    }
  ];

  const features = [
    {
      icon: <DocumentCheckIcon className="w-8 h-8" />,
      title: 'Protocoles Standardisés',
      description: 'Base de données conforme OMS avec adaptation automatique aux protocoles nationaux',
      color: 'from-emerald-500 to-teal-600',
      highlight: true
    },
    {
      icon: <CpuChipIcon className="w-8 h-8" />,
      title: 'IA Intégrée',
      description: 'Quantification intelligente et prévision automatique des besoins exceptionnels',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <ExclamationTriangleIcon className="w-8 h-8" />,
      title: 'Alertes Proactives',
      description: 'Prévention des ruptures et détection des surconsommations anormales',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: <MapIcon className="w-8 h-8" />,
      title: 'Surveillance Épidémio',
      description: 'Monitoring en temps réel des maladies sous surveillance',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <BeakerIcon className="w-8 h-8" />,
      title: 'Dispensation Sécurisée',
      description: 'Détection des interactions médicamenteuses et conseils d\'observance',
      color: 'from-rose-500 to-red-600'
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: 'Formation Continue',
      description: 'Modules interactifs et guides de bonnes pratiques intégrés',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <SunIcon className="w-8 h-8" />,
      title: 'Autonomie Solaire',
      description: 'Double batterie rechargeable à l\'énergie solaire pour zones isolées',
      color: 'from-yellow-500 to-amber-600',
      highlight: true
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'Analytics Avancées',
      description: 'Tableaux de bord centralisés multi-sites et rapports détaillés',
      color: 'from-teal-500 to-emerald-600'
    }
  ];

  const solutions = [
    {
      step: '01',
      title: 'Tablettes Robustes',
      description: 'Conçues pour environnements difficiles avec recharge solaire autonome'
    },
    {
      step: '02',
      title: 'Application Intelligente',
      description: 'Interface intuitive avec IA pour personnel non spécialisé'
    },
    {
      step: '03',
      title: 'Dashboard Centralisé',
      description: 'Supervision temps réel multi-districts et multi-projets'
    },
    {
      step: '04',
      title: 'Formation & Support',
      description: 'Déploiement en 48h avec formation complète incluse'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-x-hidden">
      
      {/* Header amélioré */}
      <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
              <span className="hidden lg:inline-flex items-center px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-xs font-medium">
                <SparklesIcon className="w-3 h-3 mr-1" />
                Solution Humanitaire
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#challenges" className="text-gray-600 hover:text-emerald-600 transition-all hover:scale-105">
                  Défis
                </a>
                <a href="#solution" className="text-gray-600 hover:text-emerald-600 transition-all hover:scale-105">
                  Solution
                </a>
                <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-all hover:scale-105">
                  Fonctionnalités
                </a>
                <a href="#impact" className="text-gray-600 hover:text-emerald-600 transition-all hover:scale-105">
                  Impact
                </a>
              </nav>
              {/* <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                Voir Démo
              </Button> */}
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onLogin && onLogin()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-105 hover:shadow-lg"
              >
                Accès Plateforme
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section redesignée */}
      <section className="relative py-10 lg:py-15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-blue-100/20"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div id="hero-content" className={`space-y-8 animate-on-scroll transition-all duration-1000 ${isVisible['hero-content'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 rounded-full text-sm font-medium animate-pulse">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  Urgence Sanitaire en Zones Rurales
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  L'Accès aux
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Médicaments Essentiels
                  </span>
                  <span className="text-2xl lg:text-4xl block mt-2 text-gray-700">
                    dans les zones les plus reculées
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">PharmaConnect</strong> révolutionne la gestion pharmaceutique 
                  pour les projets humanitaires : VIH/Sida, Tuberculose, Paludisme et Malnutrition.
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-amber-900 font-medium">
                    Solution adaptée aux défis des interventions d'urgence et programmes de santé publique
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={<ArrowRightIcon className="w-5 h-5" />} 
                  onClick={() => onLogin && onLogin()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                >
                  Démarrer Maintenant
                </Button>
                {/* <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  Demander une Démo
                </Button> */}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center transition-all duration-500 hover:scale-110 cursor-pointer ${
                      currentStat === index ? 'scale-110' : 'scale-100'
                    }`}
                    onMouseEnter={() => setCurrentStat(index)}
                  >
                    <div className={`text-3xl lg:text-4xl font-bold ${stat.color} animate-pulse`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animation complexe droite */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-3xl animate-pulse"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-80 h-48 bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-700">Gestion des Stocks</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">En ligne</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Paracétamol 500mg</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Amoxicilline 250mg</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{width: '30%'}}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Artémether</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl animate-float flex items-center justify-center text-white shadow-xl">
                      <SunIcon className="w-16 h-16" />
                    </div>

                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl animate-float-delay flex items-center justify-center text-white shadow-xl">
                      <BeakerIcon className="w-12 h-12" />
                    </div>

                    <div className="absolute top-20 -right-16 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium animate-bounce">
                      Alerte: Rupture Stock
                    </div>
                  </div>
                </div>

                <div className="absolute top-10 right-10 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-20 left-10 w-2 h-2 bg-teal-400 rounded-full animate-ping animation-delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Défis avec animation */}
      <section id="challenges" className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Les Défis Critiques
              <span className="block text-xl lg:text-2xl text-red-600 mt-2">
                qui mettent en péril vos programmes humanitaires
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {challenges.map((challenge, index) => (
              <Card 
                key={index}
                className={`group hover:scale-105 transition-all duration-500 border-2 ${
                  activeChallenge === index ? 'border-red-500 shadow-2xl scale-105' : 'border-transparent'
                }`}
                padding="lg"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform ${
                    activeChallenge === index ? 'animate-pulse' : ''
                  }`}>
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {challenge.title}
                    </h3>
                    <ul className="space-y-2">
                      {challenge.issues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <ChevronRightIcon className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-medium animate-pulse">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Ces défis entraînent des pertes financières exacerbées et compromettent la santé publique
            </div>
          </div>
        </div>
      </section>

      {/* Section Solution */}
      <section id="solution" className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              La Solution PharmaConnect
              <span className="block text-xl lg:text-2xl text-emerald-600 mt-2">
                Adaptée aux zones reculées les plus difficiles
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative bg-white h-full hover:scale-105 transition-transform">
                  <div className="flex flex-col h-full p-6">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">
                      {solution.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 flex-grow">
                      {solution.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section améliorée */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Fonctionnalités Révolutionnaires
              <span className="block text-xl lg:text-2xl text-gray-600 mt-2">
                Un paquet de données exploitables pour transformer votre gestion
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative ${feature.highlight ? 'lg:scale-110' : ''}`}
              >
                {feature.highlight && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                )}
                <Card 
                  className="relative h-full group-hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white"
                  padding="lg"
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                    {feature.highlight && (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        <SparklesIcon className="w-3 h-3 mr-1" />
                        Innovation Clé
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Impact */}
      <section id="impact" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Impact Mesurable
              <span className="block text-xl lg:text-2xl text-blue-600 mt-2">
                Des résultats concrets pour vos programmes
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 bg-gradient-to-br from-emerald-100 to-teal-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-emerald-700 mb-4">-60%</div>
              <div className="text-lg font-semibold text-emerald-800 mb-2">Péremptions</div>
              <div className="text-sm text-emerald-600">Réduction drastique des pertes financières</div>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-br from-blue-100 to-indigo-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-blue-700 mb-4">+80%</div>
              <div className="text-lg font-semibold text-blue-800 mb-2">Disponibilité</div>
              <div className="text-sm text-blue-600">Médicaments toujours disponibles</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-purple-700 mb-4">70%</div>
              <div className="text-lg font-semibold text-purple-800 mb-2">Gain de temps</div>
              <div className="text-sm text-purple-600">Dans la gestion quotidienne</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section redesigné */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Transformez la Santé Publique
              <span className="block text-xl lg:text-2xl text-emerald-100 mt-2">
                dans les zones les plus vulnérables
              </span>
            </h2>
            <p className="text-xl text-emerald-50">
              Rejoignez les organisations qui révolutionnent l'accès aux médicaments essentiels 
              pour les populations rurales et isolées.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">VIH/Sida</div>
                <div className="text-emerald-100">Prise en charge</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Tuberculose</div>
                <div className="text-emerald-100">Traitement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Paludisme</div>
                <div className="text-emerald-100">Prévention</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                variant="primary"
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-lg font-bold hover:scale-105 transition-all shadow-2xl"
                onClick={() => onLogin && onLogin()}
              >
                Démarrer Maintenant
              </Button>
              {/* <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-white hover:text-emerald-600 px-8 py-4 text-lg font-bold hover:scale-105 transition-all"
              >
                Planifier une Démo
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer amélioré */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Logo size="lg" className="justify-center" />
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Solution complète de gestion pharmaceutique pour les projets humanitaires 
              et programmes de santé publique en zones rurales et difficiles d'accès.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 pt-8">
              <div>📧 contact@pharmaconnect.com</div>
              <div>📱 +XXX XXX XXX XXX</div>
              <div>🌍 www.pharmaconnect.com</div>
            </div>

            <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
              © 2024 PharmaConnect. Solution adaptée aux interventions d'urgence et développement.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 4s ease-in-out 0.5s infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;