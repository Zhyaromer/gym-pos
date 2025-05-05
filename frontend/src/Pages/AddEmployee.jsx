import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Lock,
  MapPin,
  DollarSign,
  Save,
  ArrowRight,
  Plus,
  Briefcase
} from 'lucide-react';
import Navbar from '../components/layout/Nav';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [calculatedAge, setCalculatedAge] = useState(null);
  
  // Initial form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    secondaryNumber: '',
    gender: 'نێر',
    role: 'کارمەند',
    startWorkingDate: new Date().toISOString().split('T')[0],
    salary: '',
    address: '',
    dateOfBirth: ''
  });

  // Calculate age based on date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dateOfBirth]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'ناوی تەواو پێویستە';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'ئیمەیڵ پێویستە';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'فۆرماتی ئیمەیڵ دروست نییە';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'وشەی نهێنی پێویستە';
    } else if (formData.password.length < 6) {
      errors.password = 'وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'ژمارەی مۆبایل پێویستە';
    } else if (!/^\d{4}-\d{3}-\d{4}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'فۆرماتی ژمارەی مۆبایل دەبێت 0770-123-4567 بێت';
    }
    
    if (formData.secondaryNumber && !/^\d{4}-\d{3}-\d{4}$/.test(formData.secondaryNumber)) {
      errors.secondaryNumber = 'فۆرماتی ژمارەی مۆبایل دەبێت 0770-123-4567 بێت';
    }
    
    if (!formData.gender) {
      errors.gender = 'ڕەگەز پێویستە';
    }
    
    if (!formData.role) {
      errors.role = 'پلە پێویستە';
    }
    
    if (!formData.startWorkingDate) {
      errors.startWorkingDate = 'بەرواری دەستبەکاربوون پێویستە';
    }
    
    if (!formData.salary) {
      errors.salary = 'مووچە پێویستە';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      errors.salary = 'مووچە دەبێت ژمارەیەکی دروست بێت';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'ناونیشان پێویستە';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'بەرواری لەدایکبوون پێویستە';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send this data to your backend
      // For now, we'll just show a success message
      const today = new Date().toISOString().split('T')[0];
      const newEmployee = {
        ...formData,
        id: Math.floor(Math.random() * 1000) + 10, // Generate random ID
        createdAt: today,
        updatedAt: today
      };
      
      console.log('New employee data:', newEmployee);
      setShowSuccessModal(true);
    }
  };

  // Handle adding another employee
  const handleAddAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      secondaryNumber: '',
      gender: 'نێر',
      role: 'کارمەند',
      startWorkingDate: new Date().toISOString().split('T')[0],
      salary: '',
      address: '',
      dateOfBirth: ''
    });
    setCalculatedAge(null);
  };

  // Handle return to overview
  const handleReturnToOverview = () => {
    navigate('/dashboard');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">زیادکردنی کارمەندی نوێ</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 bg-gray-50 p-2 rounded">زانیاری کەسی</h3>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ناوی تەواو <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="ناوی تەواو"
                    />
                  </div>
                  {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
                </div>
                
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ڕەگەز <span className="text-red-500">*</span></label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`pr-4 pl-4 py-2 w-full border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="نێر">نێر</option>
                    <option value="مێ">مێ</option>
                  </select>
                  {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
                </div>
                
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری لەدایکبوون <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  {formErrors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{formErrors.dateOfBirth}</p>}
                  {calculatedAge !== null && (
                    <p className="mt-1 text-sm text-gray-600">تەمەن: {calculatedAge} ساڵ</p>
                  )}
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ناونیشان <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="ناونیشانی نیشتەجێبوون"
                    />
                  </div>
                  {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                </div>
              </div>
              
              {/* Contact Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 bg-gray-50 p-2 rounded">زانیاری پەیوەندی</h3>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ئیمەیڵ <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وشەی نهێنی <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="******"
                    />
                  </div>
                  {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
                </div>
                
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی مۆبایل <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="0770-123-4567"
                    />
                  </div>
                  {formErrors.phoneNumber && <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>}
                </div>
                
                {/* Secondary Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی مۆبایلی دووەم</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="secondaryNumber"
                      value={formData.secondaryNumber}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.secondaryNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="0770-123-4567"
                    />
                  </div>
                  {formErrors.secondaryNumber && <p className="mt-1 text-sm text-red-500">{formErrors.secondaryNumber}</p>}
                </div>
              </div>
            </div>
            
            {/* Employment Information Section */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 bg-gray-50 p-2 rounded mb-6">زانیاری کارکردن</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">پلە <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Briefcase size={18} className="text-gray-400" />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="کارمەند">کارمەند</option>
                      <option value="بەڕێوەبەر">بەڕێوەبەر</option>
                      <option value="ڕاهێنەر">ڕاهێنەر</option>
                      <option value="پاسەوان">پاسەوان</option>
                      <option value="خاوێنکەرەوە">خاوێنکەرەوە</option>
                      <option value="وەرگر">وەرگر</option>
                    </select>
                  </div>
                  {formErrors.role && <p className="mt-1 text-sm text-red-500">{formErrors.role}</p>}
                </div>
                
                {/* Start Working Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری دەستبەکاربوون <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startWorkingDate"
                      value={formData.startWorkingDate}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.startWorkingDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  {formErrors.startWorkingDate && <p className="mt-1 text-sm text-red-500">{formErrors.startWorkingDate}</p>}
                </div>
                
                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مووچە <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2 w-full border ${formErrors.salary ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="500000"
                      min="0"
                      step="1000"
                    />
                  </div>
                  {formErrors.salary && <p className="mt-1 text-sm text-red-500">{formErrors.salary}</p>}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-6 border-t mt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-l from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center justify-center"
              >
                <Save size={18} className="ml-2" />
                تۆمارکردنی کارمەندی نوێ
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-6 text-white">
              <h2 className="text-xl font-bold">سەرکەوتوو بوو!</h2>
              <p className="mt-1">کارمەندی نوێ بە سەرکەوتوویی زیاد کرا.</p>
            </div>
            
            <div className="p-6 space-y-4">
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleAddAnother}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus size={18} className="ml-2" />
                  زیادکردنی کارمەندێکی تر
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