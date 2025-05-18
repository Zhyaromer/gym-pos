import { useState, useEffect } from 'react';
import {
  Search,
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
import axios from 'axios';
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
  const [gymUsers, setGymUsers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/members/getmembers')
        setGymUsers(res.data.results);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMembers();
  }, [])

  const usersPerPage = 12;

  const filteredUsers = gymUsers.filter(user => {
    const matchesSearch =
      user?.m_id?.toString()?.includes(searchTerm) ||
      user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.phoneNumber?.includes(searchTerm);

    if (filterStatus === 'active') {
      return user.remaining_days >= 1;
    } else if (filterStatus === 'expired') {
      return user.remaining_days == 0;
    }

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const viewUserProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const editUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const saveEditedUser = async () => {
    const updatedUser = {
      name: editingUser.name,
      gender: editingUser.gender,
      phoneNumber: editingUser.phoneNumber,
      emergencyphoneNumber: editingUser.emergencyphoneNumber,
      height: editingUser.height,
      weight: editingUser.weight,
    }

    try {
      const res = await axios.post(`http://localhost:3000/members/updatemember/${editingUser.m_id}`, updatedUser);

      if (res.status === 200) {
        setGymUsers(gymUsers.map(user =>
          user.m_id === editingUser.m_id ? editingUser : user
        ));
        setShowEditModal(false);
        if (selectedUser && selectedUser.m_id === editingUser.m_id) {
          setSelectedUser(editingUser);
        }
      } else {
        console.log('Failed to update user');
      }

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (m_id) => {
    if (window.confirm('دڵنیایت کە دەتەوێت ئەم بەکارهێنەرە بسڕیتەوە؟')) {
      try {
        const res = await axios.delete(`http://localhost:3000/members/deletemember/${m_id}`);
        if (res.status === 200) {
          setGymUsers(gymUsers.filter(user => user.m_id !== m_id));
        } else {
          console.log('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku-IQ', options);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    const updatedUser = {
      ...editingUser,
      [name]: value
    };

    setEditingUser(updatedUser);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />

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
                </select>
                <Filter size={18} className="text-gray-500 mr-2" />
              </div>
            </div>
          </div>

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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ڕۆژی ماوە</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دۆخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map(user => {
                  return (
                    <tr key={user.m_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{user.m_id}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.membership_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(new Date(user.start_date).toISOString().split('T')[0])}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(new Date(user.end_date).toISOString().split('T')[0])}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock size={16} className={`ml-1 ${user.remaining_days > 10 ? 'text-green-500' : user.remaining_days > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <span className={`text-sm ${user.remaining_days > 10 ? 'text-green-600' : user.remaining_days > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {user.remaining_days > 0 ? `${user.remaining_days} ڕۆژ` : `${Math.abs(user.remaining_days)} ڕۆژ`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`w-[100px] px-2 py-1 flex flex-row items-center text-xs leading-5 font-semibold rounded-full 
                          ${user.remaining_days >= 1 ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                          {user.remaining_days >= 1 ? (
                            <>
                              <CheckCircle size={14} className="ml-1" />
                              چالاک
                            </>
                          ) : (
                            <>
                              <XCircle size={14} className="ml-1" />
                              بەسەرچوو
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
                            onClick={() => deleteUser(user.m_id)}
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
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                  <p className="text-blue-100">ناسنامەی ئەندام : {selectedUser.m_id}#</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.remaining_days >= 1 ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                      {user.remaining_days >= 1 ? 'چالاک' : 'بەسەرچوو'}
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
                      <p className="text-sm text-gray-500">ژمارەی تەلەفۆن</p>
                      <p className="font-medium">{selectedUser.phoneNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ژمارەی تەلەفۆنی کاتی نائاسایی</p>
                      <p className="font-medium">{selectedUser.emergencyphoneNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرزی / کێش</p>
                      <p className="font-medium">{selectedUser.height}cm / {selectedUser.weight}kg</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">وردەکاری ئەندامێتی</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">پلانی ئەندامێتی</p>
                      <p className="font-medium">{selectedUser.membership_title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">جۆری ئەندامێتی</p>
                      <p className="font-medium">{selectedUser.type}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرواری دەستپێک</p>
                      <p className="font-medium"> {(new Date(selectedUser.start_date).toISOString().split('T')[0])}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرواری کۆتایی</p>
                      <p className="font-medium"> {(new Date(selectedUser.end_date).toISOString().split('T')[0])}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ڕۆژی ماوە</p>
                      <p className='flex flex-row items-center mt-1'>
                        <Clock size={16} className={`ml-1 ${selectedUser.remaining_days > 10 ? 'text-green-500' : selectedUser.remaining_days > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                        <span className={`text-sm ${selectedUser.remaining_days > 10 ? 'text-green-600' : selectedUser.remaining_days > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {selectedUser.remaining_days > 0 ? `${selectedUser.remaining_days} ڕۆژ` : `${Math.abs(selectedUser.remaining_days)} ڕۆژ`}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری سیستەم</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">دروستکراوە لە</p>
                    <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">دوایین نوێکردنەوە</p>
                    <p className="font-medium">{formatDate(selectedUser.last_updated)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-start space-x-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mx-2"
                >
                  داخستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div>
                  <h2 className="text-xl font-bold">دەستکاری ئەندام</h2>
                  <p className="text-blue-100">ناسنامەی ئەندام: #{editingUser.m_id}</p>
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
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ڕەگەز</label>
                      <select
                        name="gender"
                        value={editingUser.gender}
                        onChange={handleEditChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="پیاو">پیاو</option>
                        <option value="ئافرەت">ئافرەت</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆن</label>
                      <input
                        type="text"
                        name="phone"
                        value={editingUser.phoneNumber}
                        onChange={handleEditChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆنی کاتی نائاسایی</label>
                      <input
                        type="text"
                        name="emergencyPhone"
                        value={editingUser.emergencyphoneNumber}
                        onChange={handleEditChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کێش</label>
                        <input
                          type="text"
                          name="weight"
                          value={editingUser.weight}
                          onChange={handleEditChange}
                          className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">وردەکاری ئەندامێتی</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">پلانی ئەندامێتی</label>
                      <input
                        type="text"
                        value={editingUser.membership_title}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">جۆری ئەندامێتی</label>
                      <input
                        type="text"
                        value={editingUser.type}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری دەستپێک</label>
                      <input
                        type="date"
                        name="startDate"
                        readOnly
                        value={(new Date(editingUser.start_date).toISOString().split('T')[0])}
                        onChange={handleEditChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری کۆتایی</label>
                      <input
                        type="date"
                        name="endDate"
                        readOnly
                        value={(new Date(editingUser.end_date).toISOString().split('T')[0])}
                        onChange={handleEditChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-start space-x-3">
                <button
                  onClick={saveEditedUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save size={16} className="ml-1" />
                  پاشەکەوتکردن
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mx-2"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}