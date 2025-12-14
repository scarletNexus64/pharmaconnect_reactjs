import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import apiService from '../../services/api';

const Login = ({ onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    organization: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      // Validation côté client
      const newErrors = {};
      if (!formData.username.trim()) {
        newErrors.username = 'Le nom d\'utilisateur est requis';
      }
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Appel API réel
      const credentials = {
        username: formData.username,
        password: formData.password
      };

      const response = await apiService.login(credentials);
      
      console.log('Connexion réussie:', response);
      
      // Stocker les informations d'authentification
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userRole', response.user.access_level);
      localStorage.setItem('organization', response.user.organization_name);
      localStorage.setItem('healthFacility', response.user.health_facility_name);
      localStorage.setItem('userId', response.user.id);
      
      // Redirection vers dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Gérer les erreurs spécifiques
      if (error.message.includes('Identifiants invalides')) {
        setErrors({
          password: 'Nom d\'utilisateur ou mot de passe incorrect'
        });
      } else if (error.message.includes('Compte désactivé')) {
        setErrors({
          username: 'Votre compte a été désactivé'
        });
      } else {
        setErrors({
          general: 'Erreur de connexion. Vérifiez votre connexion internet.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    // Pré-remplir le formulaire avec les vraies données de test
    setFormData({
      username: 'claudeUserTest',
      password: 'TestPassword123!',
      organization: 'Organisation Test PharmaConnect'
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4 relative">
      
      {/* Bouton de retour */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors z-10"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Retour</span>
        </button>
      )}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Section Illustration - Gauche */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Gestion Pharmaceutique
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Intelligente
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Optimisez la distribution de médicaments pour vos projets humanitaires avec PharmaConnect
            </p>
          </div>

          {/* Illustration médicale moderne avec CSS */}
          <div className="relative w-80 h-80">
            {/* Container principal */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-20"></div>

            {/* Pilules animées */}
            <div className="absolute top-16 left-16 w-16 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse transform rotate-12"></div>
            <div className="absolute top-24 right-20 w-12 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse delay-300 transform -rotate-6"></div>
            <div className="absolute bottom-20 left-20 w-14 h-7 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse delay-700 transform rotate-45"></div>

            {/* Stéthoscope stylisé */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-green-400 rounded-full relative">
                <div className="absolute top-2 left-2 w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-blue-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Particules flottantes */}
            <div className="absolute top-8 right-8 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
            <div className="absolute top-1/3 right-4 w-1 h-1 bg-green-300 rounded-full animate-ping"></div>
          </div>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">ONG Partenaires</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">1M+</div>
              <div className="text-sm text-gray-600">Médicaments Gérés</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-600">Pays Actifs</div>
            </div>
          </div>
        </div>

        {/* Section Connexion - Droite */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="shadow-2xl border-0">
            <div className="text-center mb-8">
              <Logo size="lg" className="justify-center mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connexion
              </h2>
              <p className="text-gray-600">
                Accédez à votre espace de gestion pharmaceutique
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}
              
              <Input
                label="Nom d'utilisateur"
                name="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                disabled={loading}
              />

              <Input
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                disabled={loading}
                icon={showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                onIconClick={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Organisation (optionnel)"
                name="organization"
                type="text"
                placeholder="Code ou nom de votre organisation"
                value={formData.organization}
                onChange={handleInputChange}
                disabled={loading}
              />

              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Se connecter
                </Button>

                {/* <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    disabled={loading}
                  >
                    Mot de passe oublié ?
                  </button>
                </div> */}
              </div>
            </form>

            {/* Sélecteur de langue */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="text-gray-500">Langue:</span>
                <button className="text-green-600 font-medium">Français</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-500 hover:text-gray-700">English</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-500 hover:text-gray-700">العربية</button>
              </div>
            </div>
          </Card>

          {/* Note de sécurité */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Connexion sécurisée - Toutes vos données sont protégées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;