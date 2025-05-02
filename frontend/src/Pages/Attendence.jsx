import { useState, useEffect } from 'react';
import { 
  Clock,
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Dumbbell,
  UserCircle,
  LogOut,
  Search,
  Users,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';

export default function AttendenceEmployeeAttendancePage() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [showModal, setShowModal] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    position: 'ڕاهێنەر',
    status: 'هاتوو',
    checkInTime: '08:00',
    checkOutTime: '16:00',
    notes: ''
  });

  // Mock employee data
  const [employees] = useState([
    { id: 'EMP001', name: 'سارا عەلی', position: 'ڕاهێنەر' },
    { id: 'EMP002', name: 'ئەحمەد کەریم', position: 'پارێزەر' },
    { id: 'EMP003', name: 'لەیلا محەممەد', position: 'ڕاهێنەر' },
    { id: 'EMP004', name: 'دلێر عەزیز', position: 'بەڕێوەبەر' },
    { id: 'EMP005', name: 'ڕەوەند عەبدوڵا', position: 'خزمەتگوزاری' },
    { id: 'EMP006', name: 'شەیدا حەسەن', position: 'ئەدمین' },
    { id: 'EMP007', name: 'نەرمین عوسمان', position: 'ڕاهێنەر' }
  ]);

  // Mock attendance data
  const [attendance, setAttendance] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'سارا عەلی',
      position: 'ڕاهێنەر',
      date: new Date().toISOString().slice(0, 10),
      status: 'هاتوو',
      checkInTime: '08:05',
      checkOutTime: '16:10',
      notes: ''
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'ئەحمەد کەریم',
      position: 'پارێزەر',
      date: new Date().toISOString().slice(0, 10),
      status: 'هاتوو',
      checkInTime: '07:55',
      checkOutTime: '15:58',
      notes: ''
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'لەیلا محەممەد',
      position: 'ڕاهێنەر',
      date: new Date().toISOString().slice(0, 10),
      status: 'هاتوو',
      checkInTime: '08:45',
      checkOutTime: '16:20',
      notes: 'کەمێك درەنگ هات'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'دلێر عەزیز',
      position: 'بەڕێوەبەر',
      date: new Date().toISOString().slice(0, 10),
      status: 'هاتوو',
      checkInTime: '09:00',
      checkOutTime: '17:30',
      notes: ''
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'ڕەوەند عەبدوڵا',
      position: 'خزمەتگوزاری',
      date: new Date().toISOString().slice(0, 10),
      status: 'نەهاتوو',
      checkInTime: '',
      checkOutTime: '',
      notes: 'نەخۆی'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      employeeName: 'شەیدا حەسەن',
      position: 'ئەدمین',
      date: new Date().toISOString().slice(0, 10),
      status: 'هاتوو',
      checkInTime: '08:00',
      checkOutTime: '16:00',
      notes: ''
    },
    {
      id: 7,
      employeeId: 'EMP007',
      employeeName: 'نەرمین عوسمان',
      position: 'ڕاهێنەر',
      date: new Date().toISOString().slice(0, 10),
      status: 'هاتوو',
      checkInTime: '13:55',
      checkOutTime: '21:58',
      notes: 'شەفتەی ئێوارە'
    }
  ]);

  // Filter attendance based on search term and date
  const filteredAttendance = attendance.filter(record => 
    (record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    record.date === currentDate
  ))

  // Calculate attendance summary
  const presentCount = filteredAttendance.filter(r => r.status === 'هاتوو').length;
  const absentCount = filteredAttendance.filter(r => r.status === 'نەهاتوو').length;
  // Remove lateCount since we're not using it as a separate status
  const totalEmployees = employees.length;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If employee is selected, auto-fill their details
    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp.id === value);
      if (selectedEmployee) {
        setFormData({
          ...formData,
          employeeId: value,
          employeeName: selectedEmployee.name,
          position: selectedEmployee.position,
          [name]: value
        });
        return;
      }
    }
    
    // Auto-detect late status based on check-in time
    if (name === 'checkInTime' && value) {
      const [hour, minute] = value.split(':').map(Number);
      const isLate = hour > 8 || (hour === 8 && minute > 15); // More than 15 minutes late
      
      setFormData({
        ...formData,
        [name]: value,
        status: isLate ? 'درەنگ' : 'هاتوو'
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open modal to add a new attendance record
  const openAddModal = () => {
    setCurrentAttendance(null);
    setFormData({
      employeeId: '',
      employeeName: '',
      position: 'ڕاهێنەر',
      status: 'هاتوو',
      checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      checkOutTime: '',
      notes: '',
      date: currentDate
    });
    setShowModal(true);
  };

  // Open modal to edit an attendance record
  const openEditModal = (record) => {
    setCurrentAttendance(record);
    setFormData({
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      position: record.position,
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      notes: record.notes,
      date: record.date
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (currentAttendance) {
      // Update existing record
      const updatedAttendance = attendance.map(record => 
        record.id === currentAttendance.id ? { ...record, ...formData } : record
      );
      setAttendance(updatedAttendance);
    } else {
      // Add new record
      const newRecord = {
        id: attendance.length + 1,
        ...formData,
        date: currentDate
      };
      setAttendance([...attendance, newRecord]);
    }
    setShowModal(false);
  };

  // Delete an attendance record
  const deleteRecord = (id) => {
    if (confirm('ئایا دڵنیایت دەتەوێت ئەم تۆمارە بسڕیتەوە؟')) {
      const updatedAttendance = attendance.filter(record => record.id !== id);
      setAttendance(updatedAttendance);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'هاتوو':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'نەهاتوو':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'درەنگ':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'هاتوو':
        return <UserCheck size={16} className="text-green-500 mr-1" />;
      case 'نەهاتوو':
        return <UserX size={16} className="text-red-500 mr-1" />;
      case 'درەنگ':
        return <AlertCircle size={16} className="text-yellow-500 mr-1" />;
      default:
        return <AlertCircle size={16} className="text-gray-500 mr-1" />;
    }
  };

  // Calculate working hours
  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);
    
    const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  // Calculate late duration
  const calculateLateDuration = (checkInTime) => {
    if (!checkInTime) return null;
    
    // Expected check-in time (8:00 AM)
    const expectedHour = 8;
    const expectedMinute = 0;
    
    const [actualHour, actualMinute] = checkInTime.split(':').map(Number);
    
    const expectedTotalMinutes = expectedHour * 60 + expectedMinute;
    const actualTotalMinutes = actualHour * 60 + actualMinute;
    
    const lateMinutes = actualTotalMinutes - expectedTotalMinutes;
    
    if (lateMinutes <= 0) return null;
    
    const hours = Math.floor(lateMinutes / 60);
    const minutes = lateMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate early departure
  const calculateEarlyDeparture = (checkOutTime) => {
    if (!checkOutTime) return null;
    
    // Expected check-out time (16:00 PM)
    const expectedHour = 16;
    const expectedMinute = 0;
    
    const [actualHour, actualMinute] = checkOutTime.split(':').map(Number);
    
    const expectedTotalMinutes = expectedHour * 60 + expectedMinute;
    const actualTotalMinutes = actualHour * 60 + actualMinute;
    
    const earlyMinutes = expectedTotalMinutes - actualTotalMinutes;
    
    if (earlyMinutes <= 0) return null;
    
    const hours = Math.floor(earlyMinutes / 60);
    const minutes = earlyMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <Dumbbell className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">یانەی تەندروستی</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full px-3 py-1 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <UserCircle className="text-blue-600" size={20} />
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <LogOut className="text-gray-600 hover:text-red-600" size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div dir='rtl' className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">سیستەمی بەشداری کارمەندان</h1>
              <p className="text-gray-600 flex items-center">
                <UserCheck size={16} className="ml-1" />
                بەڕێوەبردنی هاتووی کارمەندان
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={openAddModal}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                تۆمارکردنی نوێ
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">کۆی کارمەندان</p>
                <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">هاتوو</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <UserCheck size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">نەهاتوو</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <UserX size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="relative w-full md:w-80 mb-4 md:mb-0">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="گەڕان بە ناو یان پۆست..."
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div dir='rtl' className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead dir='rtl' className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کارمەند
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پۆست
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      <Calendar className="mr-1" size={14} />
                      بەروار
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      <Clock className="mr-1" size={14} />
                      کاتی چوونەژوورەوە
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      <Clock className="mr-1" size={14} />
                      کاتی چوونەدەرەوە
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کاتژمێری کارکردن
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بارودۆخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کردارەکان
                  </th>
                </tr>
              </thead>
              <tbody dir='rtl' className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                          {record.employeeName.charAt(0)}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                          <div className="text-xs text-gray-500">{record.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {record.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                      {new Date(record.date).toLocaleDateString('ku')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {record.checkInTime || '-'}
                      {record.checkInTime && calculateLateDuration(record.checkInTime) && (
                        <div className="text-xs text-yellow-600 mt-1 flex items-center justify-center">
                          درەنگ: {calculateLateDuration(record.checkInTime)}
                          <AlertCircle size={12} className="mr-1" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {record.checkOutTime || '-'}
                      {record.checkOutTime && calculateEarlyDeparture(record.checkOutTime) && (
                        <div className="text-xs text-red-600 mt-1 flex items-center justify-center">
                          زوو: {calculateEarlyDeparture(record.checkOutTime)}
                          <AlertCircle size={12} className="mr-1" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {calculateWorkingHours(record.checkInTime, record.checkOutTime)}
                    </td>
                    <td className=" whitespace-nowrap">
                      <div className="flex items-center justify-left">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusBadgeClass(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex justify-start space-x-3">
                        <button 
                          onClick={() => openEditModal(record)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="دەستکاری"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteRecord(record.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="سڕینەوە"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty state */}
          {filteredAttendance.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                <UserX className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">هیچ تۆمارێک نییە</h3>
              <p className="mt-1 text-sm text-gray-500">
                هیچ تۆمارێکی بەشداری بۆ ئەم بەروارە نییە.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-mr-1 ml-2 h-5 w-5" />
                  زیادکردنی تۆمار
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden" dir="rtl">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {currentAttendance ? (
                  <>
                    <Edit className="text-blue-500 mr-2" size={20} />
                    دەستکاریکردنی تۆمار
                  </>
                ) : (
                  <>
                    <Plus className="text-blue-500 mr-2" size={20} />
                    زیادکردنی تۆماری نوێ
                  </>
                )}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">کارمەند</label>
                    <select
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={!!currentAttendance}
                    >
                      <option value="">کارمەند هەڵبژێرە</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">پۆست</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بەروار</label>
                    <input
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!!currentAttendance}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بارودۆخ</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="هاتوو">هاتوو</option>
                      <option value="نەهاتوو">نەهاتوو</option>
                    </select>
                  </div>
                </div>
                
                {formData.status === 'هاتوو' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کاتی چوونەژوورەوە</label>
                        <input
                          type="time"
                          name="checkInTime"
                          value={formData.checkInTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={formData.status === 'هاتوو'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کاتی چوونەدەرەوە</label>
                        <input
                          type="time"
                          name="checkOutTime"
                          value={formData.checkOutTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تێبینی</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="تێبینی..."
                      />
                    </div>
                  </>
                )}
              </form>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-2 justify-start border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-2 px-5 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {currentAttendance ? 'نوێکردنەوە' : 'زیادکردن'}
                <Save size={18} className="mr-2" />
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-white py-2 px-5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3 transition-colors duration-200"
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