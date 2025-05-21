import { useState, useEffect } from 'react';
import {
  Search,
  User,
  Calendar,
  CheckCircle,
  Clock,
  CheckSquare,
  AlertCircle,
  Plus,
  Save,
  X,
  Trash2,
  PieChart,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function SalaryPayments() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [notes, setNotes] = useState('');
  const [stats, setStatss] = useState([]);
  const [unpaidemployees, setUnpaidemployees] = useState([]);
  const [pair_or_partial_employees, setPair_or_partial_employees] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const monthNames = [
    "کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران",
    "تەمموز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"
  ];

  useEffect(() => {
    console.log(selectedMonth)
  }, [selectedMonth])

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/employees/getallemployeepaycheck?year=${selectedYear}&month=${selectedMonth}`)
        setStatss(res.data.summary)
        setUnpaidemployees(res.data.details.unpaid);
        setPair_or_partial_employees(res.data.details.paid_or_partially_paid);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [selectedYear, selectedMonth, refreshTrigger]);

  const filteredEmployees = pair_or_partial_employees.filter(employee => {
    return (
      employee.e_id.toString().includes(searchTerm) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getPaymentRecord = (employeeId) => {
    if (!Array.isArray(paymentRecords)) {
      return { status: 'pending', paymentDate: null, amount: 0, amountDisplay: "0 د.ع" };
    }

    return paymentRecords.find(
      record => record.employeeId === employeeId &&
        record.year === selectedYear &&
        record.month === selectedMonth
    ) || { status: 'pending', paymentDate: null, amount: 0, amountDisplay: "0 د.ع" };
  };

  const togglePaymentStatus = async (employeeId) => {
    setIsLoading(true);
    const employee = pair_or_partial_employees.find(e => e.e_id === employeeId);
    if (!employee) return;

    try {
      const res = await axios.patch(`http://localhost:3000/employees/markfullpayment/${employee.e_id}/${employee.year}/${employee.month}`);

      if (res.status === 200) {
        alert("payment marked as fully paid");
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      alert("error marking payment as fully paid");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPaymentRecord = async () => {
    if (!selectedEmployee) return;
    setIsLoading(true);
    const amount = parseInt(paymentAmount) || selectedEmployee.salary;

    //fix later
    const formData = {
      year: selectedYear,
      month: selectedMonth,
      paymentDate: new Date().toISOString().split('T')[0],
      paid_amount: amount,
      amount: selectedEmployee.amount_due,
      isPartial: isPartialPayment,
      notes: notes
    };

    try {
      const res = await axios.post(`http://localhost:3000/employees/payingemployee/${selectedEmployee.e_id}`, formData)

      if (res.status === 200) {
        setShowAddModal(false);
        resetForm();
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePaymentRecord = async (recordId) => {
    const employee = pair_or_partial_employees.find(e => e.e_id === recordId);
    if (window.confirm('دڵنیای لە سڕینەوەی ئەم تۆمارە؟')) {
      setIsLoading(true);
      try {
        const res = await axios.delete(`http://localhost:3000/employees/deleteemployeepaycheck/${employee.ep_id}`);
        if (res.status === 200) {
          alert("payment record deleted");
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setPaymentAmount('');
    setIsPartialPayment(false);
    setNotes('');
  };

  const getPaymentStatusBadge = (status, employeeId) => {
    const employee = filteredEmployees.find(e => e.e_id === employeeId);

    switch (status) {
      case 'Fully Paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="ml-1" />
            پێدراوە
          </span>
        );
      case 'Partially Paid':
        return (
          <div className="flex flex-col space-y-1">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertCircle size={14} className="ml-1" />
              بەشێکی پێدراوە
            </span>
            <span className="text-xs text-gray-500">
              ماوە: {(employee.amount_due / 1).toLocaleString()} د.ع
            </span>
          </div>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock size={14} className="ml-1" />
            چاوەڕوانکراو
          </span>
        );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold mb-4 md:mb-0">مووچەی مانگانەی کارمەندان</h2>

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
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {generateYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <Calendar size={18} className={`text-gray-500`} />

                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </select>
                <Calendar size={18} className={`text-gray-500`} />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 flex items-center justify-center">
              <RefreshCw size={20} className="animate-spin text-blue-500 mr-2" />
              <span>چاوەڕوان بە...</span>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              زیادکردنی تۆماری مووچە
              <Plus size={16} className="mr-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کارمەندانی چالاک</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {stats.total_employees_count}
                  </p>
                </div>
                <User size={24} className="text-blue-400" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کۆی مووچەی گونجاو</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {(stats?.total_salary_amount / 1)?.toLocaleString()} د.ع
                  </p>
                </div>
                <PieChart size={24} className="text-purple-400" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کۆی مووچەی پێدراو</p>
                  <p className="text-2xl font-bold text-green-700">
                    {(stats?.total_paid_amount / 1)?.toLocaleString()} د.ع
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.paid_employees_count} کارمەند
                  </p>
                </div>
                <CheckCircle size={24} className="text-green-400" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">بەشێکی پێدراو</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {(stats.partially_paid_amount / 1)?.toLocaleString()} د.ع
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.partially_paid_count} کارمەند
                  </p>
                </div>
                <AlertCircle size={24} className="text-yellow-400" />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کۆی مووچەی ماوە</p>
                  <p className="text-2xl font-bold text-red-700">
                    {(stats.unpaid_salary_amount / 1)?.toLocaleString()} د.ع
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.unpaid_employees_count} کارمەند
                  </p>
                </div>
                <Clock size={24} className="text-red-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">ڕێژەی پێدان</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${(stats.total_paid_amount / stats.total_salary_amount * 100) || 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {Math.round((stats.total_paid_amount / stats.total_salary_amount * 100) || 0)}%
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {stats.paid_employees_count} کارمەند پێدراوە
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">ڕێژەی بەشێکی پێدراو</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{
                      width: `${((stats.partially_paid_amount / stats.total_salary_amount) * 100) || 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {Math.round(((stats.partially_paid_amount / stats.total_salary_amount) * 100) || 0)}%
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {stats.partially_paid_count} کارمەند بەشێکی پێدراوە
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">ڕێژەی مووچەی ماوە</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{
                      width: `${((stats.unpaid_employees_count / stats.total_employees_count) * 100) || 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {Math.round((stats.unpaid_employees_count / stats.total_employees_count) * 100) || 0}%
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {stats.unpaid_employees_count} کارمەند مووچەیان ماوە
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ناسنامە</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کارمەند</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رۆڵ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مووچەی گونجاو</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بڕی پێدراو</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بەرواری پێدان</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تێبینی</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(employee => {
                  const paymentRecord = getPaymentRecord(employee?.e_id);

                  return (
                    <tr key={`${employee.e_id}-${paymentRecord.e_id}`} className="hover:bg-gray-50">
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
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(employee.salary / 1).toLocaleString()} د.ع
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((employee.paid_amount / 1).toLocaleString() + " د.ع") || "0 د.ع"}
                        {!employee.has_paid_full && (
                          <span className="text-xs text-yellow-600 block">
                            ماوە: {(employee.amount_due / 1).toLocaleString()} د.ع
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(employee.paid_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {employee.note || '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2 space-x-reverse">
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          {getPaymentStatusBadge(employee.payment_status, employee.e_id)}
                          <button
                            onClick={() => deletePaymentRecord(employee.e_id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                            title="سڕینەوە"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {employee.payment_status !== 'Fully Paid' && (
                          <div className="mt-2 flex justify-center">
                            <button
                              onClick={() => togglePaymentStatus(employee.e_id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                              <CheckSquare size={14} className="ml-1" />
                              نیشانکردن وەک پێدراو
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-10">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">هیچ تۆماری مووچە بۆ ئەم مانگە نەدۆزرایەوە</p>
              <p className="text-gray-400 mt-2">دەتوانیت تۆماری نوێ زیاد بکەیت بە کلیک کردن لەسەر دوگمەی "زیادکردنی تۆماری مووچە"</p>
            </div>
          )}
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">زیادکردنی تۆماری مووچە</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">کارمەند</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedEmployee ? selectedEmployee.e_id : ''}
                onChange={(e) => {
                  const employeeId = parseInt(e.target.value);
                  const employee = unpaidemployees.find(emp => emp.e_id === employeeId);
                  setSelectedEmployee(employee);
                  setPaymentAmount(employee ? employee.salary.toString() : '');
                }}
              >
                <option value="">کارمەندێک هەڵبژێرە</option>
                {unpaidemployees.map(employee => (
                  <option key={employee.e_id} value={employee.e_id}>
                    {employee.name} - {employee.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">بڕی مووچە</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="بڕی مووچە بنووسە"
                />
                <span className="absolute right-3 top-2 text-gray-500">د.ع</span>
              </div>
              {selectedEmployee && (
                <p className="text-xs text-gray-500 mt-1">
                  مووچەی گونجاو: {(selectedEmployee.salary / 1)?.toLocaleString()} د.ع
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={isPartialPayment}
                  onChange={(e) => setIsPartialPayment(e.target.checked)}
                />
                <span className="text-sm text-gray-700">ئەمە مووچەی بەشێکیە</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">تێبینی</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تێبینی بنووسە (ئارەزوومەندە)"
              />
            </div>

            <div className="flex justify-start gap-2">
              <button
                onClick={createPaymentRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                disabled={!selectedEmployee}
              >
                پاشەکەوتکردن
                <Save size={16} className="mr-1" />
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
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