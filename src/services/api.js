// Configuration de base pour l'API
const API_BASE_URL = 'https://api-pharmaconnect.shop/api';
// const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Headers par défaut
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Toujours récupérer le token frais depuis localStorage
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      headers['Authorization'] = `Token ${currentToken}`;
    }
    
    return headers;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Pour les requêtes DELETE qui retournent un 204 No Content
      if (response.status === 204) {
        return {};
      }
      
      // Vérifier si la réponse contient du JSON
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        console.error('Erreur API détaillée:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          data: data
        });
        
        // Si erreur 401, c'est un problème d'authentification
        if (response.status === 401) {
          // Nettoyer le localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          
          // Si on n'est pas déjà sur la page de login, rediriger
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        throw new Error(data.detail || data.message || JSON.stringify(data) || `Erreur HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Authentification
  async login(credentials) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    if (this.token) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }

    // Nettoyer le stockage local
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }

  async register(userData) {
    return await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Obtenir l'utilisateur connecté
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtenir le profil utilisateur depuis l'API
  async getUserProfile() {
    return await this.request('/users/me/');
  }

  // Obtenir les utilisateurs disponibles comme distributeurs
  async getAvailableDistributors(facilityId = null) {
    const params = facilityId ? `?facility_id=${facilityId}` : '';
    return await this.request(`/users/available_distributors/${params}`);
  }

  // Rechercher des utilisateurs
  async searchUsers(searchTerm) {
    const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
    return await this.request(`/users/${params}`);
  }

  // Obtenir tous les utilisateurs
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/users/${params ? '?' + params : ''}`);
  }

  // Mettre à jour le profil utilisateur
  async updateUserProfile(userId, userData) {
    return await this.request(`/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  // Créer un nouvel utilisateur
  async createUser(userData) {
    return await this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    return await this.request(`/users/${userId}/`, {
      method: 'DELETE',
    });
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('user');
  }

  // Organisations
  async getOrganizations() {
    return await this.request('/organizations/');
  }

  // Projets
  async getProjects() {
    return await this.request('/projects/');
  }

  async createProject(projectData) {
    return await this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return await this.request(`/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return await this.request(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  async getProjectById(id) {
    return await this.request(`/projects/${id}/`);
  }

  // Donors
  async getDonors() {
    return await this.request('/donors/');
  }

  async createDonor(donorData) {
    return await this.request('/donors/', {
      method: 'POST',
      body: JSON.stringify(donorData),
    });
  }

  // Formations sanitaires
  async getHealthFacilities() {
    return await this.request('/health-facilities/');
  }

  async createHealthFacility(facilityData) {
    return await this.request('/health-facilities/', {
      method: 'POST',
      body: JSON.stringify(facilityData),
    });
  }

  async updateHealthFacility(id, facilityData) {
    return await this.request(`/health-facilities/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(facilityData),
    });
  }

  async deleteHealthFacility(id) {
    return await this.request(`/health-facilities/${id}/`, {
      method: 'DELETE',
    });
  }

  async getHealthFacilitiesWithCoordinates() {
    return await this.request('/health-facilities/with_coordinates/');
  }

  async getHealthFacilityDistributors(facilityId) {
    return await this.request(`/health-facilities/${facilityId}/distributors/`);
  }

  // Distributeurs de formations sanitaires
  async getAllHealthFacilityDistributors() {
    return await this.request('/health-facility-distributors/');
  }

  async createHealthFacilityDistributor(distributorData) {
    return await this.request('/health-facility-distributors/', {
      method: 'POST',
      body: JSON.stringify(distributorData),
    });
  }

  async updateHealthFacilityDistributor(id, distributorData) {
    return await this.request(`/health-facility-distributors/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(distributorData),
    });
  }

  async deleteHealthFacilityDistributor(id) {
    return await this.request(`/health-facility-distributors/${id}/`, {
      method: 'DELETE',
    });
  }

  async getDistributorsByFacility(facilityId) {
    return await this.request(`/health-facility-distributors/by_facility/?facility_id=${facilityId}`);
  }

  async getDistributorsByUser(userId) {
    return await this.request(`/health-facility-distributors/by_user/?user_id=${userId}`);
  }

  // Médicaments
  async getMedications() {
    return await this.request('/medications/');
  }

  async createMedication(medicationData) {
    return await this.request('/medications/', {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  }

  async updateMedication(id, medicationData) {
    return await this.request(`/medications/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(medicationData),
    });
  }

  async deleteMedication(id) {
    return await this.request(`/medications/${id}/`, {
      method: 'DELETE',
    });
  }

  // Catégories de médicaments
  async getMedicationCategories() {
    return await this.request('/medication-categories/');
  }

  async createMedicationCategory(categoryData) {
    return await this.request('/medication-categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateMedicationCategory(id, categoryData) {
    return await this.request(`/medication-categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteMedicationCategory(id) {
    return await this.request(`/medication-categories/${id}/`, {
      method: 'DELETE',
    });
  }

  // Stocks
  async getStockEntries(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/stock-entries/${params ? '?' + params : ''}`);
  }

  async getStockEntryById(id) {
    return await this.request(`/stock-entries/${id}/`);
  }

  async createStockEntry(stockData) {
    return await this.request('/stock-entries/', {
      method: 'POST',
      body: JSON.stringify(stockData),
    });
  }

  async updateStockEntry(id, stockData) {
    return await this.request(`/stock-entries/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(stockData),
    });
  }

  async deleteStockEntry(id) {
    return await this.request(`/stock-entries/${id}/`, {
      method: 'DELETE',
    });
  }

  async getStockReceptionReport(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/stock-entries/reception_report/${params ? '?' + params : ''}`);
  }

  async getStockExpiryAlerts() {
    return await this.request('/stock-entries/expiry_alerts/');
  }

  // Dispensations
  async getDispensations() {
    return await this.request('/dispensations/');
  }

  // Inventaires
  async getInventories() {
    return await this.request('/inventories/');
  }

  // Alertes
  async getAlerts() {
    return await this.request('/alerts/');
  }

  // Analyses
  async getStockSummary() {
    return await this.request('/analytics/stock-summary/');
  }

  async getPharmacoepidemioAnalysis() {
    return await this.request('/analytics/pharmacoepidemio/');
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;