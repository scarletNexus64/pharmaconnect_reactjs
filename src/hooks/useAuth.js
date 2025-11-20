import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'état d'authentification au chargement
    const checkAuth = async () => {
      const authStatus = apiService.isAuthenticated();

      if (authStatus) {
        try {
          // Récupérer les données à jour de l'utilisateur depuis l'API
          const userData = await apiService.getUserProfile();
          setIsAuthenticated(true);
          setUser(userData);
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          // Fallback sur les données localStorage si l'API échoue
          const userData = apiService.getCurrentUser();
          setIsAuthenticated(authStatus);
          setUser(userData);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};