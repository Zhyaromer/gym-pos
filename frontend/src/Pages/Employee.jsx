import { useState } from 'react';
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
  X,
  DollarSign,
  MapPin,
  Cake
} from 'lucide-react';

export default function EmployeesPage() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      fullName: "سارا ئەحمەد",
      email: "sara@example.com",
      phoneNumber: "0770-123-4567",
      secondaryNumber: "0750-111-2222",
      gender: "مێ",
      role: "ڕاهێنەر",
      startWorkingDate: "2023-02-10",
      salary: "750,000 د.ع",
      address: "هەولێر، کەرەنتینا",
      dateOfBirth: "1990-05-15",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      status: "active"
    },
    {
      id: 2,
      fullName: "ئاکۆ محەمەد",
      email: "ako@example.com",
      phoneNumber: "0771-234-5678",
      secondaryNumber: "0750-222-3333",
      gender: "نێر",
      role: "کارمەند",
      startWorkingDate: "2024-01-15",
      salary: "500,000 د.ع",
      address: "هەولێر، ئەنکاو",
      dateOfBirth: "1995-08-22",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "active"
    },
    {
      id: 3,
      fullName: "شیلان ڕەزا",
      email: "shilan@example.com",
      phoneNumber: "0772-345-6789",
      secondaryNumber: "0750-333-4444",
      gender: "مێ",
      role: "کارمەند",
      startWorkingDate: "2024-03-20",
      salary: "450,000 د.ع",
      address: "هەولێر، شەقڵاوە",
      dateOfBirth: "1998-11-10",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "inactive"
    }
  ]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Calculate years of service
  const calculateYearsOfService = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    let years = today.getFullYear() - start.getFullYear();
    const monthDiff = today.getMonth() - start.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())) {
      years--;
    }

    return years;
  };

  // Employees per page
  const employeesPerPage = 5;

  // Filter employees based on search term and role
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.id.toString().includes(searchTerm) ||
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber.includes(searchTerm);

    const matchesRole =
      filterRole === 'all' ||
      employee.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // View employee profile
  const viewEmployeeProfile = (employee) => {
    setSelectedEmployee(employee);
    setShowProfileModal(true);
  };

  // Edit employee
  const editEmployee = (employee) => {
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  };

  // Save edited employee
  const saveEditedEmployee = () => {
    setEmployees(employees.map(employee =>
      employee.id === editingEmployee.id ? editingEmployee : employee
    ));
    setShowEditModal(false);
    if (selectedEmployee && selectedEmployee.id === editingEmployee.id) {
      setSelectedEmployee(editingEmployee);
    }
  };

  // Delete employee
  const deleteEmployee = (id) => {
    if (window.confirm('دڵنیایت کە دەتەوێت ئەم کارمەندە بسڕیتەوە؟')) {
      setEmployees(employees.filter(employee => employee.id !== id));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku-IQ', options);
  };

  // Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({
      ...editingEmployee,
      [name]: value
    });
  };

  const calculateTotalMonthlySalary = () => {
    return employees.reduce((total, employee) => {
      // Extract numeric value from salary string (remove non-numeric characters)
      const salaryValue = parseInt(employee.salary.replace(/[^0-9]/g, ''));
      return total + salaryValue;
    }, 0);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">سیستەمی بەڕێوەبردنی کارمەندان</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="font-medium mr-2">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold mb-4 md:mb-0">لیستی کارمەندان</h2>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="گەڕان بۆ کارمەندان..."
                  className="pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">هەموو رۆڵەکان</option>
                  <option value="ڕاهێنەر">ڕاهێنەر</option>
                  <option value="کارمەند">کارمەند</option>
                  <option value="بەڕێوەبەر">بەڕێوەبەر</option>
                </select>
                <Filter size={18} className="text-gray-500 mr-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white p-4 mb-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">کۆی گشتی</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">کۆی کارمەندان</p>
                    <p className="text-2xl font-bold text-blue-700">{employees.length}</p>
                  </div>
                  <User size={24} className="text-blue-400" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">کۆی مووچەی مانگانە</p>
                    <p className="text-2xl font-bold text-green-700">
                      {calculateTotalMonthlySalary().toLocaleString()} د.ع
                    </p>
                  </div>
                  <DollarSign size={24} className="text-green-400" />
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">کۆی مووچەی ساڵانە (١٢ مانگ)</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {(calculateTotalMonthlySalary() * 12).toLocaleString()} د.ع
                    </p>
                  </div>
                  <Calendar size={24} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Employees Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ناسنامە</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کارمەند</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ڕەگەز</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رۆڵ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مووچە</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ساڵی خزمەت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تەمەن</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دۆخ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEmployees.map(employee => {
                  const age = calculateAge(employee.dateOfBirth);
                  const yearsOfService = calculateYearsOfService(employee.startWorkingDate);

                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{employee.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={employee.avatar}
                              alt={employee.fullName}
                            />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                            <div className="text-sm text-gray-500">{employee.phoneNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.salary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {yearsOfService} ساڵ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {age} ساڵ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {employee.status === 'active' ? (
                            <>
                              <CheckCircle size={14} className="ml-1" />
                              چالاک
                            </>
                          ) : (
                            <>
                              <XCircle size={14} className="ml-1" />
                              ناچالاک
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex justify-start space-x-2">
                          <button
                            onClick={() => viewEmployeeProfile(employee)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md"
                            title="بینینی پڕۆفایل"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => editEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md mx-2"
                            title="دەستکاری کارمەند"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md"
                            title="سڕینەوەی کارمەند"
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
                پیشاندانی {indexOfFirstEmployee + 1} تا {Math.min(indexOfLastEmployee, filteredEmployees.length)} لە {filteredEmployees.length} کارمەند
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

      {/* Employee Profile Modal */}
      {showProfileModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 left-4 text-white hover:text-blue-200"
              >
                <X size={20} />
              </button>
              <div className="flex items-center">
                <div className="ml-6">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.fullName}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployee.fullName}</h2>
                  <p className="text-blue-100">ناسنامەی کارمەند: #{selectedEmployee.id}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedEmployee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedEmployee.status === 'active' ? 'چالاک' : 'ناچالاک'}
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
                      <p className="font-medium">{selectedEmployee.fullName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ڕەگەز</p>
                      <p className="font-medium">{selectedEmployee.gender}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ئیمەیل</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ژمارەی تەلەفۆن</p>
                      <p className="font-medium">{selectedEmployee.phoneNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">ژمارەی تەلەفۆنی کاتی نائاسایی</p>
                      <p className="font-medium">{selectedEmployee.secondaryNumber}</p>
                    </div>

                    <div className="flex items-center">
                      <Cake size={16} className="text-gray-400 ml-1" />
                      <div>
                        <p className="text-sm text-gray-500">بەرواری لەدایکبوون</p>
                        <p className="font-medium">
                          {formatDate(selectedEmployee.dateOfBirth)} ({calculateAge(selectedEmployee.dateOfBirth)} ساڵ)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 ml-1" />
                      <div>
                        <p className="text-sm text-gray-500">ناونیشان</p>
                        <p className="font-medium">{selectedEmployee.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کار</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">رۆڵ</p>
                      <p className="font-medium">{selectedEmployee.role}</p>
                    </div>

                    <div className="flex items-center">
                      <DollarSign size={16} className="text-gray-400 ml-1" />
                      <div>
                        <p className="text-sm text-gray-500">مووچە</p>
                        <p className="font-medium">{selectedEmployee.salary}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرواری دەستپێکردن</p>
                      <p className="font-medium">
                        {formatDate(selectedEmployee.startWorkingDate)} ({calculateYearsOfService(selectedEmployee.startWorkingDate)} ساڵ خزمەت)
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">دۆخ</p>
                      <p className={`font-medium ${selectedEmployee.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedEmployee.status === 'active' ? 'چالاک' : 'ناچالاک'}
                      </p>
                    </div>
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
                    editEmployee(selectedEmployee);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit size={16} className="ml-1" />
                  دەستکاری کارمەند
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
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
                    src={editingEmployee.avatar}
                    alt={editingEmployee.fullName}
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">دەستکاری کارمەند</h2>
                  <p className="text-blue-100">ناسنامەی کارمەند: #{editingEmployee.id}</p>
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
                        name="fullName"
                        value={editingEmployee.fullName}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ڕەگەز</label>
                      <select
                        name="gender"
                        value={editingEmployee.gender}
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
                        value={editingEmployee.email}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆن</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editingEmployee.phoneNumber}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆنی کاتی نائاسایی</label>
                      <input
                        type="text"
                        name="secondaryNumber"
                        value={editingEmployee.secondaryNumber}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری لەدایکبوون</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editingEmployee.dateOfBirth}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ناونیشان</label>
                      <input
                        type="text"
                        name="address"
                        value={editingEmployee.address}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کار</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رۆڵ</label>
                      <select
                        name="role"
                        value={editingEmployee.role}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ڕاهێنەر">ڕاهێنەر</option>
                        <option value="کارمەند">کارمەند</option>
                        <option value="بەڕێوەبەر">بەڕێوەبەر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">مووچە</label>
                      <input
                        type="text"
                        name="salary"
                        value={editingEmployee.salary}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری دەستپێکردن</label>
                      <input
                        type="date"
                        name="startWorkingDate"
                        value={editingEmployee.startWorkingDate}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">دۆخ</label>
                      <select
                        name="status"
                        value={editingEmployee.status}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">چالاک</option>
                        <option value="inactive">ناچالاک</option>
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
                  onClick={saveEditedEmployee}
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