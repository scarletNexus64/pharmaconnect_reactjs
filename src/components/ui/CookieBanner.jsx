import React, { useState, useEffect } from 'react';
import { XMarkIcon, ShieldCheckIcon, CogIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const acceptSelected = () => {
    const selected = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(selected));
    setIsVisible(false);
  };

  const rejectAll = () => {
    const rejected = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(rejected));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t-4 border-emerald-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!showDetails ? (
            /* Vue simple */
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Nous respectons votre vie privée
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et personnaliser le contenu.
                    Vous pouvez accepter tous les cookies ou personnaliser vos préférences.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <CogIcon className="w-4 h-4 mr-2" />
                  Personnaliser
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700"
                >
                  Refuser
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={acceptAll}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                >
                  Tout accepter
                </Button>
              </div>
            </div>
          ) : (
            /* Vue détaillée */
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Paramètres des cookies
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gérez vos préférences en matière de cookies
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Cookies nécessaires */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">Cookies nécessaires</h4>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                        Obligatoire
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-emerald-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Cookies analytiques</h4>
                    <p className="text-sm text-gray-600">
                      Nous aident à comprendre comment les visiteurs interagissent avec notre site.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-all ${
                      preferences.analytics ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                    } px-1`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </button>
                </div>

                {/* Cookies marketing */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Cookies marketing</h4>
                    <p className="text-sm text-gray-600">
                      Utilisés pour afficher des publicités pertinentes et suivre les campagnes.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-all ${
                      preferences.marketing ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                    } px-1`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="border-2 border-gray-300 hover:border-gray-400"
                >
                  Refuser tout
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={acceptSelected}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Enregistrer mes préférences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;
