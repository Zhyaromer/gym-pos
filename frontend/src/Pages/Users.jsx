import { useState, useEffect } from 'react';
import {
  Search,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Save,
  X
} from 'lucide-react';
import Navbar from '../components/layout/Nav';

export default function GymUsersPage() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data
  const [gymUsers, setGymUsers] = useState([
    {
      id: 1,
      name: "سارا ئەحمەد",
      email: "sara@example.com",
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
    },
    {
      id: 2,
      name: "ئاکۆ محەمەد",
      email: "ako@example.com",
      phone: "0771-234-5678",
      emergencyPhone: "0750-222-3333",
      membership: "مانگانە",
      startDate: "2025-03-15",
      endDate: "2025-06-15",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "active",
      gender: "نێر",
      accessLevel: "ئەندام",
      createdAt: "2025-03-15",
      updatedAt: "2025-03-15",
      height: "178cm",
      weight: "75kg"
    },
    {
      id: 3,
      name: "شیلان ڕەزا",
      email: "shilan@example.com",
      phone: "0772-345-6789",
      emergencyPhone: "0750-333-4444",
      membership: "شەش مانگی",
      startDate: "2025-01-20",
      endDate: "2025-07-20",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "expired",
      gender: "مێ",
      accessLevel: "ئەندام",
      createdAt: "2025-01-20",
      updatedAt: "2025-01-20",
      height: "162cm",
      weight: "58kg"
    },
    {
      id: 4,
      name: "سارا ئەحمەد",
      email: "sara@example.com",
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
    },
    {
      id: 5,
      name: "ئاکۆ محەمەد",
      email: "ako@example.com",
      phone: "0771-234-5678",
      emergencyPhone: "0750-222-3333",
      membership: "مانگانە",
      startDate: "2025-03-15",
      endDate: "2025-06-15",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "active",
      gender: "نێر",
      accessLevel: "ئەندام",
      createdAt: "2025-03-15",
      updatedAt: "2025-03-15",
      height: "178cm",
      weight: "75kg"
    },
    {
      id: 6,
      name: "شیلان ڕەزا",
      email: "shilan@example.com",
      phone: "0772-345-6789",
      emergencyPhone: "0750-333-4444",
      membership: "شەش مانگی",
      startDate: "2025-01-20",
      endDate: "2025-07-20",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "expired",
      gender: "مێ",
      accessLevel: "ئەندام",
      createdAt: "2025-01-20",
      updatedAt: "2025-01-20",
      height: "162cm",
      weight: "58kg"
    },
    {
      id: 7,
      name: "سارا ئەحمەد",
      email: "sara@example.com",
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
    },
    {
      id: 8,
      name: "ئاکۆ محەمەد",
      email: "ako@example.com",
      phone: "0771-234-5678",
      emergencyPhone: "0750-222-3333",
      membership: "مانگانە",
      startDate: "2025-03-15",
      endDate: "2025-06-15",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "active",
      gender: "نێر",
      accessLevel: "ئەندام",
      createdAt: "2025-03-15",
      updatedAt: "2025-03-15",
      height: "178cm",
      weight: "75kg"
    },
    {
      id: 9,
      name: "شیلان ڕەزا",
      email: "shilan@example.com",
      phone: "0772-345-6789",
      emergencyPhone: "0750-333-4444",
      membership: "شەش مانگی",
      startDate: "2025-01-20",
      endDate: "2025-07-20",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "expired",
      gender: "مێ",
      accessLevel: "ئەندام",
      createdAt: "2025-01-20",
      updatedAt: "2025-01-20",
      height: "162cm",
      weight: "58kg"
    }
  ]);

  // Users per page
  const usersPerPage = 5;

  // Calculate days remaining for each user
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter users based on search term and status
  const filteredUsers = gymUsers.filter(user => {
    // Search by ID (convert to string), name, or phone
    const matchesSearch =
      user.id.toString().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus =
      filterStatus === 'all' ||
      user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // View user profile
  const viewUserProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Edit user
  const editUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  // Save edited user
  const saveEditedUser = () => {
    setGymUsers(gymUsers.map(user =>
      user.id === editingUser.id ? editingUser : user
    ));
    setShowEditModal(false);
    // If we were viewing this user's profile, update the selected user too
    if (selectedUser && selectedUser.id === editingUser.id) {
      setSelectedUser(editingUser);
    }
  };

  // Delete user
  const deleteUser = (id) => {
    if (window.confirm('دڵنیایت کە دەتەوێت ئەم بەکارهێنەرە بسڕیتەوە؟')) {
      setGymUsers(gymUsers.filter(user => user.id !== id));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku-IQ', options);
  };

  // Handle input change for editing
  // Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Create updated user object
    const updatedUser = {
      ...editingUser,
      [name]: value,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // If membership type or start date changes, recalculate end date
    if (name === "membership" || name === "startDate") {
      const startDate = name === "startDate" ? value : editingUser.startDate;
      const membershipType = name === "membership" ? value : editingUser.membership;

      // Only calculate if we have both values
      if (startDate && membershipType) {
        updatedUser.endDate = calculateEndDate(startDate, membershipType);
      }
    }

    setEditingUser(updatedUser);
  };

  // Calculate end date based on membership type and start date
  const calculateEndDate = (startDate, membershipType) => {
    const date = new Date(startDate);

    if (membershipType === "مانگانە") {
      date.setMonth(date.getMonth() + 1);
    } else if (membershipType === "شەش مانگی") {
      date.setMonth(date.getMonth() + 6);
    } else if (membershipType === "ساڵانە") {
      date.setFullYear(date.getFullYear() + 1);
    }

    return date.toISOString().split('T')[0];
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold mb-4 md:mb-0">ئەندامانی هۆڵ</h2>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="گەڕان بۆ ئەندامان..."
                  className="pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">هەموو دۆخەکان</option>
                  <option value="active">چالاک</option>
                  <option value="expired">بەسەرچوو</option>
                  <option value="paused">ڕاگیراو</option>
                </select>
                <Filter size={18} className="text-gray-500 mr-2" />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ناسنامە</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ئەندام</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ڕەگەز</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ئەندامێتی</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بەرواری دەستپێک</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بەرواری کۆتایی</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ڕۆژەکانی ماوە</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دۆخ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map(user => {
                  const daysRemaining = calculateDaysRemaining(user.endDate);

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.membership}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock size={16} className={`ml-1 ${daysRemaining > 10 ? 'text-green-500' : daysRemaining > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <span className={`text-sm ${daysRemaining > 10 ? 'text-green-600' : daysRemaining > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {daysRemaining > 0 ? `${daysRemaining} ڕۆژ` : `${Math.abs(daysRemaining)} ڕۆژ پێش`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                          {user.status === 'active' ? (
                            <>
                              <CheckCircle size={14} className="ml-1" />
                              چالاک
                            </>
                          ) : user.status === 'expired' ? (
                            <>
                              <XCircle size={14} className="ml-1" />
                              بەسەرچوو
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="ml-1" />
                              ڕاگیراو
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex justify-start space-x-2">
                          <button
                            onClick={() => viewUserProfile(user)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md"
                            title="بینینی پڕۆفایل"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => editUser(user)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md mx-2"
                            title="دەستکاری ئەندام"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md"
                            title="سڕینەوەی ئەندام"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                پیشاندانی {indexOfFirstUser + 1} تا {Math.min(indexOfLastUser, filteredUsers.length)} لە {filteredUsers.length} ئەندام
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <ChevronRight size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 left-4 text-white hover:text-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="ml-6">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                  <p className="text-blue-100">ناسنامەی ئەندام: #{selectedUser.id}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedUser.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {selectedUser.status === 'active' ? 'چالاک' :
                        selectedUser.status === 'expired' ? 'بەسەرچوو' : 'ڕاگیراو'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کەسی</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">ناوی تەواو</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ڕەگەز</p>
                      <p className="font-medium">{selectedUser.gender}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ئیمەیل</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ژمارەی تەلەفۆن</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ژمارەی تەلەفۆنی کاتی نائاسایی</p>
                      <p className="font-medium">{selectedUser.emergencyPhone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرزی / کێش</p>
                      <p className="font-medium">{selectedUser.height} / {selectedUser.weight}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">وردەکاری ئەندامێتی</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">پلانی ئەندامێتی</p>
                      <p className="font-medium">{selectedUser.membership}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرواری دەستپێک</p>
                      <p className="font-medium">{formatDate(selectedUser.startDate)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرواری کۆتایی</p>
                      <p className="font-medium">{formatDate(selectedUser.endDate)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ڕۆژەکانی ماوە</p>
                      <p className={`font-medium ${calculateDaysRemaining(selectedUser.endDate) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateDaysRemaining(selectedUser.endDate) > 0
                          ? `${calculateDaysRemaining(selectedUser.endDate)} ڕۆژ ماوە`
                          : `${Math.abs(calculateDaysRemaining(selectedUser.endDate))} ڕۆژ پێش بەسەر چووە`}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ئاستی دەستگەیشتن</p>
                      <p className="font-medium">{selectedUser.accessLevel}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری سیستەم</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">دروستکراوە لە</p>
                    <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">دوایین نوێکردنەوە</p>
                    <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mx-2"
                >
                  داخستن
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    editUser(selectedUser);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit size={16} className="ml-1" />
                  دەستکاری ئەندام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 left-4 text-white hover:text-blue-200"
              >
                <X size={20} />
              </button>
              <div className="flex items-center">
                <div className="ml-6">
                  <img
                    src={editingUser.avatar}
                    alt={editingUser.name}
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">دەستکاری ئەندام</h2>
                  <p className="text-blue-100">ناسنامەی ئەندام: #{editingUser.id}</p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کەسی</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ناوی تەواو</label>
                      <input
                        type="text"
                        name="name"
                        value={editingUser.name}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ڕەگەز</label>
                      <select
                        name="gender"
                        value={editingUser.gender}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="نێر">نێر</option>
                        <option value="مێ">مێ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ئیمەیل</label>
                      <input
                        type="email"
                        name="email"
                        value={editingUser.email}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆن</label>
                      <input
                        type="text"
                        name="phone"
                        value={editingUser.phone}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆنی کاتی نائاسایی</label>
                      <input
                        type="text"
                        name="emergencyPhone"
                        value={editingUser.emergencyPhone}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">بەرزی</label>
                        <input
                          type="text"
                          name="height"
                          value={editingUser.height}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کێش</label>
                        <input
                          type="text"
                          name="weight"
                          value={editingUser.weight}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">وردەکاری ئەندامێتی</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">پلانی ئەندامێتی</label>
                      <select
                        name="membership"
                        value={editingUser.membership}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="مانگانە">مانگانە</option>
                        <option value="سێ مانگی">سێ مانگی</option>
                        <option value="شەش مانگی">شەش مانگی</option>
                        <option value="ساڵانە">ساڵانە</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری دەستپێک</label>
                      <input
                        type="date"
                        name="startDate"
                        value={editingUser.startDate}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری کۆتایی</label>
                      <input
                        type="date"
                        name="endDate"
                        value={editingUser.endDate}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">دۆخ</label>
                      <select
                        name="status"
                        value={editingUser.status}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">چالاک</option>
                        <option value="expired">بەسەرچوو</option>
                        <option value="paused">ڕاگیراو</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ئاستی دەستگەیشتن</label>
                      <select
                        name="accessLevel"
                        value={editingUser.accessLevel}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ئەندام">ئەندام</option>
                        <option value="ڕاهێنەر">ڕاهێنەر</option>
                        <option value="کارمەند">کارمەند</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mx-2"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  onClick={saveEditedUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save size={16} className="ml-1" />
                  پاشەکەوتکردن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
