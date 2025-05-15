import { useState, useEffect } from 'react';
import {
  User,
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
  DollarSign,
  Users,
  BarChart2,
  Droplets
} from 'lucide-react';
import Navbar from '../components/layout/Nav';

export default function PoolTickets() {
  const [ticketSales, setTicketSales] = useState([
    {
      id: 1,
      name: 'ئارام عەلی',
      gender: 'نێر',
      ageCategory: 'گەورە',
      price: 15,
      date: '2023-06-15',
      time: '14:30'
    },
    {
      id: 2,
      name: 'شەیدا کەریم',
      gender: 'مێ',
      ageCategory: 'گەورە',
      price: 15,
      date: '2023-06-15',
      time: '15:45'
    },
    {
      id: 3,
      name: 'هێمن عومەر',
      gender: 'نێر',
      ageCategory: 'گەورە',
      price: 15,
      date: '2023-06-16',
      time: '10:15'
    },
    {
      id: 4,
      name: 'لانە ئەحمەد',
      gender: 'مێ',
      ageCategory: 'منداڵ',
      price: 8,
      date: '2023-06-16',
      time: '11:00'
    },
    {
      id: 5,
      name: 'ئاکۆ محەمەد',
      gender: 'نێر',
      ageCategory: 'منداڵ',
      price: 8,
      date: '2023-06-16',
      time: '11:30'
    },
    {
      id: 6,
      name: 'شادان ڕەزا',
      gender: 'مێ',
      ageCategory: 'منداڵ',
      price: 8,
      date: '2023-06-17',
      time: '09:45'
    },
    {
      id: 7,
      name: 'سامان سەعید',
      gender: 'نێر',
      ageCategory: 'گەورە',
      price: 15,
      date: '2023-06-17',
      time: '16:20'
    },
    {
      id: 8,
      name: 'تارا جەمال',
      gender: 'مێ',
      ageCategory: 'گەورە',
      price: 15,
      date: '2023-06-17',
      time: '17:00'
    },
  ]);

  const today = new Date().toLocaleDateString('en-CA');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterDate, setFilterDate] = useState(today);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    name: '',
    gender: '',
    ageCategory: '',
    price: 0,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  });
  // State for editing
  const [editingTicket, setEditingTicket] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  // Categories for filtering
  const ageCategories = ['All', 'گەورە', 'منداڵ'];
  const genderCategories = ['All', 'نێر', 'مێ'];

  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    adultCount: 0,
    childCount: 0,
    maleCount: 0,
    femaleCount: 0,
    dailyRevenue: 0
  });

  // Calculate stats
  useEffect(() => {
    // Filter today's sales
    const todaySales = ticketSales.filter(ticket => ticket.date === today);

    const adultCount = todaySales.filter(ticket => ticket.ageCategory === 'گەورە').length;
    const childCount = todaySales.filter(ticket => ticket.ageCategory === 'منداڵ').length;
    const maleCount = todaySales.filter(ticket => ticket.gender === 'نێر').length;
    const femaleCount = todaySales.filter(ticket => ticket.gender === 'مێ').length;
    const totalSales = todaySales.length;
    const dailyRevenue = todaySales.reduce((sum, ticket) => sum + ticket.price, 0);

    setStats({
      totalSales,
      adultCount,
      childCount,
      maleCount,
      femaleCount,
      dailyRevenue
    });
  }, [ticketSales, today]);

  // Filter tickets based on search term and filters
  const filteredTickets = ticketSales.filter(ticket => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeCategory = filterCategory === 'All' || ticket.ageCategory === filterCategory;
    const matchesGender = filterGender === 'All' || ticket.gender === filterGender;
    const matchesDate = filterDate === '' || ticket.date === filterDate;
    return matchesSearch && matchesAgeCategory && matchesGender && matchesDate;
  });

  // Handle adding new ticket
  const handleAddTicket = () => {
    if (newTicket.name && newTicket.gender && newTicket.ageCategory) {
      // Set price based on age category
      const price = newTicket.ageCategory === 'گەورە' ? 15 : 8;

      setTicketSales([
        ...ticketSales,
        {
          id: ticketSales.length + 1,
          ...newTicket,
          price
        }
      ]);
      setNewTicket({
        name: '',
        gender: '',
        ageCategory: '',
        price: 0,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5)
      });
      setShowAddModal(false);
    }
  };

  // Start editing a ticket
  const startEditing = (ticket) => {
    setEditingTicket(ticket.id);
    setEditedValues({ ...ticket });
  };

  // Save edited ticket
  const saveEditing = () => {
    if (editedValues.name && editedValues.gender && editedValues.ageCategory) {
      // Update price if age category changed
      const price = editedValues.ageCategory === 'گەورە' ? 15 : 8;

      setTicketSales(ticketSales.map(ticket =>
        ticket.id === editingTicket ? { ...editedValues, price } : ticket
      ));
      setEditingTicket(null);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTicket(null);
  };

  // Delete a ticket
  const deleteTicket = (id) => {
    if (confirm('دڵنیایت کە دەتەوێت ئەم بلیتە بسڕیتەوە؟')) {
      setTicketSales(ticketSales.filter(ticket => ticket.id !== id));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ku', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} د.ع`;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
            <Navbar/>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 ml-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">کۆی بلیت فرۆشراو ئەمڕۆ</p>
              <p className="text-xl font-bold">{stats.totalSales}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 ml-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">داهاتی ئەمڕۆ</p>
              <p className="text-xl font-bold">{formatCurrency(stats.dailyRevenue)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 ml-4">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">گەورە / منداڵ</p>
              <p className="text-xl font-bold">{stats.adultCount} / {stats.childCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-orange-100 p-3 ml-4">
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">نێر / مێ</p>
              <p className="text-xl font-bold">{stats.maleCount} / {stats.femaleCount}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="گەڕان بە ناو..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">هەموو تەمەنەکان</option>
                  <option value="گەورە">گەورە</option>
                  <option value="منداڵ">منداڵ</option>
                </select>
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="All">هەموو ڕەگەزەکان</option>
                  <option value="نێر">نێر</option>
                  <option value="مێ">مێ</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
                onClick={() => setShowAddModal(true)}
              >
                بلیتی نوێ
                <Plus size={18} className="mr-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ناو
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ڕەگەز
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تەمەن
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نرخ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بەروار
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کات
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کردارەکان
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.id ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.name}
                            onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{ticket.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.id ? (
                          <select
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.gender}
                            onChange={(e) => setEditedValues({ ...editedValues, gender: e.target.value })}
                          >
                            <option value="نێر">نێر</option>
                            <option value="مێ">مێ</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{ticket.gender}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.id ? (
                          <select
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.ageCategory}
                            onChange={(e) => setEditedValues({ ...editedValues, ageCategory: e.target.value })}
                          >
                            <option value="گەورە">گەورە</option>
                            <option value="منداڵ">منداڵ</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{ticket.ageCategory}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(ticket.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.id ? (
                          <input
                            type="date"
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.date}
                            onChange={(e) => setEditedValues({ ...editedValues, date: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{formatDate(ticket.date)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.id ? (
                          <input
                            type="time"
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.time}
                            onChange={(e) => setEditedValues({ ...editedValues, time: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{ticket.time}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingTicket === ticket.id ? (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={saveEditing}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => startEditing(ticket)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteTicket(ticket.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      هیچ بلیتێک نەدۆزرایەوە
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute left-4 top-4 text-gray-100 hover:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="bg-blue-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white text-right">زیادکردنی بلیتی نوێ</h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">ناو</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">ڕەگەز</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTicket.gender}
                  onChange={(e) => setNewTicket({ ...newTicket, gender: e.target.value })}
                >
                  <option value="">هەڵبژاردنی ڕەگەز</option>
                  <option value="نێر">نێر</option>
                  <option value="مێ">مێ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">تەمەن</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTicket.ageCategory}
                  onChange={(e) => setNewTicket({ ...newTicket, ageCategory: e.target.value })}
                >
                  <option value="">هەڵبژاردنی تەمەن</option>
                  <option value="گەورە">گەورە</option>
                  <option value="منداڵ">منداڵ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">بەروار</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTicket.date}
                    onChange={(e) => setNewTicket({ ...newTicket, date: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">کات</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTicket.time}
                    onChange={(e) => setNewTicket({ ...newTicket, time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-start gap-2">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={handleAddTicket}
              >
                زیادکردن
              </button>
              <button
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                onClick={() => setShowAddModal(false)}
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