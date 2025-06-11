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
  Filter,
  Save,
  X,
  DollarSign,
  MapPin,
  Cake
} from 'lucide-react';
import Navbar from '../../components/layout/Nav';
import axios from 'axios';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal';

export default function EmployeesPage() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/employees/getallemployee`)

        if (res.status == 200) {
          setEmployees(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchEmployees();
  }, [])

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

  const employeesPerPage = 10;

  const filteredEmployees = employees?.filter(employee => {
    if (!employee || typeof employee !== 'object') return false;

    const matchesSearch =
      (employee.e_id ? employee.e_id.toString().includes(searchTerm) : false) ||
      (employee.name ? employee.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (employee.phoneNumber ? employee.phoneNumber.includes(searchTerm) : false);

    const matchesRole =
      filterRole === 'all' ||
      (employee.role ? employee.role === filterRole : false);

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredEmployees?.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees?.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const viewEmployeeProfile = (employee) => {
    setSelectedEmployee(employee);
    setShowProfileModal(true);
  };

  const editEmployee = (employee) => {
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  };

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setEditingEmployee({
        ...editingEmployee,
        img: URL.createObjectURL(file)
      });
    }
  };

  const saveEditedEmployee = async () => {

    if (!editingEmployee) return;

    console.log(editingEmployee);

    if (!editingEmployee.name || !editingEmployee.address || !editingEmployee.gender || !editingEmployee.date_of_birth ||
      !editingEmployee.phoneNumber || !editingEmployee.email || !editingEmployee.salary || !editingEmployee.role) {
      alert('all fields are required')
      return;
    }

    try {
      const formData = new FormData();
      formData.append('e_id', editingEmployee.e_id);
      formData.append('name', editingEmployee.name);
      formData.append('address', editingEmployee.address);
      formData.append('gender', editingEmployee.gender);
      formData.append('date_of_birth', editingEmployee.date_of_birth);
      formData.append('phoneNumber', editingEmployee.phoneNumber);
      formData.append('salary', editingEmployee.salary);
      formData.append('role', editingEmployee.role);
      formData.append('working_date', editingEmployee.working_date);
      formData.append('email', editingEmployee.email);

      if (editingEmployee.emergencyphoneNumber) {
        formData.append('emergencyphoneNumber', editingEmployee.emergencyphoneNumber);
      }

      if (imageFile) {
        formData.append('img', imageFile);
      }

      const res = await axios.patch(`http://localhost:3000/employees/updateemployee/${editingEmployee.e_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.status == 200) {
        alert('saved successfully')
        setEmployees(employees?.map(employee =>
          employee.e_id === editingEmployee.e_id ? editingEmployee : employee
        ));
        setShowEditModal(false);
        if (selectedEmployee && selectedEmployee.e_id === editingEmployee.e_id) {
          setSelectedEmployee(editingEmployee);
        }

        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);

    }
  };

  const initiateDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(`http://localhost:3000/employees/deleteemployee/${employeeToDelete.e_id}`);

      if (res.status === 200) {
        setEmployees(employees?.filter(employee => employee.e_id !== employeeToDelete.e_id));
        alert('کارمەند بە سەرکەوتوویی سڕایەوە');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('هەڵەیەک ڕوویدا لە کاتی سڕینەوەی کارمەند');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku-IQ', options);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({
      ...editingEmployee,
      [name]: value
    });
  };

  const calculateTotalMonthlySalary = () => {
    return employees?.reduce((total, employee) => {
      const salaryValue = parseInt(employee.salary.replace(/[^0-9]/g, ''));
      return total + salaryValue;
    }, 0);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />

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
                    <p className="text-2xl font-bold text-blue-700">{employees?.length}</p>
                  </div>
                  <User size={24} className="text-blue-400" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">کۆی مووچەی مانگانە</p>
                    <p className="text-2xl font-bold text-green-700">
                      {(calculateTotalMonthlySalary() / 1000).toLocaleString()} د.ع
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
                      {((calculateTotalMonthlySalary() * 12) / 1000)?.toLocaleString()} د.ع
                    </p>
                  </div>
                  <Calendar size={24} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEmployees?.map(employee => {
                  const age = calculateAge(employee.date_of_birth);
                  const yearsOfService = calculateYearsOfService(employee.working_date);

                  return (
                    <tr key={employee.e_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{employee.e_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={employee.img}
                              alt={employee.name}
                            />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
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
                        {Number(employee.salary).toLocaleString('en-US')} د.ع
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {yearsOfService} ساڵ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {age} ساڵ
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
                            onClick={() => initiateDeleteEmployee(employee)}
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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                پیشاندانی {indexOfFirstEmployee + 1} تا {Math.min(indexOfLastEmployee, filteredEmployees?.length)} لە {filteredEmployees?.length} کارمەند
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <ChevronRight size={16} />
                </button>
                {[...Array(totalPages)]?.map((_, i) => (
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

      {showProfileModal && selectedEmployee && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    src={selectedEmployee.img}
                    alt={selectedEmployee.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                  <p className="text-blue-100">ناسنامەی کارمەند: #{selectedEmployee.e_id}</p>

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
                      <p className="font-medium">{selectedEmployee.name}</p>
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
                      <p className="font-medium">{selectedEmployee.emergencyphoneNumber}</p>
                    </div>

                    <div className="flex items-center">
                      <Cake size={16} className="text-gray-400 ml-1" />
                      <div>
                        <p className="text-sm text-gray-500">بەرواری لەدایکبوون</p>
                        <p className="font-medium">
                          {formatDate(selectedEmployee.date_of_birth)} ({calculateAge(selectedEmployee.date_of_birth)} ساڵ)
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
                        <p className="font-medium">
                          {Number(selectedEmployee.salary).toLocaleString('en-US')} د.ع
                        </p>

                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">بەرواری دەستپێکردن</p>
                      <p className="font-medium">
                        {formatDate(selectedEmployee.working_date)} ({selectedEmployee.working_years} ساڵ خزمەت)
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-start space-x-3">
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

      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-auto max-h-[90vh]">
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 left-4 text-white hover:text-blue-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold">دەستکاری کارمەند</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col items-center mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-2">
                    <img
                      src={imagePreview || editingEmployee.img || "https://via.placeholder.com/150"}
                      alt={editingEmployee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <span>هەڵبژاردنی وێنە</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کەسی</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ناوی تەواو</label>
                      <input
                        type="text"
                        name="name"
                        value={editingEmployee.name || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ڕەگەز</label>
                      <select
                        name="gender"
                        value={editingEmployee.gender || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="پیاو">پیاو</option>
                        <option value="ئافرەت">ئافرەت</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ئیمەیل</label>
                      <input
                        type="email"
                        name="email"
                        value={editingEmployee.email || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ژمارەی تەلەفۆن</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editingEmployee.phoneNumber || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ژمارەی تەلەفۆنی کاتی نائاسایی</label>
                      <input
                        type="text"
                        name="emergencyphoneNumber"
                        value={editingEmployee.emergencyphoneNumber || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">بەرواری لەدایکبوون</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={editingEmployee.date_of_birth ? new Date(editingEmployee.date_of_birth).toISOString().split('T')[0] : ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ناونیشان</label>
                      <input
                        type="text"
                        name="address"
                        value={editingEmployee.address || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کار</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">رۆڵ</label>
                      <select
                        name="role"
                        value={editingEmployee.role || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ڕاهێنەر">ڕاهێنەر</option>
                        <option value="کارمەند">کارمەند</option>
                        <option value="بەڕێوەبەر">بەڕێوەبەر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">مووچە</label>
                      <input
                        type="number"
                        name="salary"
                        value={editingEmployee.salary || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">بەرواری دەستپێکردن</label>
                      <input
                        type="date"
                        name="working_date"
                        value={editingEmployee.working_date ? new Date(editingEmployee.working_date).toISOString().split('T')[0] : ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-start space-x-3">
                <button
                  onClick={saveEditedEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  پاشەکەوتکردن
                  <Save size={16} className="mr-1" />
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mx-2"
                >
                  هەڵوەشاندنەوە
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        closeModal={() => setDeleteModalOpen(false)}
        onDelete={confirmDeleteEmployee}
        isDeleting={isDeleting}
        title="سڕینەوەی کارمەند"
        message={`ئایا دڵنیایت لە سڕینەوەی کارمەندی ${employeeToDelete?.name || ''}؟ ئەم کردارە ناگەڕێتەوە.`}
        confirmButtonText="سڕینەوە"
        cancelButtonText="پەشیمان بوونەوە"
      />

    </div >
  );
}