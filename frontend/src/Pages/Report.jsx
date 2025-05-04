import { useState, useEffect } from 'react';
import { 
  DollarSign, Filter, ChevronDown, Download, 
  RefreshCw, PieChart, BarChart, Calendar,
  AlertCircle, Tag, Users, CreditCard, 
  Settings, ClipboardList, Warehouse
} from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, Title
);

const CostsAnalysisPage = () => {
  // State for filters
  const [dateRange, setDateRange] = useState('this_month');
  const [costCategory, setCostCategory] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [viewMode, setViewMode] = useState('chart');

  // Mock cost data with more detailed entries
  const allCostData = [
    // Current month data
    { id: 1, date: '2023-11-01', category: 'salaries', subCategory: 'trainers', amount: 4200, paymentMethod: 'bank', recurring: true },
    { id: 2, date: '2023-11-03', category: 'supplements', subCategory: 'whey_protein', amount: 850, paymentMethod: 'cash', recurring: false },
    { id: 3, date: '2023-11-05', category: 'utilities', subCategory: 'electricity', amount: 320, paymentMethod: 'bank', recurring: true },
    { id: 4, date: '2023-11-10', category: 'equipment', subCategory: 'resistance_bands', amount: 1200, paymentMethod: 'bank', recurring: false },
    { id: 5, date: '2023-11-15', category: 'maintenance', subCategory: 'cleaning', amount: 180, paymentMethod: 'cash', recurring: true },
    { id: 6, date: '2023-11-20', category: 'supplements', subCategory: 'creatine', amount: 450, paymentMethod: 'bank', recurring: false },
    { id: 7, date: '2023-11-25', category: 'rent', subCategory: 'gym_space', amount: 1500, paymentMethod: 'bank', recurring: true },
    { id: 8, date: '2023-11-28', category: 'marketing', subCategory: 'social_media', amount: 300, paymentMethod: 'bank', recurring: false },
    
    // Previous month data
    { id: 9, date: '2023-10-02', category: 'salaries', subCategory: 'trainers', amount: 4200, paymentMethod: 'bank', recurring: true },
    { id: 10, date: '2023-10-05', category: 'supplements', subCategory: 'pre_workout', amount: 600, paymentMethod: 'cash', recurring: false },
    
    // Last year data
    { id: 11, date: '2022-11-10', category: 'equipment', subCategory: 'treadmill', amount: 3500, paymentMethod: 'bank', recurring: false },
  ];

  // Categories configuration
  const categories = [
    { id: 'all', name: 'هەموو', subCategories: [] },
    { 
      id: 'salaries', 
      name: 'مووچەی کارمەند', 
      subCategories: [
        { id: 'trainers', name: 'ڕاهێنەران' },
        { id: 'staff', name: 'کارمەندانی پشتیبانی' }
      ] 
    },
    { 
      id: 'supplements', 
      name: 'پڕۆتین', 
      subCategories: [
        { id: 'whey_protein', name: 'پڕۆتینی وەی' },
        { id: 'creatine', name: 'کرێاتین' },
        { id: 'pre_workout', name: 'پێش وەرزش' }
      ] 
    },
    { 
      id: 'equipment', 
      name: 'کەل و پەل', 
      subCategories: [
        { id: 'resistance_bands', name: 'باندی بەرگری' },
        { id: 'treadmill', name: 'ڕێگای ڕاکردن' }
      ] 
    },
    { 
      id: 'utilities', 
      name: 'کارگێڕی', 
      subCategories: [
        { id: 'electricity', name: 'کارەبا' },
        { id: 'water', name: 'ئاو' }
      ] 
    },
    { 
      id: 'rent', 
      name: 'کرێ', 
      subCategories: [
        { id: 'gym_space', name: 'بینای جیم' }
      ] 
    },
  ];

  // Filter data based on selected filters
  const filterData = () => {
    let filtered = [...allCostData];
    
    // Filter by date range
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    switch(dateRange) {
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
    if (costCategory !== 'all') {
      filtered = filtered.filter(item => item.category === costCategory);
    }
    
    return filtered;
  };

  const filteredCosts = filterData();

  // Calculate totals
  const totalCosts = filteredCosts.reduce((sum, item) => sum + item.amount, 0);
  const recurringCosts = filteredCosts.filter(item => item.recurring).reduce((sum, item) => sum + item.amount, 0);
  const oneTimeCosts = totalCosts - recurringCosts;

  // Prepare chart data
  const getCategoryData = () => {
    const categoryMap = {};
    
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        categoryMap[cat.name] = 0;
      }
    });
    
    filteredCosts.forEach(item => {
      const category = categories.find(c => c.id === item.category);
      if (category) {
        categoryMap[category.name] += item.amount;
      }
    });
    
    return {
      labels: Object.keys(categoryMap),
      datasets: [
        {
          data: Object.values(categoryMap),
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', 
            '#ef4444', '#8b5cf6', '#ec4899'
          ],
          borderWidth: 1,
        }
      ]
    };
  };

  const getMonthlyTrendData = () => {
    // Group by month
    const monthlyData = {};
    
    filteredCosts.forEach(item => {
      const month = item.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += item.amount;
    });
    
    // Convert to array and sort by month
    const sortedMonths = Object.keys(monthlyData).sort();
    const amounts = sortedMonths.map(month => monthlyData[month]);
    
    // Format month names for display
    const monthNames = {
      '01': 'کانوونی 1',
      '02': 'کانوونی 2',
      '03': 'ئازار',
      '04': 'نیسان',
      '05': 'ئایار',
      '06': 'حوزەیران',
      '07': 'تەمموز',
      '08': 'ئاب',
      '09': 'ئەیلوول',
      '10': 'تشرینی 1',
      '11': 'تشرینی 2',
      '12': 'کانوونی 2'
    };
    
    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      return `${monthNames[monthNum]} ${year}`;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'خەرجی مانگانە',
          data: amounts,
          backgroundColor: '#3b82f6',
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">شیکردنەوەی خەرجی</h1>
            <p className="text-gray-600">وردبینی تەواوی خەرجییەکان</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
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
                value={costCategory}
                onChange={(e) => setCostCategory(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">کۆی خەرجی</p>
                <h3 className="text-2xl font-bold mt-1">${totalCosts.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-2">{filteredCosts.length} تۆمار</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">خەرجییە بەردەوامەکان</p>
                <h3 className="text-2xl font-bold mt-1">${recurringCosts.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-2">
                  {totalCosts > 0 ? ((recurringCosts/totalCosts*100).toFixed(1) + '%') : '0%'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">خەرجییە یەکجارەکان</p>
                <h3 className="text-2xl font-bold mt-1">${oneTimeCosts.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-2">
                  {totalCosts > 0 ? ((oneTimeCosts/totalCosts*100).toFixed(1) + '%') : '0%'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Cost Breakdown Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-bold mb-6">پارەدان بە پێی پۆل</h2>
              <div className="h-80">
                <Pie 
                  data={getCategoryData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'left',
                        rtl: true,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Cost Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-6">ڕێڕەوی خەرجی</h2>
              <div className="h-80">
                <Bar 
                  data={getMonthlyTrendData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                  }}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-6">شێوازی پارەدان</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">بانک</span>
                    <span className="text-sm font-medium text-gray-700">
                      {filteredCosts.length > 0 ? 
                        Math.round(filteredCosts.filter(i => i.paymentMethod === 'bank').length / filteredCosts.length * 100) + '%' 
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{
                        width: filteredCosts.length > 0 ? 
                          (filteredCosts.filter(i => i.paymentMethod === 'bank').length / filteredCosts.length * 100) + '%' 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">پارە</span>
                    <span className="text-sm font-medium text-gray-700">
                      {filteredCosts.length > 0 ? 
                        Math.round(filteredCosts.filter(i => i.paymentMethod === 'cash').length / filteredCosts.length * 100) + '%' 
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{
                        width: filteredCosts.length > 0 ? 
                          (filteredCosts.filter(i => i.paymentMethod === 'cash').length / filteredCosts.length * 100) + '%' 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcategories Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-bold mb-6">پارەدان بە پێی پۆلی ورد</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories
                  .filter(c => c.id !== 'all' && c.subCategories.length > 0)
                  .map(category => {
                    const subCatCosts = {};
                    category.subCategories.forEach(subCat => {
                      subCatCosts[subCat.name] = filteredCosts
                        .filter(item => item.subCategory === subCat.id)
                        .reduce((sum, item) => sum + item.amount, 0);
                    });
                    
                    return (
                      <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                        <ul className="space-y-1">
                          {Object.entries(subCatCosts)
                            .filter(([_, amount]) => amount > 0)
                            .map(([subCatName, amount]) => (
                              <li key={subCatName} className="flex justify-between text-sm">
                                <span className="text-gray-600">{subCatName}</span>
                                <span className="font-medium">${amount.toLocaleString()}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    );
                  })}
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
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">پۆل</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">پۆلی ورد</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">بڕ</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">شێوازی پارەدان</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">جۆر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCosts.length > 0 ? (
                    filteredCosts.map((cost) => {
                      const category = categories.find(c => c.id === cost.category);
                      const subCategory = category?.subCategories.find(sc => sc.id === cost.subCategory);
                      
                      return (
                        <tr key={cost.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{cost.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category?.name || cost.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{subCategory?.name || cost.subCategory}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600">${cost.amount}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {cost.paymentMethod === 'bank' ? 'بانک' : 'پارە'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {cost.recurring ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">بەردەوام</span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">یەکجار</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        هیچ تۆمارێک نەدۆزرایەوە
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cost Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-bold mb-6">شیکردنەوەی خەرجی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-blue-600">خەرجی بە پێی مانگ</h3>
              <div className="h-64">
                <Bar 
                  data={getMonthlyTrendData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-purple-600">پێشبینی خەرجی</h3>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-purple-800 text-sm mb-2">
                  بەپێی ڕێڕەوی خەرجییەکان، پێشبینیدەکرێت خەرجییەکان بەڕێژەی {
                    filteredCosts.length > 3 ? '8' : '0'
                  }% زیاد بکات لە مانگی داهاتوودا
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">کۆی خەرجی ئێستا</span>
                  <span className="font-medium">${totalCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">پێشبینی مانگی داهاتوو</span>
                  <span className="font-medium text-purple-600">
                    ${filteredCosts.length > 3 ? (totalCosts * 1.08).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}
                  </span>
                </div>
              </div>
              
              <h4 className="font-medium mb-2 text-gray-700">خەرجییە بەرزەکان</h4>
              <ul className="space-y-2">
                {categories
                  .filter(c => c.id !== 'all')
                  .map(category => {
                    const categoryTotal = filteredCosts
                      .filter(item => item.category === category.id)
                      .reduce((sum, item) => sum + item.amount, 0);
                    
                    const percentage = totalCosts > 0 ? 
                      Math.round((categoryTotal / totalCosts) * 100) : 0;
                    
                    return percentage > 0 ? (
                      <li key={category.id} className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{
                            backgroundColor: 
                              category.id === 'salaries' ? '#3b82f6' :
                              category.id === 'supplements' ? '#10b981' :
                              category.id === 'equipment' ? '#f59e0b' :
                              category.id === 'rent' ? '#ef4444' : '#8b5cf6'
                          }}
                        ></div>
                        <span className="text-gray-600 text-sm flex-grow">{category.name}</span>
                        <span className="font-medium text-sm">{percentage}%</span>
                      </li>
                    ) : null;
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostsAnalysisPage;