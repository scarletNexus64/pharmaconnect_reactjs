import React, { useState } from 'react';
import { Camera, Upload, User, Calendar, Stethoscope, Phone, Building, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const NewDispensation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [prescriptionPhoto, setPrescriptionPhoto] = useState(null);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    orderNumber: '',
    prescriber: '',
    phone: '',
    service: ''
  });

  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [photoRequired] = useState(true);

  // Données fictives pour la demo
  const availableMedicines = [
    {
      id: 1,
      name: 'Amoxicilline 500mg',
      code: 'AMX-500',
      stock: 145,
      status: 'available',
      expiry: '6 mois',
      price: 2.50,
      batch: 'A123-2024'
    },
    {
      id: 2,
      name: 'Paracétamol 500mg',
      code: 'PAR-500',
      stock: 45,
      status: 'low',
      expiry: '8 mois',
      price: 0.15,
      batch: 'P456-2024'
    },
    {
      id: 3,
      name: 'Artémether 80mg/ml',
      code: 'ART-80',
      stock: 0,
      status: 'out',
      expiry: '-',
      price: 15.20,
      batch: '-'
    },
    {
      id: 4,
      name: 'SRO Sachets',
      code: 'SRO-001',
      stock: 156,
      status: 'available',
      expiry: '12 mois',
      price: 0.35,
      batch: 'S789-2024'
    }
  ];

  const services = [
    'OPD (Consultation Externe)',
    'Urgences',
    'Maternité',
    'Pédiatrie',
    'Chirurgie',
    'Médecine Interne',
    'Autre'
  ];

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrescriptionPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePatientDataChange = (field, value) => {
    setPatientData({ ...patientData, [field]: value });
  };

  const addMedicine = (medicine, quantity) => {
    const existingIndex = selectedMedicines.findIndex(m => m.id === medicine.id);
    if (existingIndex >= 0) {
      const updated = [...selectedMedicines];
      updated[existingIndex].quantity = quantity;
      setSelectedMedicines(updated);
    } else {
      setSelectedMedicines([...selectedMedicines, { ...medicine, quantity }]);
    }
  };

  const removeMedicine = (medicineId) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.id !== medicineId));
  };

  const getTotalAmount = () => {
    return selectedMedicines.reduce((total, med) => total + (med.price * med.quantity), 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'out': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '🟢';
      case 'low': return '🟡';
      case 'out': return '🔴';
      default: return '⚪';
    }
  };

  const canProceedToStep2 = prescriptionPhoto !== null;
  const canProceedToStep3 = patientData.name && patientData.age && patientData.gender && 
                            patientData.orderNumber && patientData.prescriber;
  const canCompleteDispensation = selectedMedicines.length > 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle Dispensation</h1>
        <p className="text-gray-600 mt-1">Processus guidé de dispensation avec photo d'ordonnance obligatoire</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[
            { number: 1, title: 'Photo Ordonnance', required: true },
            { number: 2, title: 'Informations Patient', required: true },
            { number: 3, title: 'Sélection Médicaments', required: false }
          ].map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3 mr-8">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                  {step.required && <span className="text-red-500 ml-1">*</span>}
                </p>
              </div>
              {index < 2 && (
                <div className={`w-16 h-0.5 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                } mr-8`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Étape 1: Photo Ordonnance */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📱 ÉTAPE 1: PHOTO ORDONNANCE OBLIGATOIRE</h2>
              <p className="text-gray-600">Prenez une photo claire de l'ordonnance avant de continuer</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {!prescriptionPhoto ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="camera-input" className="cursor-pointer">
                        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center">
                          <Camera className="w-5 h-5 mr-2" />
                          📷 Prendre Photo
                        </div>
                      </label>
                      <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="text-gray-500">ou</div>
                    
                    <div>
                      <label htmlFor="file-input" className="cursor-pointer">
                        <div className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-flex items-center">
                          <Upload className="w-5 h-5 mr-2" />
                          📁 Choisir Fichier
                        </div>
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                      <div className="flex items-center text-red-800">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">⚠️ Photo obligatoire pour continuer</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">
                        Selon les protocoles, toute dispensation doit être accompagnée d'une photo d'ordonnance pour traçabilité.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">✅ Photo d'ordonnance capturée avec succès</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative max-w-md mx-auto">
                    <img 
                      src={prescriptionPhoto} 
                      alt="Ordonnance" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
                    />
                    <button
                      onClick={() => setPrescriptionPhoto(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="text-center space-x-4">
                    <button
                      onClick={() => setPrescriptionPhoto(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      🔄 Reprendre
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étape 2: Informations Patient */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 ÉTAPE 2: INFORMATIONS PATIENT</h2>
              <p className="text-gray-600">Renseignez les informations obligatoires du patient</p>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Nom du patient <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => handlePatientDataChange('name', e.target.value)}
                  placeholder="Nom complet du patient"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎂 Âge <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={(e) => handlePatientDataChange('age', e.target.value)}
                  placeholder="Âge en années"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚥ Sexe <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="M"
                      checked={patientData.gender === 'M'}
                      onChange={(e) => handlePatientDataChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <span>Masculin</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="F"
                      checked={patientData.gender === 'F'}
                      onChange={(e) => handlePatientDataChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <span>Féminin</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 N° Ordonnance <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientData.orderNumber}
                  onChange={(e) => handlePatientDataChange('orderNumber', e.target.value)}
                  placeholder="Ex: OPD-2024-1052"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👨‍⚕️ Prescripteur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientData.prescriber}
                  onChange={(e) => handlePatientDataChange('prescriber', e.target.value)}
                  placeholder="Nom du médecin/infirmier"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={patientData.phone}
                  onChange={(e) => handlePatientDataChange('phone', e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏥 Service origine (optionnel)
                </label>
                <select
                  value={patientData.service}
                  onChange={(e) => handlePatientDataChange('service', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>

            {!canProceedToStep3 && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center text-yellow-800">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Champs obligatoires manquants</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Veuillez remplir tous les champs marqués d'un astérisque (*) pour continuer.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Sélection Médicaments */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                <h3 className="font-semibold text-green-800">👤 Patient: {patientData.name}</h3>
                <p className="text-green-700 text-sm">📋 Ordonnance: #{patientData.orderNumber} | 👨‍⚕️ {patientData.prescriber}</p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">💊 ÉTAPE 3: SÉLECTION MÉDICAMENTS</h2>
              <p className="text-gray-600">Sélectionnez les médicaments à dispenser</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Liste des médicaments disponibles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Médicaments Disponibles</h3>
                <div className="space-y-3">
                  {availableMedicines.map((medicine) => (
                    <div key={medicine.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                          <p className="text-sm text-gray-600">{medicine.code}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medicine.status)}`}>
                          {getStatusIcon(medicine.status)} {
                            medicine.status === 'available' ? 'Disponible' :
                            medicine.status === 'low' ? 'Stock faible' : 'Rupture'
                          }
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <span className="font-medium ml-1">{medicine.stock} unités</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiration:</span>
                          <span className="font-medium ml-1">{medicine.expiry}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Prix:</span>
                          <span className="font-medium ml-1">{medicine.price}€</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lot:</span>
                          <span className="font-medium ml-1 font-mono text-xs">{medicine.batch}</span>
                        </div>
                      </div>

                      {medicine.status !== 'out' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={medicine.stock}
                            placeholder="Quantité"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value);
                              if (quantity > 0) {
                                addMedicine(medicine, quantity);
                              }
                            }}
                          />
                          <button
                            onClick={() => addMedicine(medicine, 1)}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Ajouter
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full px-3 py-2 bg-gray-300 text-gray-500 rounded text-sm cursor-not-allowed"
                        >
                          ❌ Non disponible
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Panier de dispensation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛒 Panier Dispensation</h3>
                
                {selectedMedicines.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Aucun médicament sélectionné</p>
                    <p className="text-sm text-gray-500 mt-1">Ajoutez des médicaments depuis la liste</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedMedicines.map((medicine) => (
                      <div key={medicine.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                            <p className="text-sm text-gray-600">
                              {medicine.quantity} × {medicine.price}€ = {(medicine.quantity * medicine.price).toFixed(2)}€
                            </p>
                          </div>
                          <button
                            onClick={() => removeMedicine(medicine.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Lot: {medicine.batch} | Exp: {medicine.expiry}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">💰 Total:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {getTotalAmount().toFixed(2)}€
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        📦 {selectedMedicines.length} article(s) sélectionné(s)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg ${
              currentStep === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={(currentStep === 1 && !canProceedToStep2) || (currentStep === 2 && !canProceedToStep3)}
              className={`flex items-center px-6 py-3 rounded-lg ${
                (currentStep === 1 && !canProceedToStep2) || (currentStep === 2 && !canProceedToStep3)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Continuer → {currentStep === 1 ? 'Informations Patient' : 'Sélection Médicaments'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => alert('Dispensation validée ! Redirection vers l\'historique...')}
              disabled={!canCompleteDispensation}
              className={`flex items-center px-6 py-3 rounded-lg ${
                !canCompleteDispensation
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              ✅ Valider Dispensation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDispensation;