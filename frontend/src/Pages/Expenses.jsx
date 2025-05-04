import { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ArrowUpDown,
  Dumbbell,
  Bell,
  Save,
  X,
  Calendar,
  Tag,
  FileText,
  UserCircle,
  ChevronDown
} from 'lucide-react';

export default function Expenses() {
  // State for expenses
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '2023-06-15',
      category: 'ئامێر',
      amount: 1200,
      description: 'کڕینی ئامێری ڕاکردن'
    },
    {
      id: 2,
      date: '2023-06-18',
      category: 'خزمەتگوزاری',
      amount: 350,
      description: 'پسوولەی کارەبا بۆ مانگی حوزەیران'
    },
    {
      id: 3,
      date: '2023-06-20',
      category: 'پڕۆتین',
      amount: 750,
      description: 'کۆگای پڕۆتینی وەی'
    },
    {
      id: 4,
      date: '2023-06-25',
      category: 'چاککردنەوە',
      amount: 200,
      description: 'چاککردنەوەی ئامێرەکانی قورسایی'
    },
    {
      id: 5,
      date: '2023-06-28',
      category: 'مووچە',
      amount: 3500,
      description: 'مووچەی کارمەندان بۆ مانگی حوزەیران'
    },
    {
      id: 6,
      date: '2023-07-01',
      category: 'ڕیکلام',
      amount: 300,
      description: 'ڕیکلامی تۆڕە کۆمەڵایەتییەکان'
    },
    {
      id: 7,
      date: '2023-07-05',
      category: 'کەلوپەل',
      amount: 450,
      description: 'دۆشەکی یۆگا و باندی بەرگری نوێ'
    },
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('هەموو');
  const [dateFilterType, setDateFilterType] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    description: ''
  });

  // State for editing
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  // Categories for filtering
  const categories = ['هەموو', 'ئامێر', 'خزمەتگوزاری', 'پڕۆتین', 'چاککردنەوە', 'مووچە', 'ڕیکلام', 'کەلوپەل', 'هیتر'];

  // Date filter options
  const dateFilterOptions = [
    { id: 'all', label: 'هەموو کات' },
    { id: 'today', label: 'ئەمڕۆ' },
    { id: 'yesterday', label: 'دوێنێ' },
    { id: 'last_week', label: 'هەفتەی ڕابردوو' },
    { id: 'this_month', label: 'ئەم مانگە' },
    { id: 'last_month', label: 'مانگی ڕابردوو' },
    { id: 'this_year', label: 'ئەمساڵ' },
    { id: 'custom', label: 'ماوەی دیاریکراو' }
  ];

  // Get current date filter label
  const getCurrentDateFilterLabel = () => {
    const option = dateFilterOptions.find(option => option.id === dateFilterType);
    return option ? option.label : 'هەموو کات';
  };

  // Filter expenses based on date range
  const getDateFilteredExpenses = (expenses) => {
    if (dateFilterType === 'all') return expenses;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisYearStart = new Date(today.getFullYear(), 0, 1);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);

      switch (dateFilterType) {
        case 'today':
          return expenseDate.getTime() === today.getTime();
        case 'yesterday':
          return expenseDate.getTime() === yesterday.getTime();
        case 'last_week':
          return expenseDate >= lastWeekStart && expenseDate <= today;
        case 'this_month':
          return expenseDate >= thisMonthStart && expenseDate <= today;
        case 'last_month':
          return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
        case 'this_year':
          return expenseDate >= thisYearStart && expenseDate <= today;
        case 'custom':
          const start = customStartDate ? new Date(customStartDate) : null;
          const end = customEndDate ? new Date(customEndDate) : null;
          if (start && end) {
            return expenseDate >= start && expenseDate <= end;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Filter expenses based on search term, category, and date
  const filteredExpenses = getDateFilteredExpenses(expenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'هەموو' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  }));

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = {};
  filteredExpenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });

  // Handle adding new expense
  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount > 0) {
      setExpenses([
        ...expenses,
        {
          id: expenses.length + 1,
          ...newExpense
        }
      ]);
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: 0,
        description: ''
      });
      setShowAddModal(false);
    }
  };

  // Start editing an expense
  const startEditing = (expense) => {
    setEditingExpense(expense.id);
    setEditedValues({ ...expense });
  };

  // Save edited expense
  const saveEditing = () => {
    if (editedValues.category && editedValues.amount > 0) {
      setExpenses(expenses.map(expense =>
        expense.id === editingExpense ? { ...editedValues } : expense
      ));
      setEditingExpense(null);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingExpense(null);
  };

  // Delete an expense
  const deleteExpense = (id) => {
    if (confirm('دڵنیایت کە دەتەوێت ئەم خەرجییە بسڕیتەوە؟')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ku-IQ', { style: 'currency', currency: 'IQD' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell size={28} />
            <h1 className="text-2xl font-bold mr-2">سیستەمی بەدواداچوونی خەرجییەکانی هۆڵی وەرزشی</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="cursor-pointer hover:text-blue-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">٣</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <UserCircle size={16} />
              </div>
              <span className="font-medium mr-2">بەڕێوەبەری هۆڵ</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">ژمارەی مامەڵەکان</p>
                <h3 className="text-2xl font-bold text-gray-800">{filteredExpenses.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">خەرجییەکانی ئەم مانگە</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {formatCurrency(expenses.filter(expense => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= firstDay && expenseDate <= today;
                  }).reduce((sum, expense) => sum + expense.amount, 0))}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">کۆی خەرجییەکان</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-[0.7] relative">
              <input
                type="text"
                placeholder="گەڕان بۆ خەرجییەکان..."
                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="md:w-48">
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:w-48 relative">
              <div
                className="w-full px-4 py-2 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setShowDateFilterDropdown(!showDateFilterDropdown)}
              >
                <div className="flex items-center">
                  <Calendar className="ml-2 text-gray-400" size={18} />
                  <span>{getCurrentDateFilterLabel()}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </div>

              {showDateFilterDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg py-1">
                  {dateFilterOptions.map(option => (
                    <div
                      key={option.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDateFilterType(option.id);
                        setShowDateFilterDropdown(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {dateFilterType === 'custom' && (
              <div className="md:w-96 flex space-x-2">
                <label className='flex items-center' htmlFor="">لە</label>
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  placeholder="بەرواری دەستپێک"
                />
                <label className='flex items-center' htmlFor="">بۆ</label>
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  placeholder="بەرواری کۆتایی"
                />
              </div>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="md:w-48 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <span>زیادکردنی خەرجی</span>
              <Plus size={18} className="mr-1" />
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer justify-end">
                      بەروار
                      <ArrowUpDown size={14} className="mr-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer justify-end">
                      جۆر
                      <ArrowUpDown size={14} className="mr-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer justify-end">
                      بڕ
                      <ArrowUpDown size={14} className="mr-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وەسف
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کردارەکان
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      {editingExpense === expense.id ? (
                        // Edit mode
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.date}
                              onChange={(e) => setEditedValues({ ...editedValues, date: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.category}
                              onChange={(e) => setEditedValues({ ...editedValues, category: e.target.value })}
                            >
                              {categories.filter(cat => cat !== 'هەموو').map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.amount}
                              onChange={(e) => setEditedValues({ ...editedValues, amount: parseFloat(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.description}
                              onChange={(e) => setEditedValues({ ...editedValues, description: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button
                              onClick={saveEditing}
                              className="text-green-600 hover:text-green-900 ml-3"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X size={18} />
                            </button>
                          </td>
                        </>
                      ) : (
                        // View mode
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-right">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button
                              onClick={() => startEditing(expense)}
                              className="text-indigo-600 hover:text-indigo-900 ml-3"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      هیچ خەرجییەک نەدۆزرایەوە. خەرجییەکی نوێ زیاد بکە بۆ دەستپێکردن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-bold">زیادکردنی خەرجی نوێ</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بەروار</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">جۆر</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Tag size={18} className="text-gray-400" />
                    </div>
                    <select
                      className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      <option value="" disabled>جۆرێک هەڵبژێرە</option>
                      {categories.filter(cat => cat !== 'هەموو').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بڕ</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وەسف</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="وەسفێک بنووسە"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-start space-x-3">
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  زیادکردنی خەرجی
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  پەشیمانبوونەوە
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}