import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Phone,
  Save,
  ArrowRight,
  Plus,
  Dumbbell,
  Droplets,
  CreditCard
} from 'lucide-react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function AddMemberPage() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const res = await axios.get("http://localhost:3000/membership_plans/get_plans");

        const prices = {
          gym: {},
          pool: {},
          both: {}
        };

        const mapType = (type) => {
          if (type === "هۆلی وەرزشی") return "gym";
          if (type === "مەلەوانگە") return "pool";
          if (type === "مەلەوانگە و هۆلی وەرزشی") return "both";
          return null;
        };

        Object.values(res.data).forEach(planGroup => {
          const typeKey = mapType(planGroup.type);
          if (!typeKey) return;

          planGroup.plans.forEach(plan => {
            const priceValue = parseInt(plan.price.replace('.', '').replace(',', ''));

            if (plan.duration.includes("ساڵ")) {
              prices[typeKey]['ساڵانە'] = priceValue;
            } else {
              prices[typeKey][plan.duration] = priceValue;
            }
          });
        });

        setPlans(prices);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    getPlans();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergencyPhone: '',
    membership: 'پلانی مانگی',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    gender: 'پیاو',
    accessLevel: '',
    height: '',
    weight: '',
    status: 'active'
  });

  const calculateEndDate = (startDate, membershipType) => {
    const date = new Date(startDate);
    let daysToAdd = 0;

    if (membershipType === "پلانی مانگی") {
      daysToAdd = 30;
    } else if (membershipType === "پلانی سێ مانگ") {
      daysToAdd = 90;
    } else if (membershipType === "پلانی شەش مانگ") {
      daysToAdd = 180;
    } else if (membershipType === "ساڵانە") {
      daysToAdd = 365;
    }

    date.setTime(date.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));

    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (formData.startDate && formData.membership) {
      const endDate = calculateEndDate(formData.startDate, formData.membership);
      setFormData(prev => ({ ...prev, endDate }));
    }
  }, [formData.startDate, formData.membership]);

  useEffect(() => {
    if (formData.membership && formData.accessLevel) {
      const price = plans[formData.accessLevel][formData.membership] || 0;
      console.log(price);
      setCalculatedPrice(price);
    } else {
      setCalculatedPrice(0);
    }
  }, [formData.membership, formData.accessLevel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'ناوی ئەندام پێویستە';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'ژمارەی مۆبایل پێویستە';
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      errors.phone = 'ژمارەی مۆبایل دەبێت 10 یان 11 ژمارە بێت';
    }

    if (formData.emergencyPhone && !/^\d{10,11}$/.test(formData.emergencyPhone)) {
      errors.emergencyPhone = 'ژمارەی فۆرسا دەبێت 10 یان 11 ژمارە بێت';
    }

    if (!formData.gender) {
      errors.gender = 'ڕەگەز پێویستە';
    }

    if (!formData.membership) {
      errors.membership = 'جۆری ئەندامێتی پێویستە';
    }

    if (!formData.accessLevel) {
      errors.accessLevel = 'ئاستی دەستگەیشتن پێویستە';
    }

    if (!formData.startDate) {
      errors.startDate = 'بەرواری دەستپێک پێویستە';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let access = "هۆلی وەرزشی";

      if (formData.accessLevel === "gym") {
        access = "هۆلی وەرزشی";
      } else if (formData.accessLevel === "pool") {
        access = "مەلەوانگە";
      } else if (formData.accessLevel === "both") {
        access = "مەلەوانگە و هۆلی وەرزشی";
      }

      const data = {
        name: formData.name,
        phoneNumber: formData.phone,
        emergencyphoneNumber: formData.emergencyPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        membership: formData.membership,
        accessLevel: access
      }
      const res = await axios.post("http://localhost:3000/members/addmember", data);

      if (res.status === 200) {
        setFormData({
          name: '',
          phone: '',
          emergencyPhone: '',
          membership: 'پلانی مانگی',
          startDate: new Date().toISOString().split('T')[0],
          endDate: calculateEndDate(new Date().toISOString().split('T')[0], 'پلانی مانگی'),
          gender: 'پیاو',
          accessLevel: '',
          height: '',
          weight: '',
          status: 'active'
        });
      }

      setCalculatedPrice(0);
      setShowSuccessModal(true);
    }
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      name: '',
      phone: '',
      emergencyPhone: '',
      membership: 'پلانی مانگی',
      startDate: new Date().toISOString().split('T')[0],
      endDate: calculateEndDate(new Date().toISOString().split('T')[0], 'پلانی مانگی'),
      gender: 'پیاو',
      accessLevel: '',
      height: '',
      weight: '',
      status: 'active'
    });
    setPreviewImage(null);
    setCalculatedPrice(0);
  };

  const handleReturnToOverview = () => {
    navigate('/dashboard');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-indigo-700">زیادکردنی ئەندامی نوێ</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <User size={18} className="ml-2 text-indigo-600" />
                  زانیاری کەسی
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ناوی تەواو <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                      placeholder="ناوی تەواو"
                    />
                  </div>
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ڕەگەز <span className="text-red-500">*</span></label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`pr-4 pl-4 py-2 w-full border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                  >
                    <option value="پیاو">پیاو</option>
                    <option value="ئافرەت">ئافرەت</option>
                  </select>
                  {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی مۆبایل <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                      placeholder="0770-123-4567"
                    />
                  </div>
                  {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆنی کاتی نائاسایی</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.emergencyPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                      placeholder="0770-123-4567"
                    />
                  </div>
                  {formErrors.emergencyPhone && <p className="mt-1 text-sm text-red-500">{formErrors.emergencyPhone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بەرزی</label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="pr-4 pl-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="165cm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">کێش</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="pr-4 pl-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="70kg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <CreditCard size={18} className="ml-2 text-indigo-600" />
                  زانیاری ئەندامێتی
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">جۆری ئەندامێتی <span className="text-red-500">*</span></label>
                  <select
                    name="membership"
                    value={formData.membership}
                    onChange={handleInputChange}
                    className={`pr-4 pl-4 py-2 w-full border ${formErrors.membership ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                  >
                    <option value="پلانی مانگی">پلانی مانگی</option>
                    <option value="پلانی سێ مانگ">پلانی سێ مانگ</option>
                    <option value="پلانی شەش مانگ">پلانی شەش مانگ</option>
                    <option value="ساڵانە">ساڵانە</option>
                  </select>
                  {formErrors.membership && <p className="mt-1 text-sm text-red-500">{formErrors.membership}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ئاستی دەستگەیشتن <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'accessLevel', value: 'gym' } })}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.accessLevel === 'gym' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      <Dumbbell size={24} className={formData.accessLevel === 'gym' ? 'text-indigo-600' : 'text-gray-500'} />
                      <span className="mt-1 text-sm">هۆڵی وەرزشی</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'accessLevel', value: 'pool' } })}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.accessLevel === 'pool' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      <Droplets size={24} className={formData.accessLevel === 'pool' ? 'text-indigo-600' : 'text-gray-500'} />
                      <span className="mt-1 text-sm">مەلەوانگە</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'accessLevel', value: 'both' } })}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.accessLevel === 'both' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className="flex">
                        <Dumbbell size={20} className={formData.accessLevel === 'both' ? 'text-indigo-600' : 'text-gray-500'} />
                        <Droplets size={20} className={formData.accessLevel === 'both' ? 'text-indigo-600' : 'text-gray-500'} />
                      </div>
                      <span className="mt-1 text-sm">هەردووکیان</span>
                    </button>
                  </div>
                  {formErrors.accessLevel && <p className="mt-1 text-sm text-red-500">{formErrors.accessLevel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری دەستپێک <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                    />
                  </div>
                  {formErrors.startDate && <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری کۆتایی</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      readOnly
                      className="pr-10 pl-4 py-2 w-full border border-gray-300 bg-gray-50 rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">بەرواری کۆتایی بەپێی جۆری ئەندامێتی دیاری دەکرێت</p>
                </div>

                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h4 className="text-md font-medium text-indigo-700 mb-2">نرخی ئەندامێتی</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">کۆی گشتی:</span>
                    <span className="text-2xl font-bold text-indigo-700">{formatPrice(calculatedPrice)} IQD</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-l from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center justify-center shadow-md"
                  >
                    <Save size={18} className="ml-2" />
                    تۆمارکردنی ئەندامی نوێ
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-6 text-white">
              <h2 className="text-xl font-bold">سەرکەوتوو بوو!</h2>
              <p className="mt-1">ئەندامی نوێ بە سەرکەوتوویی زیاد کرا.</p>
            </div>

            <div className="p-6 space-y-4">

              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleAddAnother}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  زیادکردنی ئەندامێکی تر
                  <Plus size={18} className="mr-2" />
                </button>

                <button
                  onClick={handleReturnToOverview}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  <ArrowRight size={18} className="ml-2" />
                  گەڕانەوە بۆ سەرەتا
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}