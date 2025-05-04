
import { useState, useEffect } from 'react';
import { 
  DollarSign, Filter, ChevronDown, Download, 
  TrendingUp, PieChart, BarChart, Calendar,
  Award, Tag, CreditCard, ArrowUp, ArrowDown
} from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, Title
);

const ProfitAnalysisPage = () => {
  // State for filters
  const [dateRange, setDateRange] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Mock sales data with costs and profits
  const salesData = [
    // Current month data
    { id: 1, date: '2023-11-01', category: 'supplements', product: 'پڕۆتینی وەی', revenue: 4200, cost: 3200, profit: 1000 },
    { id: 2, date: '2023-11-03', category: 'equipment', product: 'باندی بەرگری', revenue: 1800, cost: 1200, profit: 600 },
    { id: 3, date: '2023-11-05', category: 'supplements', product: 'کرێاتین', revenue: 1500, cost: 900, profit: 600 },
    { id: 4, date: '2023-11-10', category: 'memberships', product: 'ئەندامێتی مانگانە', revenue: 3500, cost: 500, profit: 3000 },
    { id: 5, date: '2023-11-15', category: 'services', product: 'ڕاهێنەری تایبەت', revenue: 2500, cost: 1000, profit: 1500 },
    { id: 6, date: '2023-11-20', category: 'supplements', product: 'پێش وەرزش', revenue: 1900, cost: 1200, profit: 700 },
    { id: 7, date: '2023-11-25', category: 'apparel', product: 'کراسی جیم', revenue: 1200, cost: 600, profit: 600 },
    
    // Previous month data
    { id: 8, date: '2023-10-02', category: 'supplements', product: 'پڕۆتینی وەی', revenue: 3800, cost: 2900, profit: 900 },
    { id: 9, date: '2023-10-05', category: 'memberships', product: 'ئەندامێتی مانگانە', revenue: 3200, cost: 500, profit: 2700 },
    
    // Last year data
    { id: 10, date: '2022-11-10', category: 'equipment', product: 'رۆڵەری فۆم', revenue: 800, cost: 400, profit: 400 },
  ];

  // Categories configuration
  const categories = [
    { id: 'all', name: 'هەموو' },
    { id: 'supplements', name: 'پڕۆتین' },
    { id: 'equipment', name: 'کەل و پەل' },
    { id: 'memberships', name: 'ئەندامێتی' },
    { id: 'services', name: 'خزمەتگوزاری' },
    { id: 'apparel', name: 'جلوبەرگ' },
  ];

  // Filter data based on selected filters
  const filterData = () => {
    let filtered = [...salesData];
    
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
    
    return filtered;
  };

  const filteredSales = filterData();

  // Calculate totals
  const totalRevenue = filteredSales.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = filteredSales.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

  // Find most profitable category
  const getMostProfitableCategory = () => {
    const categoryProfits = {};
    
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        categoryProfits[cat.id] = {
          name: cat.name,
          profit: 0,
          count: 0
        };
      }
    });
    
    filteredSales.forEach(item => {
      categoryProfits[item.category].profit += item.profit;
      categoryProfits[item.category].count++;
    });
    
    let mostProfitable = { name: '', profit: 0, avg: 0 };
    Object.values(categoryProfits).forEach(cat => {
      const avgProfit = cat.count > 0 ? cat.profit / cat.count : 0;
      if (cat.profit > mostProfitable.profit) {
        mostProfitable = {
          name: cat.name,
          profit: cat.profit,
          avg: avgProfit
        };
      }
    });
    
    return mostProfitable;
  };

  const mostProfitableCategory = getMostProfitableCategory();

  // Prepare chart data
  const getCategoryProfitData = () => {
    const categoryMap = {};
    
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        categoryMap[cat.name] = 0;
      }
    });
    
    filteredSales.forEach(item => {
      const category = categories.find(c => c.id === item.category);
      if (category) {
        categoryMap[category.name] += item.profit;
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
    
    filteredSales.forEach(item => {
      const month = item.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, cost: 0, profit: 0 };
      }
      monthlyData[month].revenue += item.revenue;
      monthlyData[month].cost += item.cost;
      monthlyData[month].profit += item.profit;
    });
    
    // Convert to array and sort by month
    const sortedMonths = Object.keys(monthlyData).sort();
    
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
          label: 'داھات',
          data: sortedMonths.map(month => monthlyData[month].revenue),
          backgroundColor: '#10b981',
        },
        {
          label: 'تێچوو',
          data: sortedMonths.map(month => monthlyData[month].cost),
          backgroundColor: '#ef4444',
        },
        {
          label: 'قازانج',
          data: sortedMonths.map(month => monthlyData[month].profit),
          backgroundColor: '#3b82f6',
        }
      ]
    };
  };

  // Compare with previous period
  const getComparison = () => {
    if (dateRange === 'today' || dateRange === 'yesterday' || !['this_month', 'last_month', 'last_year'].includes(dateRange)) {
      return { percentage: 0, isIncrease: true };
    }
    
    let currentData = [...filteredSales];
    let previousData = [];
    const now = new Date();
    
    switch(dateRange) {
      case 'this_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        previousData = salesData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= lastMonth && itemDate <= endLastMonth;
        });
        break;
      case 'last_month':
        const monthBeforeLast = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const endMonthBeforeLast = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        previousData = salesData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= monthBeforeLast && itemDate <= endMonthBeforeLast;
        });
        break;
      case 'last_year':
        previousData = salesData.filter(item => {
          const itemYear = new Date(item.date).getFullYear();
          return itemYear === now.getFullYear() - 2;
        });
        break;
    }
    
    const currentProfit = currentData.reduce((sum, item) => sum + item.profit, 0);
    const previousProfit = previousData.reduce((sum, item) => sum + item.profit, 0);
    
    if (previousProfit === 0) {
      return { percentage: 0, isIncrease: true };
    }
    
    const percentage = Math.abs(Math.round(((currentProfit - previousProfit) / previousProfit) * 100));
    const isIncrease = currentProfit >= previousProfit;
    
    return { percentage, isIncrease };
  };

  const comparison = getComparison();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">شیکردنەوەی قازانج</h1>
            <p className="text-gray-600">وردبینی قازانج بە پێی کات و پۆل</p>
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
            
            <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
              <Download className="h-4 w-4" />
              داگرتن
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">کۆی داھات</p>
                <h3 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-2">{filteredSales.length} فرۆش</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">کۆی تێچوو</p>
                <h3 className="text-2xl font-bold mt-1">${totalCost.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-2">
                  {totalRevenue > 0 ? ((totalCost/totalRevenue*100).toFixed(1) + '%') : '0%'}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">کۆی قازانج</p>
                <h3 className="text-2xl font-bold mt-1">${totalProfit.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-2">
                  {profitMargin.toFixed(1)}% ڕێژەی قازانج
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">باشترین پۆل</p>
                <h3 className="text-2xl font-bold mt-1">{mostProfitableCategory.name}</h3>
                <p className="text-gray-500 text-sm mt-2">
                  ${mostProfitableCategory.profit.toLocaleString()} کۆی قازانج
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        {comparison.percentage > 0 && (
          <div className={`mb-6 p-4 rounded-lg ${comparison.isIncrease ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center">
              {comparison.isIncrease ? (
                <ArrowUp className="h-5 w-5 mr-2" />
              ) : (
                <ArrowDown className="h-5 w-5 mr-2" />
              )}
              <span>
                قازانج {comparison.isIncrease ? 'زیادبوو' : 'کەمبوو'} بە ڕێژەی {comparison.percentage}% بە بەراورد بە 
                {' '}
                {dateRange === 'this_month' ? 'مانگی ڕابردوو' : 
                 dateRange === 'last_month' ? '٢ مانگ لەمەوپێش' : 
                 'ساڵی ڕابردوو'}
              </span>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profit by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <h2 className="text-lg font-bold mb-6">قازانج بە پێی پۆل</h2>
            <div className="h-80">
              <Pie 
                data={getCategoryProfitData()} 
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

          {/* Profit Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-6">ڕێڕەوی قازانج</h2>
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

          {/* Top Products */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-6">باشترین بەرهەمەکان</h2>
            <div className="space-y-4">
              {filteredSales
                .sort((a, b) => b.profit - a.profit)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-500 mr-2">{index + 1}.</span>
                      <span className="text-gray-700">{item.product}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium text-blue-600">${item.profit}</span>
                      <span className="block text-xs text-gray-500">
                        {item.revenue > 0 ? Math.round((item.profit / item.revenue) * 100) : 0}% ڕێژە
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Detailed Profit Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-bold mb-6">وردبینی قازانج</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">بەروار</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">پۆل</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">بەرهەم</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">داھات</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تێچوو</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">قازانج</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ڕێژەی قازانج</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => {
                    const category = categories.find(c => c.id === sale.category);
                    const profitMargin = sale.revenue > 0 ? (sale.profit / sale.revenue * 100) : 0;
                    
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category?.name || sale.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{sale.product}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">${sale.revenue}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">${sale.cost}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">${sale.profit}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            profitMargin > 30 ? 'bg-green-100 text-green-800' :
                            profitMargin > 15 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {profitMargin.toFixed(1)}%
                          </span>
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
      </div>
    </div>
  );
};

export default ProfitAnalysisPage;