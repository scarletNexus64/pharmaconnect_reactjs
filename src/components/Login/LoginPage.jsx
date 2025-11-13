import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Activity, Users, Shield, Globe, Copy, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    organization: ''
  });

  // Demo credentials
  const demoAccounts = [
    {
      role: 'Super Admin',
      username: 'admin@pharmaconnect.com',
      password: 'Admin@2024',
      color: 'bg-red-500',
      icon: Shield,
      description: 'Accès complet système'
    },
    {
      role: 'Admin ONG',
      username: 'mdm@pharmaconnect.com',
      password: 'Mdm@2024',
      color: 'bg-orange-500',
      icon: Globe,
      description: 'Coordination organisation'
    },
    {
      role: 'Gestionnaire Projet',
      username: 'project@pharmaconnect.com',
      password: 'Project@2024',
      color: 'bg-yellow-500',
      icon: Users,
      description: 'Gestion projets terrain'
    },
    {
      role: 'Utilisateur Site',
      username: 'site@pharmaconnect.com',
      password: 'Site@2024',
      color: 'bg-green-500',
      icon: Activity,
      description: 'Dispensation & stocks'
    }
  ];

  const handleCopy = (field, value, accountIndex) => {
    navigator.clipboard.writeText(value);
    setCopiedCredential(`${field}-${accountIndex}`);
    setTimeout(() => setCopiedCredential(''), 2000);
  };

  const handleQuickLogin = (account) => {
    setFormData({
      username: account.username,
      password: account.password,
      organization: account.role === 'Admin ONG' ? 'Médecins du Monde' : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login and redirect based on role
    const account = demoAccounts.find(acc => acc.username === formData.username);
    if (account) {
      localStorage.setItem('userRole', account.role);
      localStorage.setItem('username', formData.username);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PharmaConnect</h1>
            <p className="text-gray-600">Système de gestion pharmaceutique pour ONG</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur ou Email
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez votre identifiant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisation (optionnel)
              </label>
              <select
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une organisation</option>
                <option value="Médecins du Monde">Médecins du Monde</option>
                <option value="MSF">Médecins Sans Frontières</option>
                <option value="UNICEF">UNICEF</option>
                <option value="Programme VIH National">Programme VIH National</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            >
              Se connecter
            </button>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <button className="hover:text-gray-700">Français</button>
              <span>|</span>
              <button className="hover:text-gray-700">English</button>
              <span>|</span>
              <button className="hover:text-gray-700">العربية</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Demo Accounts */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center px-8 py-12">
        <div className="max-w-lg w-full">
          <div className="text-white mb-8">
            <h2 className="text-2xl font-bold mb-3">Mode Démonstration</h2>
            <p className="opacity-90">
              Explorez PharmaConnect avec nos comptes de démonstration. 
              Cliquez sur un profil pour remplir automatiquement les identifiants.
            </p>
          </div>

          <div className="space-y-4">
            {demoAccounts.map((account, index) => {
              const Icon = account.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition cursor-pointer border border-white/20"
                  onClick={() => handleQuickLogin(account)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${account.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{account.role}</h3>
                      <p className="text-white/80 text-sm mb-2">{account.description}</p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                          <span className="text-white/90 text-sm font-mono">{account.username}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy('username', account.username, index);
                            }}
                            className="text-white/70 hover:text-white ml-2"
                          >
                            {copiedCredential === `username-${index}` ? 
                              <CheckCircle className="w-4 h-4" /> : 
                              <Copy className="w-4 h-4" />
                            }
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                          <span className="text-white/90 text-sm font-mono">{account.password}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy('password', account.password, index);
                            }}
                            className="text-white/70 hover:text-white ml-2"
                          >
                            {copiedCredential === `password-${index}` ? 
                              <CheckCircle className="w-4 h-4" /> : 
                              <Copy className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-white/70 text-sm">
            <p>Version démo - Données factices uniquement</p>
            <p className="mt-1">© 2024 PharmaConnect - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;