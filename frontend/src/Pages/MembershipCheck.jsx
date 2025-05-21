import { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Dumbbell,
  Phone,
  CreditCard,
  Clock,
  Droplets,
  Plus,
  Gift,
  Trash2,
  GlassWater,
  DatabaseIcon,
  Edit,
  AlertCircle,
  Calendar,
  User2,
  ShieldCheck,
  X,
  RefreshCw,
  LockIcon,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/layout/Nav';
import EditMemberModal from '../components/ui/EditMemberModal';
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

export default function MembershipCheck() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [renewalData, setRenewalData] = useState({
    membership: "1 مانگ",
    accessLevel: 'gym',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  const [showPoolEntryModal, setShowPoolEntryModal] = useState(false);
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [plans, setPlans] = useState({
    gym: {},
    pool: {},
    both: {}
  });

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

        res.data.forEach(plan => {
          const typeKey = mapType(plan.type);
          if (!typeKey) return;

          const durationKey = `${plan.duration} مانگ`;
          const priceValue = parseInt(plan.price.replace('.', '').replace(',', ''));

          if (plan.duration === 12) {
            prices[typeKey]['ساڵانە'] = priceValue;
          } else {
            prices[typeKey][durationKey] = priceValue;
          }
        });

        setPlans(prices);
      } catch (error) {
        alert('هەڵەیەک ڕوویدا');
      }
    };

    getPlans();
  }, []);

  if (!plans) return <p>... loading</p>;

  useEffect(() => {
    if (renewalData?.membership && renewalData?.accessLevel && plans) {
      const accessLevelKey = renewalData.accessLevel;
      if (accessLevelKey && plans[accessLevelKey]) {
        const price = plans[accessLevelKey][renewalData.membership] || 0;
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [renewalData?.membership, renewalData?.accessLevel, plans]);

  useEffect(() => {
    setRenewalData(prev => ({
      ...prev,
      endDate: calculateEndDate(prev.startDate, prev.membership)
    }));
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!renewalData.membership) {
      errors.membership = 'جۆری ئەندامێتی پێویستە';
    }

    if (!renewalData.accessLevel) {
      errors.accessLevel = 'ئاستی دەستگەیشتن پێویستە';
    }

    if (!renewalData.startDate) {
      errors.startDate = 'بەرواری دەستپێک پێویستە';
    }

    if (!renewalData.endDate) {
      errors.startDate = 'بەرواری کۆتایی پێویستە';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('تکایە ژمارەی ID یان ژمارەی تەلەفۆن داخڵ بکە');
      setSearchResult(null);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let url = `http://localhost:3000/members/getspecifiedmember?`
      if (searchType === 'id') {
        url += `m_id=${searchTerm}`
      } else {
        url += `m_phone=${searchTerm}`
      }

      const res = await axios.get(url);

      if (res.status === 200) {
        setSearchResult(res.data.result[0])
        setIsLoading(false);
        setError('');
      }
    } catch (error) {
      setError('هیچ ئەندامێک بەم زانیاریە نەدۆزرایەوە');
      setSearchResult(null);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku', options);
  };

  const calculateEndDate = (startDate, membershipType) => {
    const date = new Date(startDate);

    if (membershipType === '1 مانگ') {
      date.setDate(date.getDate() + 30);
    } else if (membershipType === '3 مانگ') {
      date.setDate(date.getDate() + 90);
    } else if (membershipType === '6 مانگ') {
      date.setDate(date.getDate() + 180);
    } else if (membershipType === 'ساڵانە') {
      date.setFullYear(date.getFullYear() + 1);
    }

    return date.toISOString().split('T')[0];
  };

  const handleOpenRenewalModal = () => {
    let membershipType = '1 مانگ';

    if (searchResult.membership_title === 'پلانی مانگی') {
      membershipType = '1 مانگ';
    } else if (searchResult.membership_title === 'پلانی سێ مانگ') {
      membershipType = '3 مانگ';
    } else if (searchResult.membership_title === 'پلانی شەش مانگ') {
      membershipType = '6 مانگ';
    } else if (searchResult.membership_title === 'پلانی ساڵانە') {
      membershipType = 'ساڵانە';
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = calculateEndDate(startDate, membershipType);

    let accessLevel = 'gym';
    if (searchResult.type === 'مەلەوانگە') {
      accessLevel = 'pool';
    } else if (searchResult.type === 'مەلەوانگە و هۆلی وەرزشی') {
      accessLevel = 'both';
    } else if (searchResult.type === 'هۆلی وەرزشی') {
      accessLevel = 'gym';
    }

    setRenewalData({
      membership: membershipType,
      accessLevel: accessLevel,
      startDate: startDate,
      endDate: endDate
    });

    setShowRenewalModal(true);
  };

  const handleRenewalInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "membership" || name === "startDate") {
      setRenewalData(prev => {
        const startDate = name === "startDate" ? value : prev.startDate;
        const membershipType = name === "membership" ? value : prev.membership;

        const endDate = calculateEndDate(startDate, membershipType);

        return {
          ...prev,
          [name]: value,
          endDate: endDate
        };
      });
    } else {
      setRenewalData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleRenewMembership = async () => {

    if (!validateForm()) {
      return;
    }

    try {
      let type = '';
      if (renewalData.accessLevel === "gym") {
        type = 'هۆلی وەرزشی';
      } else if (renewalData.accessLevel === "pool") {
        type = 'مەلەوانگە';
      } else if (renewalData.accessLevel === "both") {
        type = 'مەلەوانگە و هۆلی وەرزشی';
      }

      let membership_title = '';
      if (renewalData.membership === "1 مانگ") {
        membership_title = 'پلانی مانگی';
      } else if (renewalData.membership === "3 مانگ") {
        membership_title = 'پلانی سێ مانگ';
      } else if (renewalData.membership === "6 مانگ") {
        membership_title = 'پلانی شەش مانگ';
      } else if (renewalData.membership === "ساڵانە") {
        membership_title = 'پلانی ساڵانە';
      }

      if (!membership_title) {
        alert('خشتەی ئەندامێتی دیاری نەکراوە');
        return;
      }

      const res = await axios.post(`http://localhost:3000/members/updatemembership/${searchResult.m_id}`,
        {
          membership_title: membership_title,
          start_date: renewalData.startDate,
          end_date: renewalData.endDate,
          type: type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert('ئەندامێتی بە سەرکەوتوویی نوێ کرایەوە');
        setShowRenewalModal(false);

        let url = `http://localhost:3000/members/getspecifiedmember?`
        if (searchType === 'id') {
          url += `m_id=${searchTerm}`
        } else {
          url += `m_phone=${searchTerm}`
        }

        const updatedMemberRes = await axios.get(url);
        if (updatedMemberRes.status === 200) {
          setSearchResult(updatedMemberRes.data.result[0]);
        }
      } else {
        alert('an error happend');
      }
    } catch (error) {
      alert('هەڵەیەک هەڵەیەکی بە سەرکەوتوویی بەسەرچووە');
    }
  };

  const handleMemberUpdate = (updatedMember) => {
    setSearchResult(updatedMember);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const confirmPoolEntry = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/members/addmemberpool`, {
        member_id: searchResult.m_id,
        entery_date: dateTime,
        member_plan_id: searchResult.amp_id,
        remaining_pool_entries: searchResult.remaining_pool_entries
      });

      if (res.status === 200) {
        alert('چوونە ژوورەوەی مەلەوانگە بە سەرکەوتوویی تۆمارکرا');
        setShowPoolEntryModal(false);

        const updatedRes = await axios.get(`http://localhost:3000/members/getspecifiedmember?m_id=${searchResult.m_id}`);
        setSearchResult(updatedRes.data.result[0]);
      }
    } catch (error) {
      alert('هەڵە ڕوویدا لە تۆمارکردنی چوونە ژوورەوە');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await axios.delete(`http://localhost:3000/members/deletemember/${searchResult.m_id}`)

      if (res.status === 200) {
        alert('بەسەرکەوتوویی سڕایەوە');
        navigate('/membership-check');
      } else {
        alert('هەڵە ڕوویدا لە سڕینەوە');
      }
    } catch (error) {
      alert('هەڵە ڕوویدا لە سڕینەوە');
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">پشکنینی باری ئەندامێتی</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="flex mb-4">
                <button
                  className={`px-4 py-2 ${searchType === 'id' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg transition-colors`}
                  onClick={() => setSearchType('id')}
                >
                  گەڕان بە ID
                </button>
                <button
                  className={`px-4 py-2 ${searchType === 'phone' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg transition-colors`}
                  onClick={() => setSearchType('phone')}
                >
                  گەڕان بە ژمارەی مۆبایل
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={searchType === 'id' ? "ژمارەی ID داخڵ بکە..." : "ژمارەی مۆبایل داخڵ بکە..."}
                  className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchType === 'id' ? (
                  <CreditCard size={18} className="absolute right-3 top-2.5 text-gray-400" />
                ) : (
                  <Phone size={18} className="absolute right-3 top-2.5 text-gray-400" />
                )}
              </div>

              {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
              )}

              <button
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-1 space-x-reverse transition-colors"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    <span>گەڕان...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} className="ml-1" />
                    <span>پشکنینی باری ئەندامێتی</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">ڕێنماییەکان</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-500 ml-2">•</span>
                  ژمارەی ID یان ژمارەی مۆبایلی ئەندام داخڵ بکە بۆ پشکنینی باری ئەندامێتی
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 ml-2">•</span>
                  سیستەم نیشان دەدات ئەگەر ئەندامێتی چالاکە یان بەسەرچووە
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 ml-2">•</span>
                  بۆ ئەندامێتیە چالاکەکان، ڕۆژی ماوە دەبینیت
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 ml-2">•</span>
                  بۆ ئەندامێتیە بەسەرچووەکان، دەبینیت کە چەند ڕۆژە بەسەرچووە
                </li>
              </ul>
            </div>
          </div>

          {searchResult && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">زانیاری ئەندام</h3>

              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-indigo-900">{searchResult.name}</h2>
                      <p className="text-gray-500 text-sm mt-1">ژمارەی ئەندامێتی: {searchResult.m_id}#</p>
                    </div>
                    <div className="flex gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${searchResult.remaining_days >= 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {searchResult.remaining_days >= 1 ? 'چالاک' : 'بەسەرچوو'}
                      </div>
                      <button
                        onClick={handleOpenRenewalModal}
                        disabled={searchResult.remaining_days >= 1}
                        className={`px-4 py-1 rounded-lg transition-colors flex items-center text-sm ${searchResult.remaining_days >= 1 ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-green-600 text-white cursor-pointer hover:bg-green-700'}`}
                      >
                        نوێکردنەوە
                        <RefreshCw size={14} className="mr-2" />
                      </button>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${["مەلەوانگە", "مەلەوانگە و هۆلی وەرزشی"].includes(searchResult.type) ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg h-full">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <User2 size={16} className="ml-2" />
                          زانیاری کەسی
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">ژمارەی مۆبایل</p>
                            <p className="font-medium">{searchResult.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ژمارەی تەلەفۆنی کاتی نائاسایی</p>
                            <p className="font-medium">{searchResult.emergencyphoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ڕەگەز</p>
                            <p className="font-medium">{searchResult.gender}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500">بەرزی</p>
                              <p className="font-medium">cm {searchResult.height}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">کێش</p>
                              <p className="font-medium">kg {searchResult.weight}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg h-full">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <ShieldCheck size={16} className="ml-2" />
                          زانیاری ئەندامێتی
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">پلانی ئەندامێتی</p>
                            <p className="font-medium">{searchResult.membership_title}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">جۆری ئەندامێتی</p>
                            <p className="font-medium">{searchResult.type}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500">بەرواری دەستپێکردن</p>
                              <p className="font-medium text-sm">{formatDate(searchResult.start_date)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">بەرواری کۆتایی</p>
                              <p className="font-medium text-sm">{formatDate(searchResult.end_date)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">باری ئەندامێتی</p>
                            <div className="flex items-center">
                              {searchResult.remaining_days >= 1 ? (
                                <>
                                  <CheckCircle size={16} className="text-green-500 ml-1" />
                                  <span className="font-medium">
                                    چالاک - {searchResult.remaining_days} ڕۆژی ماوە
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle size={16} className="text-red-500 ml-1" />
                                  <span className="font-medium text-red-600">
                                    بەسەرچووە
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`space-y-4 ${["مەلەوانگە", "مەلەوانگە و هۆلی وەرزشی"].includes(searchResult.type) ? "hidden" : ""}`}>
                      <div className="bg-gray-50 p-4 rounded-lg h-full">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <GlassWater size={16} className="ml-2" />
                            مەلەوانگە
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowPoolEntryModal(true)}
                              disabled={(searchResult.remaining_pool_entries == 0) || (searchResult.remaining_days <= 0)}
                              className={`px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center ${(searchResult.remaining_pool_entries == 0) || (searchResult.remaining_days <= 0) ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                            >
                              مەلە
                              <Plus size={12} className="mr-1" />
                            </button>
                            <button
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center"
                            >
                              مەلەی خۆرایی ئەندامێتی
                              <Gift size={12} className="mr-1" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">چوونە ژوورەوەی مەلەوانی</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-medium">{searchResult.used_pool_entries || 0}</span>
                                <span className="text-gray-400 mx-2">/</span>
                                <span className="font-medium">{searchResult.free_pool_entries || 0} مەلەوانگەی خۆرایی</span>
                              </div>
                              <span className="text-sm font-medium text-blue-600">
                                {searchResult.remaining_pool_entries || 0} ماوە
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(100, ((searchResult.used_pool_entries || 0) / (searchResult.free_pool_entries || 1)) * 100)}%`
                                }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ژمارەی چوونە ژوورەوەی مەلەوانی</p>
                            <div className="bg-gray-100 p-2 rounded mt-1">
                              <p className="font-medium text-sm break-words text-gray-700">
                                {searchResult.used_pool_entries} جار بەکارهاتووە
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ژمارەی چوونە ژوورەوەی ماوە</p>
                            <div className="bg-gray-100 p-2 rounded mt-1">
                              <p className="font-medium text-sm break-words text-gray-700">
                                {searchResult.remaining_pool_entries} جار  ماوە
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">بەرواری چوونە ژوورەوەکان</p>
                            <div className="bg-gray-100 p-3 rounded shadow-sm">
                              {searchResult.pool_entry_dates ? (
                                <div className="space-y-2 text-sm text-gray-700">
                                  {searchResult.pool_entry_dates
                                    .split(',')
                                    .map(date => date.trim())
                                    .map((date, index) => {
                                      const formatted = new Date(date).toLocaleDateString('ku-IQ', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      });
                                      return { index: index + 1, date: formatted };
                                    })
                                    .reduce((rows, _item, index, arr) => {
                                      if (index % 2 === 0) rows.push(arr.slice(index, index + 2));
                                      return rows;
                                    }, [])
                                    .map((pair, rowIndex) => (
                                      <div key={rowIndex} className="flex gap-4">
                                        {pair.map(item => (
                                          <div key={item.index} className="flex items-start gap-1">
                                            <span className="font-semibold">{item.index}.</span>
                                            <span>{item.date}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm">هیچ بەروارێک نییە</p>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <DatabaseIcon size={16} className="ml-2" />
                      زانیاری سیستەم
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">دروستکراوە لە</p>
                        <p className="font-medium text-sm"> {new Date(searchResult.created_at).toISOString().split("T")[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">دوایین نوێکردنەوە</p>
                        <p className="font-medium text-sm">{new Date(searchResult.last_updated).toISOString().split("T")[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-start">
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                      onClick={() => setShowEditModal(true)}
                    >
                      گۆڕانکاری
                      <Edit size={16} className="mr-2" />
                    </button>
                    <button
                      onClick={openModal}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      سڕینەوە
                      <Trash2 size={16} className="mr-2" />
                    </button>
                  </div>
                </div>

                {searchResult.remaining_days <= 0 && (
                  <div className="bg-red-50 px-6 py-4 border-t border-red-100">
                    <div className="flex justify-center items-center">
                      <AlertCircle size={18} className="text-red-500 ml-2" />
                      <p className="text-red-700">
                        <span className="font-semibold">ئەندامێتی بەسەرچووە لە {formatDate(searchResult.end_date)}</span> تکایە نوێی بکەرەوە بۆ ئەوەی بەردەوام بیت لە بەکارهێنانی هۆڵی وەرزش.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {showRenewalModal && (
        <div dir='rtl' className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    نوێکردنەوەی ئەندامێتی
                    <RefreshCw size={20} className="mr-2" />
                  </h2>
                  <p className="mt-1 text-indigo-100 text-sm">{searchResult.name}</p>
                </div>
                <button
                  onClick={() => setShowRenewalModal(false)}
                  className="text-white hover:text-indigo-200 transition-colors bg-white/10 rounded-full p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center mb-2">
                  <Clock size={16} className="text-indigo-700 ml-2" />
                  <p className="text-sm font-medium text-indigo-700">باری ئێستای ئەندامێتی</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">جۆری ئەندامێتی: <span className="font-medium text-gray-800">{searchResult.membership}</span></p>
                    <p className="text-sm text-gray-600">بەرواری کۆتایی: <span className="font-medium text-gray-800">{formatDate(searchResult.end_date)}</span></p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${searchResult.remaining_days >= 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {searchResult.remaining_days >= 1 ? 'چالاک' : 'بەسەرچوو'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">جۆری ئەندامێتی <span className="text-red-500">*</span></label>
                <select
                  name="membership"
                  value={renewalData.membership || "1 مانگ"}
                  onChange={handleRenewalInputChange}
                  className={`pr-4 pl-4 py-2 w-full border ${formErrors.membership ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                >
                  <option value="1 مانگ">1 مانگ</option>
                  <option value="3 مانگ">3 مانگ</option>
                  <option value="6 مانگ">6 مانگ</option>
                  <option value="ساڵانە">ساڵانە</option>
                </select>
                {formErrors.membership && <p className="mt-1 text-sm text-red-500">{formErrors.membership}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ئاستی دەستگەیشتن <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleRenewalInputChange({ target: { name: 'accessLevel', value: 'gym' } })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${renewalData.accessLevel === 'gym' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Dumbbell size={24} className={renewalData.accessLevel === 'gym' ? 'text-indigo-600' : 'text-gray-500'} />
                    <span className="mt-1 text-sm">هۆڵی وەرزشی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRenewalInputChange({ target: { name: 'accessLevel', value: 'pool' } })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${renewalData.accessLevel === 'pool' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Droplets size={24} className={renewalData.accessLevel === 'pool' ? 'text-indigo-600' : 'text-gray-500'} />
                    <span className="mt-1 text-sm">مەلەوانگە</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRenewalInputChange({ target: { name: 'accessLevel', value: 'both' } })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${renewalData.accessLevel === 'both' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex">
                      <Dumbbell size={20} className={renewalData.accessLevel === 'both' ? 'text-indigo-600' : 'text-gray-500'} />
                      <Droplets size={20} className={renewalData.accessLevel === 'both' ? 'text-indigo-600' : 'text-gray-500'} />
                    </div>
                    <span className="mt-1 text-sm">هەردووکیان</span>
                  </button>
                </div>
                {formErrors.accessLevel && <p className="mt-1 text-sm text-red-500">{formErrors.accessLevel}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="ml-1 text-indigo-600" />
                  بەرواری دەستپێک
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={renewalData.startDate}
                    onChange={handleRenewalInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <LockIcon size={14} className="text-gray-400 ml-1" />
                  بەرواری کۆتایی
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={renewalData.endDate}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  بەرواری کۆتایی بەشێوەیەکی خۆکار دیاری دەکرێت
                </p>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <h4 className="text-md font-medium text-indigo-700 mb-2">نرخی ئەندامێتی</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">کۆی گشتی:</span>
                  <span className="text-2xl font-bold text-indigo-700">{formatPrice(calculatedPrice)} IQD</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex gap-8 space-x-3 space-x-reverse">
              <button
                onClick={handleRenewMembership}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-colors flex items-center justify-center shadow-md"
              >
                نوێکردنەوەی ئەندامێتی
                <RefreshCw size={16} className="mr-1" />
              </button>

              <button
                onClick={() => setShowRenewalModal(false)}
                className="flex-1 bg-white text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
              >
                هەڵوەشاندنەوە
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditMemberModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          member={searchResult}
          onUpdate={handleMemberUpdate}
        />
      )}

      {showPoolEntryModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {searchResult.type !== "مەلەوانگە" || "مەلەوانگە و هۆلی وەرزشی" ? 'چوونە ژوورەوەی مەلەی خۆرایی' : 'چوونە ژوورەوەی مەلە'}
                </h3>
                <button
                  onClick={() => {
                    setShowPoolEntryModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="mb-2">ئەندام: <span className="font-semibold">{searchResult.name}</span></p>
                <p>ژمارەی ئەندامێتی: <span className="font-semibold">{searchResult.m_id}</span></p>
                <p>ژمارەی پلانی ئەندامێتی: <span className="font-semibold">{searchResult.amp_id}</span></p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  بەرواری چوونەژورەوە
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
                />
              </div>

              <div className="flex justify-start gap-3">
                <button
                  onClick={confirmPoolEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  پەسەندکردن
                </button>
                <button
                  onClick={() => {
                    setShowPoolEntryModal(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  هەڵوەشاندنەوە
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity bg-opacity-75"
              onClick={closeModal}
            ></div>

            <div className="relative z-20 w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl">
              <div className="absolute top-0 left-0 pt-4 pl-4">
                <button
                  onClick={closeModal}
                  className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">ئایا دڵنیای لە سڕینەوەی ئەم ئەندامە</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    ئایا دڵنیایت دەتەوێت <span className="font-bold">"{searchResult.name}"</span> بسڕیتەوە؟ ئەم کردارە ناتوانرێت پاشگەز بکرێتەوە.
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  هەڵوەشاندنەوە
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 ml-2 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      سڕینەوە...
                    </span>
                  ) : (
                    'سڕینەوە'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}