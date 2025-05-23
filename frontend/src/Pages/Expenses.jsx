import { useState, useEffect } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  Save,
  X,
  Calendar,
  Tag,
  FileText,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('هەموو');
  const [dateFilterType, setDateFilterType] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    expenses_date: new Date().toISOString().split('T')[0],
    expenses_category_id: '',
    price: 0,
    name: ''
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        let url = `http://localhost:3000/expenses/get_expenses`;

        if (dateFilterType == 'custom' && (customStartDate && customEndDate)) {
          url += `?start_date=${customStartDate}&end_date=${customEndDate}`;
        } else {
          url += '';
        }

        if (dateFilterType == 'today') {
          url += '';
        } else if (dateFilterType != 'today' && dateFilterType != 'custom') {
          url += `?filter=${dateFilterType}`;
        }

        const res = await axios.get(url)
        setExpenses(res.data.data);
        setExpensesTotal(res.data.total);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [dateFilterType, customStartDate, customEndDate]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`http://localhost:3000/expenses_category/get_all_expensess_category`)
      const categoriesArray = Object.values(res.data.rows);
      setCategories(categoriesArray);
    }
    fetchCategories()
  }, [expenses])

  const dateFilterOptions = [
    { id: 'today', label: 'ئەمڕۆ' },
    { id: 'yesterday', label: 'دوێنێ' },
    { id: 'week', label: 'هەفتەی ڕابردوو' },
    { id: 'month', label: 'ئەم مانگە' },
    { id: 'last_month', label: 'مانگی ڕابردوو' },
    { id: 'year', label: 'ئەمساڵ' },
    { id: 'all', label: 'هەموو کات' },
    { id: 'custom', label: 'ماوەی دیاریکراو' }
  ];

  const getCurrentDateFilterLabel = () => {
    const option = dateFilterOptions.find(option => option.id === dateFilterType);
    return option ? option.label : 'ئەمڕۆ';
  };

  const getDateFilteredExpenses = (expenses) => {
    if (!Array.isArray(expenses)) return [];

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
      const expenseDate = new Date(expense.expenses_date);
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

  const filteredExpenses = getDateFilteredExpenses(Array.isArray(expenses) ? expenses.filter(expense => {
    const matchesSearch =
      expense.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      expense.category_name?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesCategory = filterCategory === 'هەموو' || expense.category_name === filterCategory;
    return matchesSearch && matchesCategory;
  }) : []);

  const expensesByCategory = {};
  filteredExpenses.forEach(expense => {
    if (!expensesByCategory[expense.category_name]) {
      expensesByCategory[expense.category_name] = 0;
    }
    expensesByCategory[expense.category_name] += expense.price;
  });

  const handleAddExpense = async () => {
    if (newExpense.expenses_category_id && newExpense.price >= 0 && newExpense.name && newExpense.expenses_date) {
      try {
        const res = await axios.post(`http://localhost:3000/expenses/add_expense`, {
          expenses_category_id: newExpense.expenses_category_id,
          price: newExpense.price,
          name: newExpense.name,
          expenses_date: newExpense.expenses_date
        });

        if (res.status === 200) {
          alert('خەرجییەکە بەسەرکەوە');
          setExpenses([
            ...expenses
          ]);
          setNewExpense({
            expenses_date: new Date().toISOString().split('T')[0],
            expenses_category_id: '',
            price: 0,
            name: ''
          });
          setShowAddModal(false);
        }
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  };

  const startEditing = (expense) => {
    setEditingExpense(expense.expenses_id);
    setEditedValues({ ...expense });
  };

  const saveEditing = async () => {
    if (editedValues.price >= 0 && editedValues.price && editedValues.name && editedValues.expenses_date) {
      try {
        const data = {
          expenses_id: editedValues.expenses_id,
          expenses_category_id: editedValues.expenses_category_id,
          price: editedValues.price,
          name: editedValues.name,
          expenses_date: editedValues.expenses_date
        }

        const res = await axios.patch(`http://localhost:3000/expenses/update_expenses`, data);

        if (res.status === 200) {
          alert('خەرجییەکە بەسەرکەوە');
          setExpenses(expenses.map(expense =>
            expense.expenses_id === editingExpense ? { ...data, category_name: categories.find(category => category.expenses_category_id == editedValues.expenses_category_id).name } : expense
          ));
          setEditingExpense(null);
          setExpensesTotal(expensesTotal + (editedValues.price - expenses.find(expense => expense.expenses_id === editedValues.expenses_id).price));
        }
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    }
  };

  const cancelEditing = () => {
    setEditingExpense(null);
  };

  const deleteExpense = async (id) => {
    if (confirm('دڵنیایت کە دەتەوێت ئەم خەرجییە بسڕیتەوە؟')) {
      try {
        const res = await axios.delete(`http://localhost:3000/expenses/delete_expenses/${id}`)
        if (res.status === 200) {
          alert('خەرجییەکە بەسەرکەوە');
          setExpenses(expenses.filter(expense => expense.expenses_id !== id));
          setExpensesTotal(expensesTotal - expenses.find(expense => expense.expenses_id === id).price);
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                  {((expensesTotal / 1) * 1000).toLocaleString()} د.ع
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

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
                <option value="هەموو">هەموو</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
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
                    <tr key={expense.expenses_id} className="hover:bg-gray-50">
                      {editingExpense === expense.expenses_id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.expenses_date}
                              onChange={(e) => setEditedValues({ ...editedValues, expenses_date: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.expenses_category_id}
                              onChange={(e) => setEditedValues({ ...editedValues, expenses_category_id: e.target.value })}
                            >
                              <option value="">جۆرێک هەڵبژێرە</option>
                              {categories.map(category => (
                                <option key={category.expenses_category_id} value={category.expenses_category_id}>{category.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.price}
                              onChange={(e) => setEditedValues({ ...editedValues, price: parseFloat(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={editedValues.name}
                              onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
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
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {formatDate(expense.expenses_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {expense.category_name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-right">
                            {((expense.price / 1) * 1000).toLocaleString()} د.ع
                          </td>
                          <td className="px-6 py-4 text-right">
                            {expense.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button
                              onClick={() => startEditing(expense)}
                              className="text-indigo-600 hover:text-indigo-900 ml-3"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteExpense(expense.expenses_id)}
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

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-bold">زیادکردنی خەرجی نوێ</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بەروار</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0  flex items-center pointer-events-none"></div>
                    <input
                      type="date"
                      className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.expenses_date}
                      onChange={(e) => setNewExpense({ ...newExpense, expenses_date: e.target.value })}
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
                      value={newExpense.expenses_category_id}
                      onChange={(e) => setNewExpense({
                        ...newExpense, expenses_category_id: e.target.value
                      })}
                    >
                      <option value="">جۆرێک هەڵبژێرە</option>
                      {categories.map(category => (
                        <option key={category.expenses_category_id} value={category.expenses_category_id}>{category.name}</option>
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
                      value={newExpense.price || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, price: parseFloat(e.target.value) || 0 })}
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
                      value={newExpense.name}
                      onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
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