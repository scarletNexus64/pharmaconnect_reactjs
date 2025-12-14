import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  MapIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  CpuChipIcon,
  SunIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import {
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CookieBanner from '../../components/ui/CookieBanner';

const LandingPage = ({ onLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { number: '60%', label: 'Réduction des pertes', icon: '📉' },
    { number: '80%', label: 'Disponibilité améliorée', icon: '✅' },
    { number: '100%', label: 'Autonomie énergétique', icon: '☀️' },
    { number: '24/7', label: 'Support continu', icon: '🔄' }
  ];

  const challenges = [
    {
      icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      title: "Protocoles médicaux anarchiques",
      description: "Posologies dangereuses et mauvais suivi des patients vulnérables",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: <BeakerIcon className="w-6 h-6" />,
      title: "Gestion catastrophique des stocks",
      description: "Ruptures fréquentes et péremptions massives entraînant des pertes",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Absence de données fiables",
      description: "Aucune visibilité sur les consommations et décisions non éclairées",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Résistance aux antibiotiques",
      description: "Prescriptions abusives créant des résistances thérapeutiques",
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  const features = [
    {
      icon: <DocumentCheckIcon className="w-7 h-7" />,
      title: 'Protocoles Standardisés',
      description: 'Base de données conforme OMS avec adaptation aux protocoles nationaux',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <CpuChipIcon className="w-7 h-7" />,
      title: 'IA Intégrée',
      description: 'Quantification intelligente et prévision des besoins exceptionnels',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <ExclamationTriangleIcon className="w-7 h-7" />,
      title: 'Alertes Proactives',
      description: 'Prévention des ruptures et détection des anomalies',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: <MapIcon className="w-7 h-7" />,
      title: 'Surveillance Épidémio',
      description: 'Monitoring temps réel des maladies sous surveillance',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BeakerIcon className="w-7 h-7" />,
      title: 'Dispensation Sécurisée',
      description: 'Détection des interactions et conseils d\'observance',
      gradient: 'from-rose-500 to-red-500'
    },
    {
      icon: <AcademicCapIcon className="w-7 h-7" />,
      title: 'Formation Continue',
      description: 'Modules interactifs et guides de bonnes pratiques',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <SunIcon className="w-7 h-7" />,
      title: 'Autonomie Solaire',
      description: 'Double batterie rechargeable pour zones isolées',
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      icon: <ChartBarIcon className="w-7 h-7" />,
      title: 'Analytics Avancées',
      description: 'Tableaux de bord centralisés et rapports détaillés',
      gradient: 'from-teal-500 to-emerald-500'
    }
  ];

  const solutions = [
    {
      step: '01',
      title: 'Tablettes Robustes',
      description: 'Conçues pour environnements difficiles avec recharge solaire',
      icon: '📱'
    },
    {
      step: '02',
      title: 'Application Intelligente',
      description: 'Interface intuitive avec IA pour personnel non spécialisé',
      icon: '🤖'
    },
    {
      step: '03',
      title: 'Dashboard Centralisé',
      description: 'Supervision temps réel multi-districts et projets',
      icon: '📊'
    },
    {
      step: '04',
      title: 'Formation & Support',
      description: 'Déploiement en 48h avec formation complète',
      icon: '🎓'
    }
  ];

  const faqs = [
    {
      question: "Comment PharmaConnect améliore-t-il la gestion des stocks ?",
      answer: "PharmaConnect utilise l'intelligence artificielle pour analyser les consommations passées et prédire les besoins futurs. Le système génère automatiquement des alertes avant les ruptures de stock et détecte les péremptions imminentes, permettant une réduction de 60% des pertes."
    },
    {
      question: "La solution fonctionne-t-elle sans connexion internet ?",
      answer: "Oui, PharmaConnect est conçu pour fonctionner en mode hors ligne. Toutes les données sont synchronisées automatiquement dès qu'une connexion internet est disponible. Les tablettes disposent également d'une double batterie rechargeable à l'énergie solaire pour une autonomie complète."
    },
    {
      question: "Combien de temps prend le déploiement ?",
      answer: "Le déploiement complet se fait en 48h, incluant l'installation des tablettes, la configuration du système, la formation du personnel et le support initial. Notre équipe vous accompagne à chaque étape pour garantir une transition en douceur."
    },
    {
      question: "La solution est-elle conforme aux standards OMS ?",
      answer: "Absolument. PharmaConnect intègre une base de données complète conforme aux protocoles de l'OMS, avec adaptation automatique aux protocoles nationaux. Le système assure le respect des bonnes pratiques pharmaceutiques et médicales."
    },
    {
      question: "Quel type de support est fourni ?",
      answer: "Nous offrons un support 24/7 par téléphone, email et chat. Notre équipe technique est disponible pour résoudre tout problème rapidement. Des mises à jour régulières et des formations continues sont également incluses."
    },
    {
      question: "Peut-on personnaliser la solution selon nos besoins ?",
      answer: "Oui, PharmaConnect est hautement personnalisable. Nous adaptons les protocoles, les rapports et les tableaux de bord selon vos besoins spécifiques et les particularités de votre programme humanitaire."
    }
  ];

  const navLinks = [
    { name: 'Défis', href: '#challenges' },
    { name: 'Solution', href: '#solution' },
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Impact', href: '#impact' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Header moderne avec navigation enrichie */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-xs font-semibold">
                <SparklesIcon className="w-3 h-3 mr-1" />
                Solution Humanitaire
              </span>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* CTA Buttons Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onLogin && onLogin()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
              >
                Connexion
              </Button>
            </div>

            {/* Menu Hamburger Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-900" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-6 space-y-4 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-base font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onLogin && onLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section professionnelle */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Contenu gauche */}
            <div
              id="hero-content"
              className={`animate-on-scroll space-y-8 transition-all duration-1000 ${
                isVisible['hero-content'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {/* Badge urgence */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 rounded-full text-sm font-semibold">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Urgence Sanitaire en Zones Rurales
              </div>

              {/* Titre principal */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  L'Accès aux
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Médicaments Essentiels
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">PharmaConnect</span> révolutionne la gestion pharmaceutique
                  pour les projets humanitaires : VIH/Sida, Tuberculose, Paludisme et Malnutrition.
                </p>
              </div>

              {/* Call to actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onLogin && onLogin()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all text-base sm:text-lg"
                >
                  Démarrer Maintenant
                </Button>
              </div>

              {/* Stats en cards modernes */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="text-3xl sm:text-4xl">{stat.icon}</div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration droite - cachée sur mobile */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                {/* Card principale */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-800">Gestion des Stocks</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="space-y-4">
                    {['Paracétamol 500mg', 'Amoxicilline 250mg', 'Artémether'].map((med, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{med}</span>
                          <span>{[75, 30, 90][i]}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              [75, 30, 90][i] > 50 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${[75, 30, 90][i]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-10 -right-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg animate-float">
                  <div className="flex items-center space-x-2">
                    <SunIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">Autonome</span>
                  </div>
                </div>

                <div className="absolute bottom-20 -left-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg animate-float-delay">
                  <div className="flex items-center space-x-2">
                    <BeakerIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">Intelligent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Défis */}
      <section id="challenges" className="py-16 md:py-24 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-amber-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="challenges-header"
            className={`text-center mb-12 md:mb-16 animate-on-scroll transition-all duration-1000 ${
              isVisible['challenges-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-6">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm font-semibold text-red-700">Urgence Sanitaire</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Les Défis Critiques
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              qui mettent en péril vos programmes humanitaires
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                id={`challenge-${index}`}
                className={`animate-on-scroll transition-all duration-700 ${
                  isVisible[`challenge-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative group h-full">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${challenge.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`}></div>
                  <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300">
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${challenge.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {challenge.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {challenge.title}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>Pertes financières et risques pour la santé publique</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Solution */}
      <section id="solution" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            id="solution-header"
            className={`text-center mb-12 md:mb-16 animate-on-scroll transition-all duration-1000 ${
              isVisible['solution-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full mb-6">
              <SparklesIcon className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="text-sm font-semibold text-emerald-700">Notre Approche</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              La Solution PharmaConnect
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Adaptée aux zones reculées les plus difficiles
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                id={`solution-${index}`}
                className={`animate-on-scroll transition-all duration-700 ${
                  isVisible[`solution-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative group h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

                  <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300">
                    <div className="p-6 sm:p-8 space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                          {solution.step}
                        </div>
                        <div className="text-5xl group-hover:scale-110 transition-transform">
                          {solution.icon}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {solution.title}
                      </h3>

                      <p className="text-base text-gray-600 leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="features-header"
            className={`text-center mb-12 md:mb-16 animate-on-scroll transition-all duration-1000 ${
              isVisible['features-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Fonctionnalités Révolutionnaires
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution complète pour transformer votre gestion
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                className={`animate-on-scroll transition-all duration-700 ${
                  isVisible[`feature-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <div className="p-6 space-y-4 text-center">
                    <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Impact */}
      <section id="impact" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="impact-header"
            className={`text-center mb-12 md:mb-16 animate-on-scroll transition-all duration-1000 ${
              isVisible['impact-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Impact Mesurable
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Des résultats concrets pour vos programmes
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:scale-105 transition-transform shadow-xl">
              <div className="text-5xl sm:text-6xl font-bold mb-4">-60%</div>
              <div className="text-lg font-semibold mb-2">Péremptions</div>
              <div className="text-sm opacity-90">Réduction des pertes financières</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white hover:scale-105 transition-transform shadow-xl">
              <div className="text-5xl sm:text-6xl font-bold mb-4">+80%</div>
              <div className="text-lg font-semibold mb-2">Disponibilité</div>
              <div className="text-sm opacity-90">Médicaments disponibles</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform shadow-xl">
              <div className="text-5xl sm:text-6xl font-bold mb-4">70%</div>
              <div className="text-lg font-semibold mb-2">Gain de temps</div>
              <div className="text-sm opacity-90">Gestion quotidienne</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="faq-header"
            className={`text-center mb-12 md:mb-16 animate-on-scroll transition-all duration-1000 ${
              isVisible['faq-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Tout ce que vous devez savoir sur PharmaConnect
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                id={`faq-${index}`}
                className={`animate-on-scroll transition-all duration-700 ${
                  isVisible[`faq-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden bg-white hover:shadow-lg transition-all">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full text-left p-6 flex items-start justify-between focus:outline-none group"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 ml-4 transition-transform duration-300 ${
                        activeFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pl-18">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Transformez la Santé Publique
            </h2>
            <p className="text-lg sm:text-xl text-emerald-50 max-w-2xl mx-auto">
              Rejoignez les organisations qui révolutionnent l'accès aux médicaments essentiels
              pour les populations rurales et isolées.
            </p>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              {['VIH/Sida', 'Tuberculose', 'Paludisme'].map((disease) => (
                <div key={disease} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">{disease}</div>
                  <div className="text-xs sm:text-sm text-emerald-100">Prise en charge</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-base sm:text-lg font-bold hover:scale-105 transition-all shadow-2xl"
                onClick={() => onLogin && onLogin()}
              >
                Démarrer Maintenant
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-base sm:text-lg font-bold hover:scale-105 transition-all"
              >
                Contacter l'équipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer professionnel */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Column 1 - About */}
            <div className="space-y-4">
              <Logo size="lg" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Solution complète de gestion pharmaceutique pour les projets humanitaires
                et programmes de santé publique en zones rurales.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-xl">💼</span>
                </a>
              </div>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Navigation</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Legal */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    Protection des données (RGPD)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    Gestion des cookies
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <a href="mailto:ousmailasago@yahoo.fr" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    ousmailasago@yahoo.fr
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <PhoneIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <a href="tel:+237699055803" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    +237 699 055 803
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">
                    Cameroun
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="py-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-500 text-center md:text-left">
                © 2024 PharmaConnect. Tous droits réservés. Solution adaptée aux interventions d'urgence et développement.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>Certifié ISO</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                  <span>Conforme OMS</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 4s ease-in-out 0.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
