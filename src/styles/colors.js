// Design System - Couleurs PharmaConnect basées sur le logo
export const colors = {
  // Couleurs principales du logo
  primary: {
    green: '#02C98A',      // Vert principal
    greenDark: '#029B63',  // Vert foncé
    greenLight: '#0EDD98', // Vert clair
  },
  
  secondary: {
    blue: '#00AAD8',       // Bleu principal
    blueDark: '#0080A8',   // Bleu foncé (calculé)
    blueLight: '#4FD7F7',  // Bleu clair
  },

  // Couleurs neutres
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },

  // États et alertes
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Gradients basés sur le logo
  gradients: {
    primary: 'linear-gradient(135deg, #02C98A 0%, #029B63 100%)',
    secondary: 'linear-gradient(135deg, #00AAD8 0%, #4FD7F7 100%)',
    hero: 'linear-gradient(135deg, #02C98A 0%, #00AAD8 50%, #4FD7F7 100%)',
    card: 'linear-gradient(135deg, rgba(2, 201, 138, 0.1) 0%, rgba(0, 170, 216, 0.1) 100%)',
  },

  // Couleurs avec opacité pour les effets
  alpha: {
    greenLight: 'rgba(2, 201, 138, 0.1)',
    greenMedium: 'rgba(2, 201, 138, 0.2)',
    blueLight: 'rgba(0, 170, 216, 0.1)',
    blueMedium: 'rgba(0, 170, 216, 0.2)',
  }
};

// Thème médical spécialisé
export const medicalTheme = {
  pill: colors.primary.green,
  capsule: colors.secondary.blue,
  liquid: colors.secondary.blueLight,
  tablet: colors.primary.greenLight,
  injection: colors.neutral.gray600,
  emergency: colors.error,
  prescription: colors.primary.green,
  pharmacy: colors.secondary.blue,
};

export default colors;