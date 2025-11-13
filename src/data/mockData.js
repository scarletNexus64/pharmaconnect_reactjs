// Données fictives centralisées pour l'application PharmaConnect

export const demoUsers = [
  {
    role: 'Super Admin',
    username: 'admin@pharmaconnect.com',
    password: 'Admin@2024',
    name: 'Administrateur Système',
    organization: 'PharmaConnect'
  },
  {
    role: 'Admin ONG',
    username: 'mdm@pharmaconnect.com',
    password: 'Mdm@2024',
    name: 'Dr. Alain Martin',
    organization: 'Médecins du Monde'
  },
  {
    role: 'Gestionnaire Projet',
    username: 'project@pharmaconnect.com',
    password: 'Project@2024',
    name: 'Inf. Chief Kala',
    organization: 'Médecins du Monde'
  },
  {
    role: 'Utilisateur Site',
    username: 'site@pharmaconnect.com',
    password: 'Site@2024',
    name: 'Pharmacien Jean',
    organization: 'CS Bangangté'
  }
];

export const organizations = [
  {
    id: 1,
    name: 'Médecins du Monde',
    code: 'MDM',
    type: 'ONG',
    country: 'France',
    projects: 8,
    sites: 25,
    status: 'active'
  },
  {
    id: 2,
    name: 'Médecins Sans Frontières',
    code: 'MSF',
    type: 'ONG',
    country: 'Belgique',
    projects: 12,
    sites: 45,
    status: 'active'
  },
  {
    id: 3,
    name: 'Programme VIH National',
    code: 'PVNIH',
    type: 'ÉTAT',
    country: 'Cameroun',
    projects: 3,
    sites: 12,
    status: 'active'
  }
];

export const medications = [
  {
    id: 1,
    code: 'M001',
    name: 'Amoxicilline',
    dosage: '500mg',
    form: 'Gélule',
    category: 'Antibiotique',
    indication: 'Infections respiratoires, ORL, urinaires',
    contraindication: 'Allergie pénicillines',
    posology: '1g/jour en 2-3 prises',
    authorizedLevels: ['CSI', 'CS', 'Hôpital', 'Mobile'],
    price: 2.50,
    stockStatus: 'available',
    currentStock: 145,
    cmm: 67,
    batch: 'A123-2024',
    expiry: '2025-06-01'
  },
  {
    id: 2,
    code: 'M002',
    name: 'Paracétamol',
    dosage: '500mg',
    form: 'Comprimé',
    category: 'Antalgique',
    indication: 'Douleur, fièvre',
    contraindication: 'Insuffisance hépatique sévère',
    posology: '1-2 cp toutes les 6h max',
    authorizedLevels: ['CSI', 'CS', 'Hôpital', 'Mobile', 'ASC'],
    price: 0.15,
    stockStatus: 'low',
    currentStock: 45,
    cmm: 67,
    batch: 'P456-2024',
    expiry: '2025-08-15'
  },
  {
    id: 3,
    code: 'M003',
    name: 'Artémether',
    dosage: '80mg/ml',
    form: 'Injectable',
    category: 'Antipaludique',
    indication: 'Paludisme grave',
    contraindication: 'Allergie artémisinine',
    posology: '3.2mg/kg IM puis 1.6mg/kg/j',
    authorizedLevels: ['Hôpital', 'CS'],
    price: 15.20,
    stockStatus: 'out',
    currentStock: 0,
    cmm: 12,
    batch: '-',
    expiry: '-'
  }
];

export const projects = [
  {
    id: 1,
    name: 'Santé Communautaire Bangangté',
    code: 'SCB-2024',
    organization: 'Médecins du Monde',
    donor: 'GFFO5',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 45000,
    spent: 32150,
    sites: ['CS Bangangté'],
    users: 25,
    medicines: 148,
    status: 'active'
  },
  {
    id: 2,
    name: 'Programme VIH Yaoundé',
    code: 'PVY-2024',
    organization: 'Médecins du Monde',
    donor: 'PEPFAR',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    budget: 78000,
    spent: 56400,
    sites: ['Hôp Central Yaoundé', 'CS Mvog-Mbi', 'CS Efoulan'],
    users: 12,
    medicines: 89,
    status: 'active'
  }
];

export const healthFacilities = [
  {
    id: 1,
    name: 'CS Bangangté',
    code: 'CS-BGT',
    type: 'CSI',
    level: 'PRIMARY',
    location: 'Bangangté, Région de l\'Ouest',
    population: 15000,
    coordinates: { lat: 5.1419, lng: 10.5186 },
    status: 'operational',
    lastActivity: '2 heures'
  },
  {
    id: 2,
    name: 'Hôpital Central Yaoundé',
    code: 'HCY',
    type: 'HOSPITAL',
    level: 'TERTIARY',
    location: 'Yaoundé, Région du Centre',
    population: 200000,
    coordinates: { lat: 3.8480, lng: 11.5021 },
    status: 'operational',
    lastActivity: '30 minutes'
  }
];

export const dispensations = [
  {
    id: 1,
    date: '2024-10-28',
    time: '14:32',
    patient: {
      name: 'Marie Ngono',
      age: 34,
      gender: 'F',
      phone: '+237 690 123 456'
    },
    orderNumber: 'OPD-2024-1052',
    prescriber: 'Dr. Mballa',
    service: 'OPD',
    medicines: [
      { name: 'Amoxicilline 500mg', quantity: 12, price: 2.50 },
      { name: 'Paracétamol 500mg', quantity: 20, price: 0.15 }
    ],
    total: 33.00,
    status: 'complete',
    prescriptionPhoto: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    date: '2024-10-28',
    time: '11:15',
    patient: {
      name: 'Paul Etoa',
      age: 28,
      gender: 'M',
      phone: '+237 677 987 654'
    },
    orderNumber: 'URG-2024-0089',
    prescriber: 'Dr. Fouda',
    service: 'Urgences',
    medicines: [
      { name: 'Artémether 80mg', quantity: 5, price: 15.20 }
    ],
    total: 76.00,
    status: 'partial',
    prescriptionPhoto: 'https://via.placeholder.com/300x200'
  }
];

export const stockEntries = [
  {
    id: 1,
    date: '2024-09-25',
    supplier: 'MDM/GFFO5',
    site: 'CS Bangangté',
    items: [
      { 
        name: 'Amoxicilline 500mg', 
        ordered: 100, 
        received: 95, 
        batch: 'A123-2024',
        expiry: '2025-06-01'
      },
      { 
        name: 'Paracétamol 500mg', 
        ordered: 200, 
        received: 200, 
        batch: 'P456-2024',
        expiry: '2025-08-15'
      }
    ],
    totalValue: 2450,
    status: 'completed'
  }
];

export const alerts = [
  {
    id: 1,
    type: 'Rupture',
    severity: 'critical',
    medicine: 'Artémether 80mg',
    site: 'CS Bangangté',
    description: 'Stock épuisé depuis 5 jours',
    action: 'Commande urgente',
    timeAgo: '5j'
  },
  {
    id: 2,
    type: 'Pré-rupture',
    severity: 'warning',
    medicine: 'Paracétamol 500mg',
    site: 'CS Bangangté',
    description: 'Stock insuffisant (45 unités, CMM: 67)',
    action: 'Planifier commande',
    timeAgo: '1j'
  },
  {
    id: 3,
    type: 'Expiration',
    severity: 'warning',
    medicine: 'Amoxicilline Lot#A123',
    site: 'CS Garoua',
    description: 'Expiration dans 2 mois',
    action: 'Redistribution urgente',
    timeAgo: '2h'
  }
];

export const analyticsData = {
  global: {
    totalOrganizations: 25,
    totalProjects: 156,
    totalMedications: 50000,
    totalUsers: 2500,
    totalDispensations: 56410,
    alertsActive: 15
  },
  trends: {
    monthly: [
      { month: 'Jan', dispensations: 24000, alerts: 45, revenue: 125000 },
      { month: 'Fév', dispensations: 26500, alerts: 38, revenue: 142000 },
      { month: 'Mar', dispensations: 28900, alerts: 52, revenue: 156000 },
      { month: 'Avr', dispensations: 31200, alerts: 41, revenue: 167000 },
      { month: 'Mai', dispensations: 29800, alerts: 47, revenue: 159000 },
      { month: 'Juin', dispensations: 33400, alerts: 35, revenue: 178000 }
    ],
    weekly: [
      { week: 'S42', dispensations: 145, prescriptions: 156, stock: 94 },
      { week: 'S43', dispensations: 189, prescriptions: 201, stock: 91 },
      { week: 'S44', dispensations: 167, prescriptions: 178, stock: 89 },
      { week: 'S45', dispensations: 201, prescriptions: 215, stock: 87 },
      { week: 'S46', dispensations: 234, prescriptions: 245, stock: 85 },
      { week: 'S47', dispensations: 189, prescriptions: 198, stock: 88 }
    ]
  },
  pharmacoepidemiology: {
    antibiotics: {
      prescriptionRate: 67.3,
      combinationRate: 12.4,
      protocolCompliance: 89.2,
      repeatedPrescriptions: 23
    },
    malaria: {
      epidemicTrend: 234,
      tdrTreatmentRate: 87.6,
      severeCases: 45,
      pregnantWomen: 23,
      childrenUnder5: 67,
      totalCases: 178
    },
    pediatric: {
      diarrheaCases: 89,
      orstMetronidazole: 89,
      malnutritionKits: 12,
      diarrheeaTrend: 189
    },
    pregnancy: {
      cpnCompliance: 86.5,
      oxytocinDispensed: 28,
      deliveryKits: 28,
      totalDeliveries: 32
    }
  }
};

export const notifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Rupture Stock Critique',
    message: 'Artémether en rupture - CS Bangangté',
    time: '2h ago',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Nouvelle Livraison',
    message: 'Réception confirmée - Lot A123',
    time: '4h ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Expiration Proche',
    message: 'Lot P456 expire dans 2 mois',
    time: '1j ago',
    read: true
  }
];

// Fonctions utilitaires pour les données
export const getOrganizationById = (id) => {
  return organizations.find(org => org.id === id);
};

export const getMedicationById = (id) => {
  return medications.find(med => med.id === id);
};

export const getProjectById = (id) => {
  return projects.find(project => project.id === id);
};

export const getHealthFacilityById = (id) => {
  return healthFacilities.find(facility => facility.id === id);
};

export const getAlertsBySeverity = (severity) => {
  return alerts.filter(alert => alert.severity === severity);
};

export const getMedicationsByStatus = (status) => {
  return medications.filter(med => med.stockStatus === status);
};

export const getDispensationsByStatus = (status) => {
  return dispensations.filter(disp => disp.status === status);
};

// Données pour les graphiques
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#059669',
  purple: '#8B5CF6'
};

export const regionColors = {
  'Afrique de l\'Ouest': '#3B82F6',
  'Afrique Centrale': '#10B981',
  'Afrique de l\'Est': '#F59E0B',
  'Afrique Australe': '#EF4444'
};

export default {
  demoUsers,
  organizations,
  medications,
  projects,
  healthFacilities,
  dispensations,
  stockEntries,
  alerts,
  analyticsData,
  notifications,
  chartColors,
  regionColors
};