# PharmaConnect Frontend - Mode Démo

## 🎯 Vue d'ensemble

Interface frontend complète pour PharmaConnect, système de gestion pharmaceutique pour ONG avec mode démo intégré et données fictives.

## 🚀 Démarrage Rapide

### Installation
```bash
cd FrontEnd
npm install --legacy-peer-deps
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🔐 Comptes de Démonstration

L'application propose **4 rôles différents** avec accès complet aux fonctionnalités :

### 1. 🔴 Super Admin
- **Email :** `admin@pharmaconnect.com`
- **Mot de passe :** `Admin@2024`
- **Accès :** Gestion globale système, toutes organisations

### 2. 🟠 Admin ONG
- **Email :** `mdm@pharmaconnect.com`
- **Mot de passe :** `Mdm@2024`
- **Accès :** Coordination Médecins du Monde, gestion projets

### 3. 🟡 Gestionnaire Projet
- **Email :** `project@pharmaconnect.com`
- **Mot de passe :** `Project@2024`
- **Accès :** Gestion projet terrain, dispensation

### 4. 🟢 Utilisateur Site
- **Email :** `site@pharmaconnect.com`
- **Mot de passe :** `Site@2024`
- **Accès :** Interface terrain, dispensation uniquement

## 📱 Fonctionnalités Implémentées

### ✅ Page de Connexion
- **Mode démo intégré** avec comptes pré-configurés
- **Copie rapide** des identifiants
- **Connexion en un clic** par rôle
- Interface multilingue (FR/EN/AR)

### ✅ Dashboards par Rôle

#### Super Admin Dashboard
- Vue globale 25 ONG, 156 projets
- Carte mondiale interactive
- Analytics temps réel
- Alertes critiques système
- Performance organisations

#### Admin ONG Dashboard  
- Coordination Médecins du Monde
- 8 projets actifs, 25 sites
- Carte projets OSM
- Evolution stocks/budget
- Alertes terrain

#### Gestionnaire/Site Dashboard
- Projet Bangangté (GFFO5)
- 15 médicaments, 892 dispensations
- Suivi hebdomadaire S42-S48
- Liste standard active
- Actions terrain rapides

### ✅ Gestion Médicaments
- **Référentiel complet** : 5 médicaments fictifs
- **Filtres avancés** : catégorie, forme, niveau soins
- **Détails complets** : posologie, indications, contre-indications
- **Statuts stock** : disponible/faible/rupture
- **Modal détaillé** avec informations cliniques

### ✅ Gestion Stocks
- **Vue d'ensemble** : 245 références, 15 alertes
- **Alertes intelligentes** : rupture, pré-rupture, expiration
- **Graphiques** : répartition par catégorie
- **Entrées en stock** : livraisons avec taux réception
- **Calculs automatiques** : CMM, risques péremption

### ✅ Dispensation avec Photo Obligatoire
- **Processus guidé 3 étapes** :
  1. 📷 **Photo ordonnance** (OBLIGATOIRE)
  2. 👤 **Informations patient** (nom, âge, prescripteur)
  3. 💊 **Sélection médicaments** avec panier
- **Validation stricte** : impossible de continuer sans photo
- **Interface tactile** optimisée
- **Calcul automatique** prix total

### ✅ Analytics Pharmacoépidémiologie
- **4 modules spécialisés** :
  - 🦠 **Antibiotiques** : 67.3% prescription (⚠️ >50% seuil OMS)
  - 🩸 **Paludisme** : +234% épidémie, TDR 87.6%
  - 👶 **Pédiatrie** : pic diarrhées +189%
  - 🤱 **Femmes enceintes** : CPN 86.5%, ocytocine 28 cas
- **Alertes automatiques** : dépassement seuils
- **Graphiques temps réel** : tendances hebdomadaires
- **Conformité protocoles** : OMS/nationaux

### ✅ Navigation & Permissions
- **Sidebar adaptative** selon rôle
- **Menu contextuel** : 8 modules principaux
- **Permissions granulaires** par fonctionnalité
- **Navigation fluide** avec état actuel
- **Notifications** : 3 alertes actives

## 🎨 Design System

### Interface Médicale Professionnelle
- **Couleurs codées** :
  - 🔴 Critique/Urgence (ruptures, alertes)
  - 🟡 Attention (pré-ruptures, surveillance)  
  - 🟢 Normal/OK (stocks, validation)
  - 🔵 Information (navigation, liens)

### Iconographie Métier
- 💊 Médicaments, 🏥 Santé, 📦 Stocks
- 🚨 Alertes, 🗺️ Géolocalisation, 📊 Analytics
- 📱 Mobile, 🔄 Sync, ⚙️ Paramètres

### Responsive Design
- **Mobile-first** : 320px+
- **Tablette optimisée** : 768px+ (terrain)
- **Desktop complet** : 1024px+ (coordination)

## 📊 Données Fictives Complètes

### Organisations
- 3 organisations (MDM, MSF, Programme VIH)
- 25 ONG globalement simulées
- Projets multi-bailleurs (GFFO5, PEPFAR, UNICEF)

### Médicaments  
- 5 médicaments types : Amoxicilline, Paracétamol, Artémether, SRO, Cotrimoxazole
- Stocks réalistes : disponible/faible/rupture
- Informations cliniques complètes
- Prix et lots simulés

### Dispensations
- Historique réaliste avec photos ordonnances
- Patients fictifs avec données complètes
- Statuts : complète/partielle
- Calculs prix automatiques

### Analytics
- **Pharmacoépidémiologie** : données conformes terrain africain
- **Tendances temporelles** : évolution S42-S48
- **Alertes réglementaires** : seuils OMS respectés
- **Performance sites** : indicateurs réalistes

## 🔧 Architecture Technique

### Frontend React 18
- **Routing** : React Router v7.9
- **State Management** : Local state + Context
- **UI Framework** : Tailwind CSS 3.4
- **Icons** : Lucide React 0.263
- **Charts** : Recharts 2.15
- **Build** : React Scripts 5.0

### Composants Modulaires
```
src/
├── components/
│   ├── Login/           # Authentification démo
│   ├── Dashboard/       # 3 dashboards par rôle
│   ├── Medications/     # Référentiel médicaments
│   ├── Stock/          # Gestion stocks
│   ├── Dispensation/   # Interface dispensation
│   ├── Analytics/      # Pharmacoépidémiologie
│   └── Layout/         # Navigation sidebar
├── data/
│   └── mockData.js     # Données fictives centralisées
└── App.jsx            # Routage principal
```

### Sécurité & Permissions
- **Authentification** simulée par localStorage
- **Permissions granulaires** par rôle
- **Routes protégées** avec redirection
- **Validation côté client** des données

## 🎯 Fonctionnalités Démontrées

### Conformité Cahier des Charges
✅ **Photo ordonnance obligatoire**  
✅ **Multi-organisation** (ONG/État)  
✅ **Niveaux accès** (Coordination → Site)  
✅ **Liste standard automatique**  
✅ **Gestion stocks intelligente**  
✅ **Analytics pharmacoépidémiologiques**  
✅ **Interface hors ligne ready**  
✅ **Responsive mobile/tablette**  

### Innovations UX
- **Mode démo intégré** : test immédiat sans setup
- **Copie identifiants** : facilité démo
- **Navigation contextuelle** : sidebar adaptée au rôle
- **Processus guidé** : dispensation étape par étape
- **Alertes visuelles** : couleurs codées métier
- **Données réalistes** : contexte ONG africaine

## 🚀 Prochaines Étapes

### Phase 2 - Extensions
- **Modules manquants** : TB, Nutrition, Laboratoire
- **Cartographie OSM** : intégration vraie carte
- **Import/Export** : templates Excel
- **Notifications push** : alertes temps réel
- **PWA complète** : installation mobile

### Phase 3 - Production
- **Connexion API Django** : backend réel
- **Authentification JWT** : sécurité production
- **Cache offline** : IndexedDB + Service Workers
- **Tests automatisés** : Jest + Testing Library
- **CI/CD** : déploiement automatique

---

## 📞 Support

Pour toute question sur cette démo :
- **Documentation** : voir `/docs` dans le projet
- **Issues** : GitHub issues
- **Contact** : équipe développement PharmaConnect

**🎉 Démonstration prête ! Testez les 4 rôles utilisateurs pour découvrir toutes les fonctionnalités.**