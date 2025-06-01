import { useState, useEffect } from 'react';
import {
  DollarSign, Filter, ChevronDown, Download,
  RefreshCw, PieChart, BarChart, Calendar,
  AlertCircle, Tag, Users, CreditCard,
  Settings, ClipboardList, Warehouse, ShoppingBag,
  Shirt, Droplet, Ticket, Dumbbell, TrendingUp, 
  TrendingDown, ArrowUp, ArrowDown, Percent
} from 'lucide-react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, Title, LineElement, PointElement, Filler } from 'chart.js';
import Navbar from '../components/layout/Nav';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title, LineElement, 
  PointElement, Filler
);

const CostsAnalysisPage = () => {
  // State for filters
  const [dateRange, setDateRange] = useState('this_month');
  const [category, setCategory] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [viewMode, setViewMode] = useState('chart');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Color palette
  const colors = {
    gym: { bg: 'bg-blue-100', text: 'text-blue-800', chart: '#3b82f6' },
    pool: { bg: 'bg-cyan-100', text: 'text-cyan-800', chart: '#06b6d4' },
    supplements: { bg: 'bg-purple-100', text: 'text-purple-800', chart: '#8b5cf6' },
    equipment: { bg: 'bg-amber-100', text: 'text-amber-800', chart: '#f59e0b' },
    clothing: { bg: 'bg-pink-100', text: 'text-pink-800', chart: '#ec4899' },
    salaries: { bg: 'bg-red-100', text: 'text-red-800', chart: '#ef4444' },
    rent: { bg: 'bg-indigo-100', text: 'text-indigo-800', chart: '#6366f1' },
    utilities: { bg: 'bg-green-100', text: 'text-green-800', chart: '#10b981' },
    marketing: { bg: 'bg-yellow-100', text: 'text-yellow-800', chart: '#facc15' },
    profit: { bg: 'bg-emerald-100', text: 'text-emerald-800', chart: '#059669' },
  };

  // Mock data with more detailed product information
  const allData = [
    // Expenses
    { id: 1, type: 'expense', date: '2025-04-04', category: 'salaries', subCategory: 'trainers', amount: 4200, paymentMethod: 'bank', recurring: true },
    { id: 2, type: 'expense', date: '2025-04-03', category: 'supplements', subCategory: 'whey_protein', amount: 850, paymentMethod: 'cash', recurring: false, productId: 'supp-1' },
    { id: 3, type: 'expense', date: '2025-04-05', category: 'utilities', subCategory: 'electricity', amount: 320, paymentMethod: 'bank', recurring: true },
    { id: 4, type: 'expense', date: '2025-04-10', category: 'equipment', subCategory: 'resistance_bands', amount: 1200, paymentMethod: 'bank', recurring: false, productId: 'eq-1' },
    { id: 5, type: 'expense', date: '2025-04-15', category: 'maintenance', subCategory: 'cleaning', amount: 180, paymentMethod: 'cash', recurring: true },
    { id: 6, type: 'expense', date: '2025-04-20', category: 'supplements', subCategory: 'creatine', amount: 450, paymentMethod: 'bank', recurring: false, productId: 'supp-2' },
    { id: 7, type: 'expense', date: '2025-04-25', category: 'rent', subCategory: 'gym_space', amount: 1500, paymentMethod: 'bank', recurring: true },
    { id: 8, type: 'expense', date: '2025-04-28', category: 'marketing', subCategory: 'social_media', amount: 300, paymentMethod: 'bank', recurring: false },
    
    // Revenue - Gym Memberships
    { id: 9, type: 'revenue', date: '2025-03-02', category: 'gym', subCategory: 'monthly_membership', amount: 2500, paymentMethod: 'bank', productId: 'gym-1' },
    { id: 10, type: 'revenue', date: '2025-03-05', category: 'gym', subCategory: 'personal_training', amount: 1200, paymentMethod: 'cash', productId: 'gym-2' },
    { id: 11, type: 'revenue', date: '2025-03-12', category: 'gym', subCategory: 'daily_pass', amount: 450, paymentMethod: 'cash', productId: 'gym-3' },
    
    // Revenue - Pool
    { id: 12, type: 'revenue', date: '2025-11-03', category: 'pool', subCategory: 'daily_ticket', amount: 600, paymentMethod: 'cash', productId: 'pool-1' },
    { id: 13, type: 'revenue', date: '2025-11-10', category: 'pool', subCategory: 'monthly_pass', amount: 800, paymentMethod: 'bank', productId: 'pool-2' },
    
    // Revenue - Supplements
    { id: 14, type: 'revenue', date: '2025-11-04', category: 'supplements', subCategory: 'whey_protein', amount: 1500, paymentMethod: 'bank', productId: 'supp-1' },
    { id: 15, type: 'revenue', date: '2025-11-18', category: 'supplements', subCategory: 'creatine', amount: 750, paymentMethod: 'cash', productId: 'supp-2' },
    { id: 16, type: 'revenue', date: '2025-11-22', category: 'supplements', subCategory: 'pre_workout', amount: 600, paymentMethod: 'bank', productId: 'supp-3' },
    
    // Revenue - Equipment/Clothing
    { id: 17, type: 'revenue', date: '2025-11-07', category: 'equipment', subCategory: 'resistance_bands', amount: 900, paymentMethod: 'bank', productId: 'eq-1' },
    { id: 18, type: 'revenue', date: '2025-11-22', category: 'clothing', subCategory: 't-shirts', amount: 600, paymentMethod: 'cash', productId: 'cloth-1' },
    { id: 19, type: 'revenue', date: '2025-11-25', category: 'clothing', subCategory: 'shorts', amount: 450, paymentMethod: 'bank', productId: 'cloth-2' },
    
    // Previous month data for comparison
    { id: 20, type: 'expense', date: '2025-10-02', category: 'salaries', subCategory: 'trainers', amount: 4200, paymentMethod: 'bank', recurring: true },
    { id: 21, type: 'revenue', date: '2025-10-05', category: 'gym', subCategory: 'monthly_membership', amount: 2300, paymentMethod: 'bank', productId: 'gym-1' },
    { id: 22, type: 'revenue', date: '2025-10-12', category: 'supplements', subCategory: 'whey_protein', amount: 1200, paymentMethod: 'bank', productId: 'supp-1' },
    { id: 23, type: 'revenue', date: '2025-10-18', category: 'pool', subCategory: 'monthly_pass', amount: 700, paymentMethod: 'bank', productId: 'pool-2' },
    
    // Two months ago data
    { id: 24, type: 'revenue', date: '2025-09-05', category: 'gym', subCategory: 'monthly_membership', amount: 2100, paymentMethod: 'bank', productId: 'gym-1' },
    { id: 25, type: 'revenue', date: '2025-09-15', category: 'supplements', subCategory: 'creatine', amount: 600, paymentMethod: 'cash', productId: 'supp-2' },
  ];

  // Product information
  const products = {
    // Gym products
    'gym-1': { name: 'ئەندامێتی مانگانە', category: 'gym', cost: 0, price: 2500 },
    'gym-2': { name: 'ڕاهێنانی تایبەت', category: 'gym', cost: 0, price: 1200 },
    'gym-3': { name: 'بەردەوامی ڕۆژانە', category: 'gym', cost: 0, price: 450 },
    
    // Pool products
    'pool-1': { name: 'تکەتەی ڕۆژانە', category: 'pool', cost: 0, price: 600 },
    'pool-2': { name: 'بەردەوامی مانگانە', category: 'pool', cost: 0, price: 800 },
    
    // Supplement products
    'supp-1': { name: 'پڕۆتینی وەی (5kg)', category: 'supplements', cost: 850, price: 1500 },
    'supp-2': { name: 'کرێاتین (500g)', category: 'supplements', cost: 450, price: 750 },
    'supp-3': { name: 'پێش وەرزش', category: 'supplements', cost: 300, price: 600 },
    
    // Equipment products
    'eq-1': { name: 'باندی بەرگری', category: 'equipment', cost: 1200, price: 900, set: true },
    
    // Clothing products
    'cloth-1': { name: 'کراسی جیم', category: 'clothing', cost: 200, price: 600 },
    'cloth-2': { name: 'شۆرت', category: 'clothing', cost: 150, price: 450 },
  };

  // Categories configuration
  const categories = [
    { id: 'all', name: 'هەموو', icon: Filter, color: 'gray' },
    { 
      id: 'revenue', 
      name: 'داھات', 
      icon: TrendingUp, 
      color: 'green',
      subCategories: [
        { id: 'gym', name: 'جیم', icon: Dumbbell },
        { id: 'pool', name: 'مەلەوانی', icon: Droplet },
        { id: 'supplements', name: 'پڕۆتین', icon: ShoppingBag },
        { id: 'equipment', name: 'کەل و پەل', icon: Warehouse },
        { id: 'clothing', name: 'جلوبەرگ', icon: Shirt }
      ]
    },
    { 
      id: 'expense', 
      name: 'خەرجی', 
      icon: TrendingDown, 
      color: 'red',
      subCategories: [
        { id: 'salaries', name: 'مووچە' },
        { id: 'supplements', name: 'پڕۆتین' },
        { id: 'equipment', name: 'کەل و پەل' },
        { id: 'utilities', name: 'کارگێڕی' },
        { id: 'rent', name: 'کرێ' },
        { id: 'marketing', name: 'بازاڕکردن' }
      ]
    }
  ];

  // Filter data based on selected filters
  const filterData = () => {
    let filtered = [...allData];

    // Filter by date range
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (dateRange) {
      case 'today':
        const todayStr = now.toISOString().split('T')[0];
        filtered = filtered.filter(item => item.date === todayStr);
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        filtered = filtered.filter(item => item.date === yesterdayStr);
        break;
      case 'last_week':
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= lastWeek && itemDate <= now;
        });
        break;
      case 'last_month':
        const lastMonth = new Date(currentYear, currentMonth - 1, 1);
        const endLastMonth = new Date(currentYear, currentMonth, 0);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= lastMonth && itemDate <= endLastMonth;
        });
        break;
      case 'last_year':
        filtered = filtered.filter(item => {
          const itemYear = new Date(item.date).getFullYear();
          return itemYear === currentYear - 1;
        });
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          filtered = filtered.filter(item => {
            return item.date >= customStartDate && item.date <= customEndDate;
          });
        }
        break;
      default: // 'this_month'
        const firstDay = new Date(currentYear, currentMonth, 1);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= firstDay && itemDate <= now;
        });
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(item => item.type === category);
    }

    return filtered;
  };

  const filteredData = filterData();

  // Calculate totals
  const totalRevenue = filteredData.filter(item => item.type === 'revenue').reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = filteredData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  // Revenue by category
  const revenueByCategory = filteredData
    .filter(item => item.type === 'revenue')
    .reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = 0;
      acc[item.category] += item.amount;
      return acc;
    }, {});

  // Expenses by category
  const expensesByCategory = filteredData
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = 0;
      acc[item.category] += item.amount;
      return acc;
    }, {});

  // Product performance
  const productPerformance = filteredData
    .filter(item => item.type === 'revenue' && item.productId)
    .reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          revenue: 0,
          count: 0,
          product: products[item.productId]
        };
      }
      acc[item.productId].revenue += item.amount;
      acc[item.productId].count += 1;
      return acc;
    }, {});

  // Calculate product net revenue (revenue - cost)
  Object.keys(productPerformance).forEach(productId => {
    const product = productPerformance[productId];
    product.netRevenue = product.revenue - (product.count * (product.product.cost || 0));
    product.margin = product.revenue > 0 ? 
      (product.netRevenue / product.revenue) * 100 : 0;
  });

  // Get last 3 months revenue data for comparison
  const getMonthlyComparisonData = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const months = [
      { name: 'ئەم مانگە', year: currentYear, month: currentMonth },
      { name: 'مانگی ڕابردوو', year: currentMonth === 0 ? currentYear - 1 : currentYear, month: currentMonth === 0 ? 11 : currentMonth - 1 },
      { name: '2 مانگ لەمەوپێش', year: currentMonth <= 1 ? currentYear - 1 : currentYear, month: currentMonth <= 1 ? 11 + currentMonth - 1 : currentMonth - 2 }
    ];
    
    return months.map(month => {
      const firstDay = new Date(month.year, month.month, 1);
      const lastDay = new Date(month.year, month.month + 1, 0);
      
      const monthData = allData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= firstDay && itemDate <= lastDay;
      });
      
      const revenue = monthData
        .filter(item => item.type === 'revenue')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const expenses = monthData
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
      
      return {
        name: month.name,
        revenue,
        expenses,
        profit: revenue - expenses,
        profitMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0
      };
    });
  };

  const monthlyComparison = getMonthlyComparisonData();

  // Prepare chart data
  const getRevenuePieData = () => {
    const labels = Object.keys(revenueByCategory);
    const data = Object.values(revenueByCategory);
    
    const backgroundColors = labels.map(label => colors[label]?.chart || '#cccccc');
    const borderColors = backgroundColors.map(color => `${color}80`);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }
      ]
    };
  };

  const getExpensesPieData = () => {
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    
    const backgroundColors = labels.map(label => colors[label]?.chart || '#cccccc');
    const borderColors = backgroundColors.map(color => `${color}80`);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }
      ]
    };
  };

  const getFinancialTrendData = () => {
    // Group by day for the current month
    const dailyRevenue = {};
    const dailyExpenses = {};
    const dailyProfit = {};

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1);
    
    // Initialize all days in month
    for (let d = new Date(firstDay); d <= now; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().split('T')[0];
      dailyRevenue[dayStr] = 0;
      dailyExpenses[dayStr] = 0;
      dailyProfit[dayStr] = 0;
    }

    // Populate with actual data
    filteredData.forEach(item => {
      const dayStr = item.date;
      if (item.type === 'revenue') {
        dailyRevenue[dayStr] += item.amount;
        dailyProfit[dayStr] += item.amount;
      } else {
        dailyExpenses[dayStr] += item.amount;
        dailyProfit[dayStr] -= item.amount;
      }
    });

    // Convert to arrays
    const days = Object.keys(dailyRevenue).sort();
    const revenueData = days.map(day => dailyRevenue[day]);
    const expensesData = days.map(day => dailyExpenses[day]);
    const profitData = days.map(day => dailyProfit[day]);

    // Format labels as day numbers
    const labels = days.map(day => {
      const dayNum = new Date(day).getDate();
      return `${dayNum} ${new Date(day).toLocaleString('default', { month: 'short' })}`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'داھات',
          data: revenueData,
          borderColor: colors.gym.chart,
          backgroundColor: `${colors.gym.chart}20`,
          fill: true,
          tension: 0.4
        },
        {
          label: 'خەرجی',
          data: expensesData,
          borderColor: colors.salaries.chart,
          backgroundColor: `${colors.salaries.chart}20`,
          fill: true,
          tension: 0.4
        },
        {
          label: 'قازانج',
          data: profitData,
          borderColor: colors.profit.chart,
          backgroundColor: `${colors.profit.chart}20`,
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const getMonthlyComparisonChartData = () => {
    return {
      labels: monthlyComparison.map(month => month.name),
      datasets: [
        {
          label: 'کۆی داھات',
          data: monthlyComparison.map(month => month.revenue),
          backgroundColor: colors.gym.chart,
          borderRadius: 6
        }
      ]
    };
  };

  // Get icon for category
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'gym': return <Dumbbell className="h-5 w-5" />;
      case 'pool': return <Droplet className="h-5 w-5" />;
      case 'supplements': return <ShoppingBag className="h-5 w-5" />;
      case 'equipment': return <Warehouse className="h-5 w-5" />;
      case 'clothing': return <Shirt className="h-5 w-5" />;
      case 'salaries': return <Users className="h-5 w-5" />;
      case 'rent': return <CreditCard className="h-5 w-5" />;
      case 'utilities': return <Settings className="h-5 w-5" />;
      case 'marketing': return <AlertCircle className="h-5 w-5" />;
      default: return <Tag className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <Navbar />

      <div className="bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">شیکردنەوەی دارایی</h1>
              <p className="text-gray-600 text-right">وردبینی تەواوی داھات و خەرجییەکان</p>
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-3 mt-4 md:mt-0">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="today">ئەمڕۆ</option>
                  <option value="yesterday">دوێنێ</option>
                  <option value="last_week">هەفتەی ڕابردوو</option>
                  <option value="this_month">ئەم مانگە</option>
                  <option value="last_month">مانگی ڕابردوو</option>
                  <option value="last_year">ساڵی ڕابردوو</option>
                  <option value="custom">کاتێکی دیاریکراو</option>
                </select>
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {dateRange === 'custom' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                  <span className="flex items-center">بۆ</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <Tag className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
                <Download className="h-4 w-4" />
                داگرتن
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div dir='rtl' className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">کۆی داھات</p>
                  <h3 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {filteredData.filter(item => item.type === 'revenue').length} تۆمار
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">کۆی خەرجی</p>
                  <h3 className="text-2xl font-bold mt-1">${totalExpenses.toLocaleString()}</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {filteredData.filter(item => item.type === 'expense').length} تۆمار
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">قازانجی خاو</p>
                  <h3 className="text-2xl font-bold mt-1">${profit.toLocaleString()}</h3>
                  <p className={`text-sm mt-2 flex items-center ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitMargin >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(profitMargin).toFixed(1)}% ڕێژەی قازانج
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(revenueByCategory).map(([categoryId, amount]) => (
              <div key={categoryId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{categories.find(c => c.id === categoryId)?.name || categoryId}</p>
                    <h3 className="text-xl font-bold mt-1">${amount.toLocaleString()}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {totalRevenue > 0 ? ((amount / totalRevenue * 100).toFixed(1) + '%') : '0%'} لە کۆی داھات
                    </p>
                  </div>
                  <div className={`${colors[categoryId]?.bg || 'bg-gray-100'} p-2 rounded-lg`}>
                    {getCategoryIcon(categoryId)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Revenue Comparison */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-bold mb-6">بەراوردی داھات لە ماوەی سێ مانگی ڕابردوو</h2>
            <div className="h-80">
              <Bar
                data={getMonthlyComparisonChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      rtl: true,
                    },
                    tooltip: {
                      callbacks: {
                        afterLabel: function(context) {
                          const month = monthlyComparison[context.dataIndex];
                          return `قازانج: $${month.profit.toLocaleString()} (${month.profitMargin.toFixed(1)}%)`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    }
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {monthlyComparison.map((month, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{month.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">داھات:</span>
                      <span className="font-medium">${month.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">خەرجی:</span>
                      <span className="font-medium">${month.expenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">قازانج:</span>
                      <span className={`font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${month.profit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ڕێژەی قازانج:</span>
                      <span className={`font-medium ${month.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Performance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-bold mb-6">کارایی بەرهەمەکان</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(productPerformance)
                .sort((a, b) => b[1].netRevenue - a[1].netRevenue)
                .map(([productId, performance]) => (
                  <div 
                    key={productId} 
                    className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedProduct === productId ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedProduct(selectedProduct === productId ? null : productId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{performance.product.name}</h3>
                      <div className={`${colors[performance.product.category]?.bg || 'bg-gray-100'} p-1 rounded-lg`}>
                        {getCategoryIcon(performance.product.category)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">کۆی داھات:</span>
                        <span className="font-medium">${performance.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">کۆی تێچوو:</span>
                        <span className="font-medium">${(performance.count * performance.product.cost).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">داھاتی خاو:</span>
                        <span className={`font-medium ${
                          performance.netRevenue >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${performance.netRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-600">ڕێژەی قازانج:</span>
                        <span className={`flex items-center ${
                          performance.margin >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <Percent className="h-3 w-3 mr-1" />
                          {performance.margin.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ژمارەی فرۆش:</span>
                        <span className="font-medium">{performance.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <PieChart className="inline h-4 w-4 mr-1" />
                نیگارە
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <ClipboardList className="inline h-4 w-4 mr-1" />
                لیست
              </button>
            </div>
          </div>

          {/* Main Content */}
          {viewMode === 'chart' ? (
            <div dir='rtl' className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Breakdown Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-6">پارەدان بە پێی پۆل (داھات)</h2>
                <div className="h-80">
                  <Pie
                    data={getRevenuePieData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'left',
                          rtl: true,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                          }
                        }
                      },
                    }}
                  />
                </div>
              </div>

              {/* Expenses Breakdown Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-6">پارەدان بە پێی پۆل (خەرجی)</h2>
                <div className="h-80">
                  <Pie
                    data={getExpensesPieData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'left',
                          rtl: true,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                          }
                        }
                      },
                    }}
                  />
                </div>
              </div>

              {/* Financial Trends */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                <h2 className="text-lg font-bold mb-6">ڕێڕەوی دارایی</h2>
                <div className="h-96">
                  <Line
                    data={getFinancialTrendData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          rtl: true,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              label += '$' + context.raw.toLocaleString();
                              return label;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Detailed List View */
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">بەروار</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">جۆر</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">پۆل</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">پۆلی ورد</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">بەرهەم</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">بڕ</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">شێوازی پارەدان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => {
                        const categoryInfo = categories.find(c => c.id === item.type);
                        const subCategoryInfo = categoryInfo?.subCategories?.find(sc => sc.id === item.category);
                        const productInfo = item.productId ? products[item.productId] : null;

                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {item.type === 'revenue' ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">داھات</span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">خەرجی</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {subCategoryInfo?.name || item.category}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.subCategory}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {productInfo?.name || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium" style={{
                              color: item.type === 'revenue' ? '#10b981' : '#ef4444'
                            }}>
                              ${item.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.paymentMethod === 'bank' ? 'بانک' : 'پارە'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                          هیچ تۆمارێک نەدۆزرایەوە
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostsAnalysisPage;