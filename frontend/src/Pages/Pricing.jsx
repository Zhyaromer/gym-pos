import { useState, useEffect } from 'react';
import { Waves, Dumbbell, Settings, Save, X } from 'lucide-react';

export default function PricingPage() {
  // Service icons mapping - separate from the data structure
  const serviceIcons = {
    gym: <Dumbbell className="w-8 h-8" />,
    pool: <Waves className="w-8 h-8" />,
    combined: (
      <div className="flex">
        <Dumbbell className="w-8 h-8" />
        <Waves className="w-8 h-8 ml-1" />
      </div>
    )
  };

  // Default pricing data - no React elements here
  const defaultPricing = {
    gym: {
      title: 'هۆڵی وەرزشی',
      type: 'gym',
      plans: [
        { duration: '1 مانگ', price: '50,000', id: 'gym-month' },
        { duration: '3 مانگ', price: '140,000', id: 'gym-3month', saving: '%7 کەمکردنەوە' },
        { duration: '6 مانگ', price: '270,000', id: 'gym-6month', saving: '%10 کەمکردنەوە' },
        { duration: '1 ساڵ', price: '500,000', id: 'gym-year', saving: '%17 کەمکردنەوە' },
      ]
    },
    pool: {
      title: 'مەلەوانگە',
      type: 'pool',
      plans: [
        { duration: '1 مانگ', price: '60,000', id: 'pool-month' },
        { duration: '3 مانگ', price: '170,000', id: 'pool-3month', saving: '%6 کەمکردنەوە' },
        { duration: '6 مانگ', price: '330,000', id: 'pool-6month', saving: '%8 کەمکردنەوە' },
        { duration: '1 ساڵ', price: '600,000', id: 'pool-year', saving: '%17 کەمکردنەوە' },
      ]
    },
    combined: {
      title: 'هۆڵی وەرزشی و مەلەوانگە',
      type: 'combined',
      plans: [
        { duration: '1 مانگ', price: '100,000', id: 'combined-month', saving: '%10 کەمکردنەوە' },
        { duration: '3 مانگ', price: '280,000', id: 'combined-3month', saving: '%15 کەمکردنەوە' },
        { duration: '6 مانگ', price: '540,000', id: 'combined-6month', saving: '%17 کەمکردنەوە' },
        { duration: '1 ساڵ', price: '960,000', id: 'combined-year', saving: '%20 کەمکردنەوە' },
      ]
    }
  };

  // State for services
  const [services, setServices] = useState(() => {
    // Try to load from localStorage first
    try {
      const savedPricing = localStorage.getItem('gymPricing');
      return savedPricing ? JSON.parse(savedPricing) : defaultPricing;
    } catch (error) {
      console.error("Error loading pricing data:", error);
      return defaultPricing;
    }
  });
  
  const [selectedTab, setSelectedTab] = useState('gym');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedServices, setEditedServices] = useState({});
  
  // Save to localStorage whenever services changes
  useEffect(() => {
    try {
      localStorage.setItem('gymPricing', JSON.stringify(services));
    } catch (error) {
      console.error("Error saving pricing data:", error);
    }
  }, [services]);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // When exiting edit mode without saving
      setIsEditMode(false);
      setEditedServices({});
    } else {
      // When entering edit mode, copy current services to edited services
      setIsEditMode(true);
      setEditedServices(JSON.parse(JSON.stringify(services)));
    }
  };

  const handleSaveChanges = () => {
    setServices(editedServices);
    setIsEditMode(false);
    // Show a temporary success message (you could add this as a state)
  };

  const handlePriceChange = (serviceKey, planIndex, value) => {
    setEditedServices(prev => {
      const updated = {...prev};
      updated[serviceKey].plans[planIndex].price = value;
      return updated;
    });
  };

  const handleSavingChange = (serviceKey, planIndex, value) => {
    setEditedServices(prev => {
      const updated = {...prev};
      updated[serviceKey].plans[planIndex].saving = value;
      return updated;
    });
  };

  const resetToDefaults = () => {
    if (window.confirm('هەموو نرخەکان دەگەڕێنەوە بۆ بنەڕەت. دڵنیایت؟')) {
      setServices(defaultPricing);
      localStorage.setItem('gymPricing', JSON.stringify(defaultPricing));
      if (isEditMode) {
        setEditedServices(JSON.parse(JSON.stringify(defaultPricing)));
      }
    }
  };

  // Function to format prices (adding د.ع)
  const formatPrice = (price) => {
    return `${price} د.ع`;
  };

  const displayedServices = isEditMode ? editedServices : services;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center relative">
          <h1 className="text-4xl font-bold mb-3 text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">سیستەمی نرخی باشگا</h1>
          <p className="text-gray-600 text-lg">تکایە جۆری خزمەتگوزاری و ماوەکەی هەڵبژێرە</p>
          
          {/* Admin Controls */}
          <div className="absolute top-0 left-0 flex gap-2">
            {isEditMode ? (
              <>
                <button 
                  onClick={handleSaveChanges}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
                >
                  <Save size={18} />
                  <span>هەڵگرتن</span>
                </button>
                <button 
                  onClick={toggleEditMode}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
                >
                  <X size={18} />
                  <span>پوچەڵکردنەوە</span>
                </button>
              </>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                <Settings size={18} />
                <span>گۆڕینی نرخەکان</span>
              </button>
            )}
            {isEditMode && (
              <button 
                onClick={resetToDefaults}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                گەڕانەوە بۆ نرخی بنەڕەت
              </button>
            )}
          </div>
        </header>

        {/* Service Type Tabs */}
        <div className="flex mb-8 bg-white rounded-xl shadow-lg p-2 border border-gray-100">
          {Object.keys(displayedServices).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`flex-1 py-4 px-4 flex items-center justify-center gap-3 rounded-lg transition-all ${
                selectedTab === key
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`${selectedTab === key ? 'text-white' : 'text-blue-500'}`}>
                {serviceIcons[key]}
              </div>
              <span className="text-lg">{displayedServices[key].title}</span>
            </button>
          ))}
        </div>

        {/* Selected Service Info */}
        <div className="mb-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">{displayedServices[selectedTab].title}</h2>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedServices[selectedTab].plans.map((plan, index) => (
              <div 
                key={plan.id}
                onClick={() => !isEditMode && handleSelectPlan(plan.id)}
                className={`rounded-xl p-6 ${!isEditMode ? 'cursor-pointer' : ''} transition-all transform ${
                  !isEditMode && 'hover:-translate-y-1'
                } ${
                  selectedPlan === plan.id && !isEditMode
                    ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-400 shadow-md' 
                    : 'bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.duration}</h3>
                  
                  {isEditMode ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={plan.saving || ''}
                        onChange={(e) => handleSavingChange(selectedTab, index, e.target.value)}
                        className="w-full text-sm px-3 py-1 rounded border border-gray-300 text-center"
                        placeholder="کەمکردنەوە (بۆ نموونە: %10 کەمکردنەوە)"
                      />
                    </div>
                  ) : plan.saving && (
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mt-2 font-medium">
                      {plan.saving}
                    </span>
                  )}
                </div>
                
                <div className="text-center mb-3">
                  {isEditMode ? (
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => handlePriceChange(selectedTab, index, e.target.value)}
                        className="text-center text-2xl font-bold text-blue-600 border-b-2 border-blue-300 p-1 w-32"
                      />
                      <span className="text-2xl font-bold text-blue-600 ml-1">د.ع</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">{formatPrice(plan.price)}</span>
                  )}
                </div>
                <div className={`h-1 w-16 mx-auto mb-2 rounded ${selectedPlan === plan.id && !isEditMode ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Cashier Controls */}
        {selectedPlan && !isEditMode && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">پوختەی پارەدان</h3>
                <p className="text-gray-600 text-lg">
                  خزمەتگوزاری: <span className="font-medium">{services[selectedTab].title}</span> | 
                  ماوە: <span className="font-medium">{services[selectedTab].plans.find(p => p.id === selectedPlan).duration}</span>
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-3 bg-blue-50 inline-block px-4 py-2 rounded-lg">
                  کۆی گشتی: {formatPrice(services[selectedTab].plans.find(p => p.id === selectedPlan).price)}
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-lg font-bold transition-colors shadow-md">
                  تەواوکردنی پارەدان
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}