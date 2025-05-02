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
  ShieldCheck
} from 'lucide-react';

export default function MembershipCheck() {
  // State for search input
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('id'); // 'id' or 'phone'
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Member data
  const members = [
    { 
      id: '1', 
      name: "سارا ئەحمەد", 
      phone: "0770-123-4567", 
      emergencyPhone: "0750-111-2222",
      membership: "ساڵانە",
      startDate: "2025-02-10",
      endDate: "2026-02-10",
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
    
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Dumbbell size={28} />
            <h1 className="text-2xl font-bold mr-2">سیستەمی پشکنینی ئەندامێتی</h1>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative ml-4">
              <Bell size={20} className="cursor-pointer hover:text-blue-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">٣</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-medium ml-2">بەڕێوەبەری هۆڵ</span>
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

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
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                          بینینی وردەکاری
                        </button>
                        {searchResult.status !== 'active' && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-3">
                            نوێکردنەوەی ئەندامێتی
                          </button>
                        )}
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
    </div>
  );
}