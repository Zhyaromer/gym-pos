import { useState, useEffect } from 'react';
import {
  Search,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  CheckSquare,
  AlertCircle,
  Plus,
  Save,
  X,
  Edit,
  Trash2,
  PieChart
} from 'lucide-react';
import Navbar from '../components/layout/Nav';

export default function SalaryPayments() {
  const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      fullName: "سارا ئەحمەد",
      email: "sara@example.com",
      phoneNumber: "0770-123-4567",
      role: "ڕاهێنەر",
      salary: 750000, // Stored as number for calculations
      salaryDisplay: "750,000 د.ع",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      status: "active"
    },
    {
      id: 2,
      fullName: "ئاکۆ محەمەد",
      email: "ako@example.com",
      phoneNumber: "0771-234-5678",
      role: "کارمەند",
      salary: 500000,
      salaryDisplay: "500,000 د.ع",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "active"
    },
    {
      id: 3,
      fullName: "شیلان ڕەزا",
      email: "shilan@example.com",
      phoneNumber: "0772-345-6789",
      role: "کارمەند",
      salary: 450000,
      salaryDisplay: "450,000 د.ع",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "active"
    }
  ]);

  // Generate years for dropdown
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // Month names in Kurdish
  const monthNames = [
    "کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران",
    "تەمموز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"
  ];

  // Fetch payment records when year/month changes
  useEffect(() => {
    // Mock data with partial payment example
    const mockRecords = [
      {
        id: `1-${selectedYear}-${selectedMonth}`,
        employeeId: 1,
        year: selectedYear,
        month: selectedMonth,
        status: 'paid',
        paymentDate: new Date(selectedYear, selectedMonth, 15).toISOString(),
        amount: 750000,
        amountDisplay: "750,000 د.ع",
        isPartial: false,
        notes: 'تم الدفع كامل'
      },
      {
        id: `2-${selectedYear}-${selectedMonth}`,
        employeeId: 2,
        year: selectedYear,
        month: selectedMonth,
        status: 'partial',
        paymentDate: new Date(selectedYear, selectedMonth, 10).toISOString(),
        amount: 250000,
        amountDisplay: "250,000 د.ع",
        isPartial: true,
        notes: 'الدفع الجزئي الأول'
      }
    ];

    setPaymentRecords(mockRecords);
  }, [selectedYear, selectedMonth]);

  // Get employees who have payment records for the selected month/year
  const employeesWithPayments = employees.filter(employee => {
    return paymentRecords.some(record => 
      record.employeeId === employee.id && 
      record.year === selectedYear && 
      record.month === selectedMonth
    );
  });

  // Filter employees with payments based on search term
  const filteredEmployees = employeesWithPayments.filter(employee => {
    return (
      employee.id.toString().includes(searchTerm) ||
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber.includes(searchTerm)
    );
  });

  // Get employees without payment records
  const employeesWithoutPayments = employees.filter(employee => {
    return !paymentRecords.some(record => 
      record.employeeId === employee.id && 
      record.year === selectedYear && 
      record.month === selectedMonth
    );
  });

  // Get payment record for an employee
  const getPaymentRecord = (employeeId) => {
    return paymentRecords.find(
      record => record.employeeId === employeeId && 
               record.year === selectedYear && 
               record.month === selectedMonth
    ) || { status: 'pending', paymentDate: null, amount: 0, amountDisplay: "0 د.ع" };
  };

  const calculatePaymentStats = () => {
    let stats = {
      totalActiveEmployees: 0,
      employeesPaid: 0,
      employeesPartial: 0,
      employeesUnpaid: 0,
      totalSalaryShouldBePaid: 0,
      totalAmountPaid: 0,
      totalAmountPartialPaid: 0,
      totalAmountRemaining: 0,
      totalPartialRemaining: 0
    };
  
    // Calculate for all active employees
    employees.forEach(employee => {
      if (employee.status !== 'active') return;
      
      stats.totalActiveEmployees++;
      stats.totalSalaryShouldBePaid += employee.salary;
  
      const paymentRecord = paymentRecords.find(record => 
        record.employeeId === employee.id && 
        record.year === selectedYear && 
        record.month === selectedMonth
      );
  
      if (!paymentRecord) {
        // No payment record exists (completely unpaid)
        stats.employeesUnpaid++;
        stats.totalAmountRemaining += employee.salary;
      } else {
        if (paymentRecord.status === 'paid') {
          // Fully paid
          stats.employeesPaid++;
          stats.totalAmountPaid += paymentRecord.amount;
        } else if (paymentRecord.status === 'partial') {
          // Partial payment
          stats.employeesPartial++;
          stats.totalAmountPartialPaid += paymentRecord.amount;
          const remaining = employee.salary - paymentRecord.amount;
          stats.totalPartialRemaining += remaining;
          stats.totalAmountRemaining += remaining;
        } else {
          // Payment record exists but status is pending (unpaid)
          stats.employeesUnpaid++;
          stats.totalAmountRemaining += employee.salary;
        }
      }
    });
  
    return stats;
  };

  const paymentStats = calculatePaymentStats();

  // Toggle payment status
  const togglePaymentStatus = (employeeId, isPartial = false, partialAmount = 0) => {
    setPaymentRecords(prev => {
      const employee = employees.find(e => e.id === employeeId);
      if (!employee) return prev;
  
      // Find existing record if any
      const existingRecord = prev.find(
        record => record.employeeId === employeeId &&
                 record.year === selectedYear &&
                 record.month === selectedMonth
      );
  
      if (existingRecord) {
        // Update existing record
        return prev.map(record => {
          if (record.id === existingRecord.id) {
            if (isPartial) {
              // Handle partial payment
              return {
                ...record,
                status: 'partial',
                amount: partialAmount,
                amountDisplay: `${partialAmount.toLocaleString()} د.ع`,
                paymentDate: new Date().toISOString(),
                isPartial: true
              };
            } else {
              // Toggle between paid/pending
              const newStatus = record.status === 'paid' ? 'pending' : 'paid';
              return {
                ...record,
                status: newStatus,
                paymentDate: newStatus === 'paid' ? new Date().toISOString() : null,
                amount: newStatus === 'paid' ? employee.salary : 0,
                amountDisplay: newStatus === 'paid' 
                  ? `${employee.salary.toLocaleString()} د.ع` 
                  : "0 د.ع",
                isPartial: false
              };
            }
          }
          return record;
        });
      } else {
        // Create new record
        const newRecord = {
          id: `${employeeId}-${selectedYear}-${selectedMonth}-${Date.now()}`,
          employeeId,
          year: selectedYear,
          month: selectedMonth,
          status: isPartial ? 'partial' : 'paid',
          paymentDate: new Date().toISOString(),
          amount: isPartial ? partialAmount : employee.salary,
          amountDisplay: isPartial 
            ? `${partialAmount.toLocaleString()} د.ع` 
            : `${employee.salary.toLocaleString()} د.ع`,
          isPartial,
          notes: ''
        };
        return [...prev, newRecord];
      }
    });
  };

  // Open edit modal
  const openEditModal = (record) => {
    const employee = employees.find(emp => emp.id === record.employeeId);
    setSelectedRecord(record);
    setSelectedEmployee(employee);
    setPaymentAmount(record.amount.toString());
    setIsPartialPayment(record.isPartial || false);
    setNotes(record.notes || '');
    setShowEditModal(true);
  };

  // Create a new payment record
  const createPaymentRecord = () => {
    if (!selectedEmployee) return;

    const amount = parseInt(paymentAmount) || selectedEmployee.salary;
    
    const newRecord = {
      id: `${selectedEmployee.id}-${selectedYear}-${selectedMonth}-${Date.now()}`,
      employeeId: selectedEmployee.id,
      year: selectedYear,
      month: selectedMonth,
      status: isPartialPayment ? 'partial' : 'pending',
      paymentDate: null,
      amount: amount,
      amountDisplay: amount.toLocaleString() + " د.ع",
      isPartial: isPartialPayment,
      notes: notes
    };

    setPaymentRecords(prev => [...prev, newRecord]);
    setShowAddModal(false);
    resetForm();
  };

  // Update payment record
  const updatePaymentRecord = () => {
    if (!selectedRecord) return;

    const amount = parseInt(paymentAmount) || selectedEmployee.salary;

    setPaymentRecords(prev => {
      return prev.map(record => {
        if (record.id === selectedRecord.id) {
          return {
            ...record,
            amount: amount,
            amountDisplay: amount.toLocaleString() + " د.ع",
            isPartial: isPartialPayment,
            notes: notes,
            status: isPartialPayment ? 'partial' : record.status
          };
        }
        return record;
      });
    });

    setShowEditModal(false);
    resetForm();
  };

  // Delete payment record
  const deletePaymentRecord = (recordId) => {
    if (window.confirm('دڵنیای لە سڕینەوەی ئەم تۆمارە؟')) {
      setPaymentRecords(prev => prev.filter(record => record.id !== recordId));
    }
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedEmployee(null);
    setSelectedRecord(null);
    setPaymentAmount('');
    setIsPartialPayment(false);
    setNotes('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku-IQ', options);
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status, employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    const record = getPaymentRecord(employeeId);
    
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="ml-1" />
            پێدراوە
          </span>
        );
      case 'partial':
        return (
          <div className="flex flex-col space-y-1">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertCircle size={14} className="ml-1" />
              بەشێکی پێدراوە
            </span>
            <span className="text-xs text-gray-500">
              ماوە: {(employee.salary - record.amount).toLocaleString()} د.ع
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
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
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

              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 ml-2" />
                  <select
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {generateYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 ml-2" />
                  <select
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Add Payment Record Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={16} className="ml-2" />
              زیادکردنی تۆماری مووچە
            </button>
          </div>

         {/* Updated Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
  {/* Total Active Employees */}
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">کارمەندانی چالاک</p>
        <p className="text-2xl font-bold text-blue-700">
          {paymentStats.totalActiveEmployees}
        </p>
      </div>
      <User size={24} className="text-blue-400" />
    </div>
  </div>
  
  {/* Total Should Be Paid */}
  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">کۆی مووچەی گونجاو</p>
        <p className="text-2xl font-bold text-purple-700">
          {paymentStats.totalSalaryShouldBePaid.toLocaleString()} د.ع
        </p>
      </div>
      <PieChart size={24} className="text-purple-400" />
    </div>
  </div>
  
  {/* Total Paid */}
  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">کۆی مووچەی پێدراو</p>
        <p className="text-2xl font-bold text-green-700">
          {paymentStats.totalAmountPaid.toLocaleString()} د.ع
        </p>
        <p className="text-xs text-gray-500">
          {paymentStats.employeesPaid} کارمەند
        </p>
      </div>
      <CheckCircle size={24} className="text-green-400" />
    </div>
  </div>
  
  {/* Partial Payments */}
  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">بەشێکی پێدراو</p>
        <p className="text-2xl font-bold text-yellow-700">
          {paymentStats.totalAmountPartialPaid.toLocaleString()} د.ع
        </p>
        <p className="text-xs text-gray-500">
          {paymentStats.employeesPartial} کارمەند | ماوە: {paymentStats.totalPartialRemaining.toLocaleString()} د.ع
        </p>
      </div>
      <AlertCircle size={24} className="text-yellow-400" />
    </div>
  </div>
  
  {/* Total Remaining */}
  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">کۆی مووچەی ماوە</p>
        <p className="text-2xl font-bold text-red-700">
          {paymentStats.totalAmountRemaining.toLocaleString()} د.ع
        </p>
        <p className="text-xs text-gray-500">
          {paymentStats.employeesUnpaid} کارمەند
        </p>
      </div>
      <Clock size={24} className="text-red-400" />
    </div>
  </div>
</div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">ڕێژەی پێدان</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(paymentStats.totalAmountPaid / paymentStats.totalSalaryShouldBePaid * 100) || 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {Math.round((paymentStats.totalAmountPaid / paymentStats.totalSalaryShouldBePaid * 100) || 0)}%
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {paymentStats.employeesPaid} کارمەند پێدراوە
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">ڕێژەی بەشێکی پێدراو</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(paymentStats.totalAmountPartial / paymentStats.totalSalaryShouldBePaid * 100) || 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {Math.round((paymentStats.totalAmountPartial / paymentStats.totalSalaryShouldBePaid * 100) || 0)}%
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {paymentStats.employeesPartial} کارمەند بەشێکی پێدراوە
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">ڕێژەی چاوەڕوانکراو</h3>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(paymentStats.totalAmountPending / paymentStats.totalSalaryShouldBePaid * 100) || 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {Math.round((paymentStats.totalAmountPending / paymentStats.totalSalaryShouldBePaid * 100) || 0)}%
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {paymentStats.employeesPending} کارمەند چاوەڕوانکراو
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
                  const paymentRecord = getPaymentRecord(employee.id);
                  const remainingAmount = employee.salary - (paymentRecord.amount || 0);
                  
                  return (
                    <tr key={`${employee.id}-${paymentRecord.id}`} className="hover:bg-gray-50">
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
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.salaryDisplay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentRecord.amountDisplay || "0 د.ع"}
                        {paymentRecord.isPartial && (
                          <span className="text-xs text-yellow-600 block">
                            ماوە: {remainingAmount.toLocaleString()} د.ع
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(paymentRecord.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {paymentRecord.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2 space-x-reverse">
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          {getPaymentStatusBadge(paymentRecord.status, employee.id)}
                          
                          <button
                            onClick={() => openEditModal(paymentRecord)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                            title="دەستکاری"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deletePaymentRecord(paymentRecord.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                            title="سڕینەوە"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {paymentRecord.status !== 'paid' && (
                          <div className="mt-2 flex justify-center">
                            <button
                              onClick={() => togglePaymentStatus(employee.id)}
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

          {/* No Results */}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-10">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">هیچ تۆماری مووچە بۆ ئەم مانگە نەدۆزرایەوە</p>
              <p className="text-gray-400 mt-2">دەتوانیت تۆماری نوێ زیاد بکەیت بە کلیک کردن لەسەر دوگمەی "زیادکردنی تۆماری مووچە"</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Payment Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                value={selectedEmployee ? selectedEmployee.id : ''}
                onChange={(e) => {
                  const employeeId = parseInt(e.target.value);
                  const employee = employees.find(emp => emp.id === employeeId);
                  setSelectedEmployee(employee);
                  setPaymentAmount(employee ? employee.salary.toString() : '');
                }}
              >
                <option value="">کارمەندێک هەڵبژێرە</option>
                {employeesWithoutPayments.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} - {employee.role}
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
                  مووچەی گونجاو: {selectedEmployee.salaryDisplay}
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

            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                هەڵوەشاندنەوە
              </button>
              <button
                onClick={createPaymentRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                disabled={!selectedEmployee}
              >
                <Save size={16} className="ml-1" />
                پاشەکەوتکردن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Record Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">دەستکاری تۆماری مووچە</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">کارمەند</label>
              <div className="p-2 bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={selectedEmployee?.avatar}
                    alt={selectedEmployee?.fullName}
                  />
                  <div className="mr-4">
                    <div className="text-sm font-medium text-gray-900">{selectedEmployee?.fullName}</div>
                    <div className="text-sm text-gray-500">
                      {selectedEmployee?.role} - {selectedEmployee?.salaryDisplay}
                    </div>
                  </div>
                </div>
              </div>
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

            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                هەڵوەشاندنەوە
              </button>
              <button
                onClick={updatePaymentRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                <Save size={16} className="ml-1" />
                نوێکردنەوەی تۆمار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}