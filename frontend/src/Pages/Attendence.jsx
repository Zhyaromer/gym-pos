import { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  Users,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function AttendenceEmployeeAttendancePage() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toLocaleDateString('en-CA');
  const [currentDate, setCurrentDate] = useState(today);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [stats, setStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [formData, setFormData] = useState({
    e_id: '',
    name: '',
    img: '',
    attendence_id: '',
    attendence_date: currentDate,
    working_hours: '',
    role: 'ڕاهێنەر',
    state: 'هاتوو',
    checkInTime: '08:00',
    checkOutTime: '16:00',
    notes: ''
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/attendence/attendancesummary?date=${currentDate}`)

        if (res.status === 200) {
          const data = res.data;
          setEmployees(data.unattended_employee_list || []);
          setStats({
            total_employees: data.total_employees,
            attended_employees: data.attended_employees,
            unattended_employees: data.unattended_employees
          });
        }
      } catch (err) {
        console.log(err);
        setStats({
          total_employees: 0,
          attended_employees: 0,
          unattended_employees: 0
        });
        setEmployees([]);
      }
    }

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/attendence/attendedemployees?date=${currentDate}`)

        if (res.status === 200) {
          setAttendance(res.data.attended_employees || []);
        }
      } catch (err) {
        console.log(err);
        setAttendance([]);
      }
    }

    fetchSummary();
    fetchEmployees();
  }, [currentDate]);

  const filteredAttendance = attendance.filter(record =>
  (record.name.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'e_id') {
      const selectedEmployee = employees.find(emp => emp.e_id == value);

      if (name == 'state' && value == 'نەهاتوو') {
        setFormData({
          ...formData,
          state: value,
          checkInTime: null,
          checkOutTime: null,
        });
        return;
      }

      if (selectedEmployee) {
        setFormData({
          ...formData,
          e_id: value,
          name: selectedEmployee.name,
          role: selectedEmployee.role,
          [name]: value
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openAddModal = () => {
    setCurrentAttendance(null);
    setFormData({
      e_id: '',
      name: '',
      img: '',
      attendence_id: '',
      attendence_date: currentDate,
      working_hours: '',
      role: 'ڕاهێنەر',
      state: 'هاتوو',
      checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      checkOutTime: '',
      notes: '',
    });
    setShowAddModal(true);
  };

  const openEditModal = (record) => {
    setCurrentAttendance(record);
    setFormData({
      e_id: record.e_id,
      img: record.img || '',
      attendence_id: record.attendence_id,
      working_hours: record.working_hours,
      name: record.name,
      role: record.role,
      state: record.state,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      notes: record.notes,
      attendence_date: record.attendence_date
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (isEdit = false) => {
    if (isEdit) {
      try {
        let hasBeenUpdated = false;

        if (formData.state == 'نەهاتوو' && (formData.checkInTime || formData.checkOutTime)) {
          hasBeenUpdated = true;
        }

        if (formData.state == 'نەهاتوو') {
          formData.checkInTime = null;
          formData.checkOutTime = null;
        }

        const data = {
          attendence_id: formData.attendence_id,
          entry_time: formData.checkInTime,
          leaving_time: formData.checkOutTime || null,
          state: formData.state,
          note: formData.notes || null
        }

        const res = await axios.patch(`http://localhost:3000/attendence/updateattendence`, data);

        if (res.status === 200) {
          alert('تۆمار بە سەرکەوتوویی ویرایشکرا');

          const updatedAttendance = attendance.map(record =>
            record.e_id === currentAttendance.e_id ? { ...record, ...data } : record
          );

          setAttendance(updatedAttendance);
          setShowEditModal(false);

          if (hasBeenUpdated) {
            setStats(prevStats => ({
              ...prevStats,
              attended_employees: prevStats.attended_employees - 1,
              unattended_employees: prevStats.unattended_employees + 1
            }));
          } else {
            setStats(prevStats => ({
              ...prevStats,
              unattended_employees: prevStats.unattended_employees - 1,
              attended_employees: prevStats.attended_employees + 1
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {

        if (formData.state == 'نەهاتوو') {
          formData.checkInTime = null;
          formData.checkOutTime = null;
        }

        const data = {
          e_id: formData.e_id,
          attendence_date: formData.attendence_date,
          entry_time: formData.checkInTime,
          leaving_time: (formData.checkOutTime)?.trim() == "" ? null : formData.checkOutTime,
          state: formData.state,
          note: (formData.notes).trim() == "" ? null : formData.notes,
        }

        const res = await axios.post(`http://localhost:3000/attendence/addattendence`, data);

        const id = res.data.attendence_id;

        if (res.status === 200) {
          alert('تۆمار بە سەرکەوتوویی زیادکرا');
          const newRecord = {
            ...formData,
            attendence_id: id,
            date: currentDate
          };
          setAttendance([...attendance, newRecord]);
          setShowAddModal(false);

          const updateEmployees = employees.filter(emp => emp.e_id != data.e_id);
          setEmployees(updateEmployees);

          if (data.state === 'هاتوو') {
            setStats(prevStats => ({
              ...prevStats,
              attended_employees: prevStats.attended_employees + 1,
              unattended_employees: prevStats.unattended_employees - 1
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteRecord = async (id) => {
    if (confirm('ئایا دڵنیایت دەتەوێت ئەم تۆمارە بسڕیتەوە؟')) {
      try {
        const res = await axios.delete(`http://localhost:3000/attendence/deleteattendence/${id}`);

        if (res.status === 200) {
          const updatedAttendance = attendance.filter(record => record.attendence_id !== id);
          const stateAttendence = attendance.find(record => record.attendence_id == id);

          if (stateAttendence.state === 'هاتوو') {
            setStats(prevStats => ({
              ...prevStats,
              attended_employees: prevStats.attended_employees - 1,
              unattended_employees: prevStats.unattended_employees + 1
            }));
          }

          setAttendance(updatedAttendance);
          alert('تۆمار بە سەرکەوتوویی حذفکرا');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getstateBadgeClass = (state) => {
    switch (state) {
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

  const getstateIcon = (state) => {
    switch (state) {
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

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';

    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);

    const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const calculateLateDuration = (checkInTime) => {
    if (!checkInTime) return null;

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

  const calculateEarlyDeparture = (checkOutTime) => {
    if (!checkOutTime) return null;

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
      <Navbar />

      <div dir='rtl' className="container mx-auto p-4 md:p-6">
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
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-3 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
              >
                تۆمارکردنی نوێ
                <Plus size={18} className="mr-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">کۆی کارمەندان</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total_employees}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.attended_employees}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.unattended_employees}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <UserX size={20} />
              </div>
            </div>
          </div>
        </div>

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

        <div dir='rtl' className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead dir='rtl' className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کارمەند
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پلە
                  </th>
                  <th className="px-8 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      بەروار
                      <Calendar className="mr-1" size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      کاتی چوونەژوورەوە
                      <Clock className="mr-1" size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      کاتی چوونەدەرەوە
                      <Clock className="mr-1" size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کاتژمێری کارکردن
                  </th>
                  <th className=" py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بارودۆخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کردارەکان
                  </th>
                </tr>
              </thead>
              <tbody dir='rtl' className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.e_id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                          {record.img ? (
                            <img src={record.img} alt={record.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg">{record.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{record.name}</div>
                          <div className="text-xs text-gray-500">{record.e_id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {record.role}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                      {new Date(record.attendence_date).toLocaleDateString('ku')}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {!record?.checkInTime ? '-' : (
                        record.checkInTime.split(":").slice(0, 2).join(":")
                      )}
                      {record.checkInTime && calculateLateDuration(record.checkInTime) && (
                        <div className="text-xs text-yellow-600 mt-1 flex items-center justify-center">
                          درەنگ: {calculateLateDuration(record.checkInTime)}
                          <AlertCircle size={12} className="mr-1" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {!record?.checkOutTime ? '-' : (
                        record.checkOutTime.split(":").slice(0, 2).join(":")
                      )}

                      {record?.checkOutTime && calculateEarlyDeparture(record.checkOutTime) && (
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
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getstateBadgeClass(record.state)}`}>
                          {record.state}
                        </span>
                        {getstateIcon(record.state)}
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
                          onClick={() => deleteRecord(record.attendence_id)}
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

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden" dir="rtl">

            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                زیادکردنی تۆماری نوێ
                <Plus className="text-blue-500 mr-2" size={20} />
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
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
                      name="e_id"
                      value={formData.e_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">کارمەند هەڵبژێرە</option>
                      {employees.map(emp => (
                        <option key={emp.e_id} value={emp.e_id}>{emp.name} ({emp.e_id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">پۆست</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بارودۆخ</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="هاتوو">هاتوو</option>
                      <option value="نەهاتوو">نەهاتوو</option>
                    </select>
                  </div>
                </div>

                {formData.state === 'هاتوو' && (
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
                          required={formData.state === 'هاتوو'}
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
                onClick={() => handleSubmit(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-2 px-5 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
              >
                زیادکردن
                <Save size={18} className="mr-2" />
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-white py-2 px-5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3 transition-colors duration-200"
              >
                هەڵوەشاندنەوە
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden" dir="rtl">

            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                دەستکاریکردنی تۆمار
                <Edit className="text-blue-500 mr-2" size={20} />
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
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
                    <input
                      type="text"
                      value={formData.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">پۆست</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
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
                      value={new Date(formData.attendence_date).toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بارودۆخ</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="هاتوو">هاتوو</option>
                      <option value="نەهاتوو">نەهاتوو</option>
                    </select>
                  </div>
                </div>

                {formData.state === 'هاتوو' && (
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
                          required={formData.state === 'هاتوو'}
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
                onClick={() => handleSubmit(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-2 px-5 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
              >
                نوێکردنەوە
                <Save size={18} className="mr-2" />
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
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