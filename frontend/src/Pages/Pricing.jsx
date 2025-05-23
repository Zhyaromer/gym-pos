import { useState, useEffect } from 'react';
import { Waves, Dumbbell, Settings, Save, X } from 'lucide-react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function PricingPage() {
  const serviceIcons = {
    'هۆلی وەرزشی': <Dumbbell className="w-8 h-8" />,
    'مەلەوانگە': <Waves className="w-8 h-8" />,
    'مەلەوانگە و هۆلی وەرزشی': (
      <div className="flex">
        <Dumbbell className="w-8 h-8" />
        <Waves className="w-8 h-8 ml-1" />
      </div>
    )
  };

  const [services, setServices] = useState({});
  const [selectedTab, setSelectedTab] = useState('هۆلی وەرزشی');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedServices, setEditedServices] = useState({});
  const [modifiedPlans, setModifiedPlans] = useState(new Set());

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/membership_plans/get_plans`);
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      }
    }

    fetchPricingData();
  }, [])

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditedServices({});
      setModifiedPlans(new Set());
    } else {
      setIsEditMode(true);
      setEditedServices(JSON.parse(JSON.stringify(services)));
      setModifiedPlans(new Set()); 
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatePromises = [];
      
      for (const serviceKey in editedServices) {
        for (const plan of editedServices[serviceKey].plans) {
          if (modifiedPlans.has(plan.mp_id)) {
            updatePromises.push(
              axios.patch(`http://localhost:3000/membership_plans/update_plan/${plan.mp_id}`, {
                title: plan.duration,
                duration: plan.duration.includes('ساڵانە') ? 12 : parseInt(plan.duration),
                free_pool_entries: plan.free_pool_entries || 0,
                price: plan.price
              })
            );
          }
        }
      }
      
      await Promise.all(updatePromises);
      
      setServices(editedServices);
      setIsEditMode(false);
      setModifiedPlans(new Set());
      
      console.log(`Updated ${updatePromises.length} plans successfully`);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("هەڵەیەک ڕوویدا لە کاتی هەڵگرتنی گۆڕانکاریەکان");
    }
  };

  const handlePriceChange = (serviceKey, planIndex, value) => {
    const planId = editedServices[serviceKey].plans[planIndex].mp_id;
    
    setEditedServices(prev => {
      const updated = { ...prev };
      updated[serviceKey].plans[planIndex].price = value;
      return updated;
    });
    
    setModifiedPlans(prev => new Set([...prev, planId]));
  };

  const handlePoolEntriesChange = (serviceKey, planIndex, value) => {
    const planId = editedServices[serviceKey].plans[planIndex].mp_id;
    
    setEditedServices(prev => {
      const updated = { ...prev };
      updated[serviceKey].plans[planIndex].free_pool_entries = value;
      return updated;
    });
    
    setModifiedPlans(prev => new Set([...prev, planId]));
  };

  const formatPrice = (price) => {
    return `${price} د.ع`;
  };

  const displayedServices = isEditMode ? editedServices : services;

  return (
    <div>
      <Navbar />

      <div className="bg-gradient-to-b from-blue-50 to-gray-100 p-6 font-sans" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 text-center relative">
            <h1 className="text-4xl font-bold mb-3 text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">سیستەمی نرخی باشگا</h1>
            <p className="text-gray-600 text-lg">تکایە جۆری خزمەتگوزاری و ماوەکەی هەڵبژێرە</p>

            <div className="absolute top-0 left-0 flex gap-2">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => handleSaveChanges()}
                    disabled={modifiedPlans.size === 0}
                    className={`flex items-center gap-1 py-2 px-4 rounded-lg shadow-md transition-colors ${
                      modifiedPlans.size > 0 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Save size={18} />
                    <span>هەڵگرتن ({modifiedPlans.size})</span>
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
            </div>
          </header>

          <div className="flex mb-8 bg-white rounded-xl shadow-lg p-2 border border-gray-100">
            {Object.keys(displayedServices).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`flex-1 py-4 px-4 flex items-center justify-center gap-3 rounded-lg transition-all ${selectedTab === key
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md'
                  : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <div className={`${selectedTab === key ? 'text-white' : 'text-blue-500'}`}>
                  {serviceIcons[key]}
                </div>
                <span className="text-lg">{displayedServices[key]?.type}</span>
              </button>
            ))}
          </div>

          <div className="mb-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">{displayedServices[selectedTab]?.type}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedServices[selectedTab]?.plans.map((plan, index) => (
                <div
                  key={plan.id}
                  onClick={() => !isEditMode && handleSelectPlan(plan.mp_id)}
                  className={`rounded-xl p-6 ${!isEditMode ? 'cursor-pointer' : ''} transition-all transform ${!isEditMode && 'hover:-translate-y-1'
                    } ${selectedPlan === plan.mp_id && !isEditMode
                      ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-400 shadow-md'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                    } ${isEditMode && modifiedPlans.has(plan.mp_id) ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{plan.duration}</h3>
                    {isEditMode && modifiedPlans.has(plan.mp_id) && (
                      <div className="text-xs text-yellow-600 mt-1">گۆڕراوە</div>
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
                  
                  <div className="text-center mb-3">
                    <p className="text-gray-600 mb-1">چوونە ژوورەوەی مەلەوانگەی بەخۆڕایی</p>
                    {isEditMode ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          min="0"
                          value={plan.free_pool_entries || 0}
                          onChange={(e) => handlePoolEntriesChange(selectedTab, index, e.target.value)}
                          className="text-center text-lg font-medium text-blue-600 border-b-2 border-blue-300 p-1 w-20"
                        />
                        <span className="text-lg font-medium text-blue-600 ml-1">جار</span>
                      </div>
                    ) : (
                      <span className="text-xl font-medium text-blue-600">{plan.free_pool_entries || 0} جار</span>
                    )}
                  </div>
                  
                  <div className={`h-1 w-16 mx-auto mb-2 rounded ${selectedPlan === plan.mp_id && !isEditMode ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}