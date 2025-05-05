import { useState } from 'react';
import {
  User,
  Search,
  CheckCircle,
  XCircle,
  Dumbbell,
  Bell,
  Phone,
  CreditCard,
  Clock,
  Scale,
  Ruler,
  Heart,
  Calendar,
  User2,
  ShieldCheck,
  X,
  RefreshCw,
  DollarSign,
  LockIcon
} from 'lucide-react';
import Navbar from '../components/layout/Nav';

export default function MembershipCheck() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('id'); // 'id' or 'phone'
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalData, setRenewalData] = useState({
    membership: 'مانگانە',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const members = [
    {
      id: '1',
      name: "سارا ئەحمەد",
      phone: "0770-123-4567",
      emergencyPhone: "0750-111-2222",
      membership: "مانگانە",
      startDate: "2025-05-02",
      endDate: "2025-06-02",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      status: "active",
      gender: "مێ",
      accessLevel: "ئەندام",
      createdAt: "2025-02-10",
      updatedAt: "2025-02-10",
      height: "165cm",
      weight: "62kg"
    }
  ];

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('تکایە ژمارەی ID یان ژمارەی تەلەفۆن داخڵ بکە');
      setSearchResult(null);
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call with timeout
    setTimeout(() => {
      let result;
      if (searchType === 'id') {
        result = members.find(member => member.id === searchTerm);
      } else {
        result = members.find(member => member.phone.replace(/[\s-]/g, '').includes(searchTerm.replace(/[\s-]/g, '')));
      }

      if (result) {
        setSearchResult(result);
      } else {
        setError('هیچ ئەندامێک بەم زانیاریە نەدۆزرایەوە');
        setSearchResult(null);
      }
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku', options);
  };

  // Calculate days remaining or days expired
  const getDaysStatus = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(`today ${today}`)
    console.log(`end ${end}`)
    console.log(`diffTime ${diffTime}`)
    console.log(`diffDays ${diffDays}`)

    return diffDays;
  };

  // Calculate end date based on membership type and start date
  const calculateEndDate = (startDate, membershipType) => {
    const date = new Date(startDate);

    if (membershipType === "مانگانە") {
      date.setMonth(date.getMonth() + 1);
    } else if (membershipType === "سێ مانگی") {
      date.setMonth(date.getMonth() + 3);
    } else if (membershipType === "شەش مانگی") {
      date.setMonth(date.getMonth() + 6);
    } else if (membershipType === "ساڵانە") {
      date.setFullYear(date.getFullYear() + 1);
    }

    return date.toISOString().split('T')[0];
  };

  // Handle opening renewal modal
  const handleOpenRenewalModal = () => {
    // Get the current membership type from searchResult
    const membershipType = searchResult.membership;
    const startDate = new Date().toISOString().split('T')[0];
    
    // Calculate end date directly using these values
    const endDate = calculateEndDate(startDate, membershipType);
    
    // Set all values at once
    setRenewalData({
      membership: membershipType,
      startDate: startDate,
      endDate: endDate
    });
    
    setShowRenewalModal(true);
  };

  // Add this console log to debug the values
  const handleRenewalInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "membership" || name === "startDate") {
      // Use functional update to ensure we're working with the latest state
      setRenewalData(prev => {
        // Get the updated values using the previous state
        const startDate = name === "startDate" ? value : prev.startDate;
        const membershipType = name === "membership" ? value : prev.membership;
        
        // Calculate the new end date
        const endDate = calculateEndDate(startDate, membershipType);
        
        // Return the new state object
        return {
          ...prev,
          [name]: value,
          endDate: endDate
        };
      });
    } else {
      // For other fields, just update normally
      setRenewalData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle membership renewal
  const handleRenewMembership = () => {
    // In a real app, you would send this data to your backend
    // For now, we'll just update the local state
    const updatedMember = {
      ...searchResult,
      membership: renewalData.membership,
      startDate: renewalData.startDate,
      endDate: renewalData.endDate,
      status: 'active',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Update the member in the members array
    const updatedMembers = members.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    );

    // Update the search result
    setSearchResult(updatedMember);

    // Close the modal
    setShowRenewalModal(false);

    // Show success message (in a real app, you might want to add a toast notification)
    alert('ئەندامێتی بە سەرکەوتوویی نوێ کرایەوە');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
            <Navbar/>

      {/* Main Content */}
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
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100">
                          <img
                            src={searchResult.avatar}
                            alt={searchResult.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center ${searchResult.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                          {searchResult.status === 'active' ?
                            <CheckCircle size={14} className="text-white" /> :
                            <XCircle size={14} className="text-white" />
                          }
                        </div>
                      </div>
                    </div>

                    <div className="md:w-3/4 md:pr-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-indigo-900">{searchResult.name}</h2>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${searchResult.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {searchResult.status === 'active' ? 'چالاک' : 'بەسەرچوو'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <CreditCard size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">ژمارەی ئەندامێتی</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.id}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Phone size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">ژمارەی مۆبایل</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.phone}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Heart size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">ژمارەی مۆبایلی تەنگانە</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.emergencyPhone}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Dumbbell size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">جۆری ئەندامێتی</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.membership}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Calendar size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">بەرواری دەستپێکردن</p>
                          </div>
                          <p className="font-medium text-indigo-900">{formatDate(searchResult.startDate)}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Calendar size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">بەرواری کۆتایی</p>
                          </div>
                          <p className="font-medium text-indigo-900">{formatDate(searchResult.endDate)}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <User2 size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">ڕەگەز</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.gender}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <ShieldCheck size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">ئاستی دەستپێڕاگەیشتن</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.accessLevel}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Ruler size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">بەرزی</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.height}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Scale size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">کێش</p>
                          </div>
                          <p className="font-medium text-indigo-900">{searchResult.weight}</p>
                        </div>

                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Clock size={16} className="text-indigo-700 ml-2" />
                            <p className="text-sm text-indigo-700">باری ئەندامێتی</p>
                          </div>
                          <div className="flex items-center mt-1">
                            {searchResult.status === 'active' ? (
                              <>
                                <CheckCircle size={18} className="text-green-500 ml-1" />
                                <span className="font-medium text-green-600">
                                  چالاک - {getDaysStatus(searchResult.endDate)} ڕۆژی ماوە
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle size={18} className="text-red-500 ml-1" />
                                <span className="font-medium text-red-600">
                                  بەسەرچووە - پێش {Math.abs(getDaysStatus(searchResult.endDate))} ڕۆژ
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3 space-x-reverse">
                        <button
                          onClick={handleOpenRenewalModal}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <RefreshCw size={16} className="ml-2" />
                          نوێکردنەوەی ئەندامێتی
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {searchResult.status !== 'active' && (
                  <div className="bg-red-50 px-6 py-4 border-t border-red-100">
                    <div className="flex items-center">
                      <Clock size={18} className="text-red-500 ml-2" />
                      <p className="text-red-700">
                        <span className="font-semibold">ئەندامێتی بەسەرچووە لە {formatDate(searchResult.endDate)}.</span> تکایە نوێی بکەرەوە بۆ ئەوەی بەردەوام بیت لە بەکارهێنانی هۆڵی وەرزش.
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
                    <p className="text-sm text-gray-600">بەرواری کۆتایی: <span className="font-medium text-gray-800">{formatDate(searchResult.endDate)}</span></p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${searchResult.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {searchResult.status === 'active' ? 'چالاک' : 'بەسەرچوو'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Dumbbell size={16} className="ml-1 text-indigo-600" />
                  جۆری ئەندامێتی
                </label>
                <div className="relative">
                  <select
                    name="membership"
                    value={renewalData.membership}
                    onChange={handleRenewalInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                  >
                    <option value="مانگانە">مانگانە</option>
                    <option value="سێ مانگی">سێ مانگی</option>
                    <option value="شەش مانگی">شەش مانگی</option>
                    <option value="ساڵانە">ساڵانە</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
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

              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-center mb-1">
                  <DollarSign size={16} className="text-green-700 ml-2" />
                  <p className="text-sm font-medium text-green-700">نرخی ئەندامێتی</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">{renewalData.membership}</p>
                  <p className="font-bold text-green-700 text-lg">
                    {renewalData.membership === "مانگانە" ? "٥٠,٠٠٠ د.ع" :
                      renewalData.membership === "سێ مانگی" ? "١٣٥,٠٠٠ د.ع" :
                        renewalData.membership === "شەش مانگی" ? "٢٥٠,٠٠٠ د.ع" :
                          "٤٥٠,٠٠٠ د.ع"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
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
    </div>
  );
}