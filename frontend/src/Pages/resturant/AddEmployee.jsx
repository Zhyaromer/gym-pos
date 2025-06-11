import { useState, useEffect, useRef } from 'react';
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
  Briefcase,
  Eye,
  EyeOff,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Navbar from '../../components/layout/Nav';
import axios from 'axios';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    secondaryNumber: '',
    gender: 'پیاو',
    role: 'کارمەند',
    startWorkingDate: new Date().toISOString().split('T')[0],
    salary: '',
    address: '',
    dateOfBirth: '',
    profileImage: null
  });

  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dateOfBirth]);

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/\d/.test(formData.password)) strength += 1;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 1;

      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber' || name === 'secondaryNumber') {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setFormErrors({
          ...formErrors,
          profileImage: 'تەنیا وێنە ڕێگەپێدراوە'
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          profileImage: 'قەبارەی وێنە دەبێت کەمتر لە 2MB بێت'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          profileImage: file
        });
      };
      reader.readAsDataURL(file);

      if (formErrors.profileImage) {
        setFormErrors({
          ...formErrors,
          profileImage: ''
        });
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      profileImage: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    } else if (formData.password.length < 8) {
      errors.password = 'وشەی نهێنی دەبێت لانیکەم ٨ پیت بێت';
    } else if (passwordStrength < 3) {
      errors.password = 'وشەی نهێنی زۆر بەهێز نییە';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'ژمارەی مۆبایل پێویستە';
    } else if (!/^(07|7)\d{8,9}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'ژمارەی مۆبایل دەبێت لە 10 یان 11 ژمارە پێکبێت و بە 07 یان 7 دەستپێبکات';
    }
    
    if (formData.secondaryNumber && !/^(07|7)\d{8,9}$/.test(formData.secondaryNumber)) {
      errors.secondaryNumber = 'ژمارەی دووەمی مۆبایل دەبێت لە 10 یان 11 ژمارە پێکبێت و بە 07 یان 7 دەستپێبکات';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const employeeData = new FormData();

        Object.keys(formData).forEach(key => {
          if (key === 'profileImage' && formData[key]) {
            employeeData.append('profileImage', formData[key]);
          } else {
            employeeData.append(key, formData[key]);
          }
        });

        const res = await axios.post(`http://localhost:3000/employees/addemployee`, employeeData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          }
        });

        if (res.status === 201) {
          setShowSuccessModal(true);
        }
      } catch (error) {
        console.error('Error adding employee:', error);
        setFormErrors({
          ...formErrors,
          general: error.message || 'Failed to add employee. Please try again.'
        });
      }
    }
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      secondaryNumber: '',
      gender: 'پیاو',
      role: 'کارمەند',
      startWorkingDate: new Date().toISOString().split('T')[0],
      salary: '',
      address: '',
      dateOfBirth: '',
      profileImage: null
    });
    setCalculatedAge(null);
    setImagePreview(null);
    setPasswordStrength(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReturnToOverview = () => {
    navigate('/dashboard');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-200 text-gray-800">زیادکردنی کارمەندی نوێ</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <ImageIcon size={40} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="profileImage"
                />
                <label
                  htmlFor="profileImage"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <ImageIcon size={16} className="ml-2" />
                  {imagePreview ? 'گۆڕینی وێنە' : 'وێنەی پڕۆفایل زیادبکە'}
                </label>
              </div>
              {formErrors.profileImage && (
                <p className="mt-2 text-sm text-red-500">{formErrors.profileImage}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 bg-blue-50 p-3 rounded-lg">زانیاری کەسی</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ناوی تەواو <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="ناوی تەواو"
                    />
                  </div>
                  {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ڕەگەز <span className="text-red-500">*</span></label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`pr-4 pl-4 py-2.5 w-full border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  >
                    <option value="پیاو">پیاو</option>
                    <option value="ئافرەت">ئافرەت</option>
                  </select>
                  {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">بەرواری لەدایکبوون <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    />
                  </div>
                  {formErrors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{formErrors.dateOfBirth}</p>}
                  {calculatedAge !== null && (
                    <p className="mt-1 text-sm text-gray-600">تەمەن: {calculatedAge} ساڵ</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ناونیشان <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="ناونیشانی نیشتەجێبوون"
                    />
                  </div>
                  {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 bg-blue-50 p-3 rounded-lg">زانیاری پەیوەندی</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ئیمەیڵ <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وشەی نهێنی <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="لانیکەم ٨ پیت"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1">
                        <div className={`h-1.5 rounded-full flex-1 ${passwordStrength >= 1 ? (passwordStrength >= 3 ? 'bg-green-500' : passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-gray-200'}`}></div>
                        <div className={`h-1.5 rounded-full flex-1 ${passwordStrength >= 2 ? (passwordStrength >= 3 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-gray-200'}`}></div>
                        <div className={`h-1.5 rounded-full flex-1 ${passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`h-1.5 rounded-full flex-1 ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      </div>
                      <p className="text-xs mt-1 text-gray-500">
                        {passwordStrength === 0 && 'وشەی نهێنی زۆر بەهێز نییە'}
                        {passwordStrength === 1 && 'وشەی نهێنی لاوازە'}
                        {passwordStrength === 2 && 'وشەی نهێنی مامناوەندە'}
                        {passwordStrength === 3 && 'وشەی نهێنی بەهێزە'}
                        {passwordStrength >= 4 && 'وشەی نهێنی زۆر بەهێزە'}
                      </p>
                    </div>
                  )}
                  {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
                  <p className="text-xs mt-1 text-gray-500">
                    پێویستە لانیکەم ٨ پیت، یەک پیتی گەورە، یەک ژمارە و یەک سیمبوول(هێما)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ژمارەی مۆبایل <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={(formData.phoneNumber)}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="07701234567"
                      maxLength={11}
                    />
                  </div>
                  {formErrors.phoneNumber && <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ژمارەی مۆبایلی دووەم</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="secondaryNumber"
                      value={(formData.secondaryNumber)}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.secondaryNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="07701234567"
                      maxLength={11}
                    />
                  </div>
                  {formErrors.secondaryNumber && <p className="mt-1 text-sm text-red-500">{formErrors.secondaryNumber}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 bg-blue-50 p-3 rounded-lg mb-6">زانیاری کارکردن</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">پلە <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Briefcase size={18} className="text-gray-400" />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">بەرواری دەستبەکاربوون <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startWorkingDate"
                      value={formData.startWorkingDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.startWorkingDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    />
                  </div>
                  {formErrors.startWorkingDate && <p className="mt-1 text-sm text-red-500">{formErrors.startWorkingDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مووچە <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`pr-10 pl-4 py-2.5 w-full border ${formErrors.salary ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="500000"
                      min="0"
                      step="1000"
                    />
                  </div>
                  {formErrors.salary && <p className="mt-1 text-sm text-red-500">{formErrors.salary}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t mt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-l from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <Save size={18} className="ml-2" />
                تۆمارکردنی کارمەندی نوێ
              </button>
            </div>
          </form>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-6 text-white">
              <h2 className="text-xl font-bold">سەرکەوتوو بوو!</h2>
              <p className="mt-1">کارمەندی نوێ بە سەرکەوتوویی زیاد کرا.</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleAddAnother}
                  className="bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow hover:shadow-md"
                >
                  زیادکردنی کارمەندێکی تر
                  <Plus size={18} />
                </button>

                <button
                  onClick={handleReturnToOverview}
                  className="bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200 hover:border-gray-300"
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