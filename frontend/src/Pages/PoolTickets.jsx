import { useState, useEffect } from 'react';
import {
  User,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Users,
  BarChart2,
} from 'lucide-react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function PoolTickets() {
  const [ticketSales, setTicketSales] = useState([]);
  const today = new Date().toLocaleDateString('en-CA');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterDate, setFilterDate] = useState(today);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    name: '',
    gender: '',
    age: '',
    price: 0,
    entry_date: new Date().toLocaleDateString('en-CA'),
    entry_time: new Date().toTimeString().slice(0, 5)
  });
  const [editingTicket, setEditingTicket] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/pool/get_all_pool?date=${filterDate}`)
        if (res.status === 200) {
          setTicketSales(res.data.records)
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();
  }, [filterDate])

  const filteredTickets = ticketSales.filter(ticket => {
    const matchesSearch = !searchTerm || ticket.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesAgeCategory = filterCategory === 'All' || ticket?.age === filterCategory;
    const matchesGender = filterGender === 'All' || ticket.gender === filterGender;
    
    const ticketDate = ticket.entry_date ? new Date(ticket.entry_date).toLocaleDateString('en-CA') : null;
    const matchesDate = !filterDate || ticketDate === filterDate;
    
    return matchesSearch && matchesAgeCategory && matchesGender && matchesDate;
  });

  const handleAddTicket = async () => {
    if (newTicket.name && newTicket.gender && newTicket.age && newTicket.entry_date && newTicket.entry_time) {
      try {
        const price = newTicket.age === 'گەورە' ? 15 : 8;

        const data = {
          name: newTicket.name,
          gender: newTicket.gender,
          age: newTicket.age,
          price: price,
          entry_date: newTicket.entry_date,
          entry_time: newTicket.entry_time
        }

        const res = await axios.post(`http://localhost:3000/pool/add_pool`, data);

        if (res.status === 200) {
          alert('pool ticket added successfully')
          setTicketSales([
            ...ticketSales,
            {
              ...newTicket,
              price : price * 1000
            }
          ]);
          setNewTicket({
            name: '',
            gender: '',
            age: '',
            price: 0,
            entry_date: new Date().toLocaleDateString('en-CA'),
            entry_time: new Date().toTimeString().slice(0, 5)
          });
          setShowAddModal(false);
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const startEditing = (ticket) => {
    setEditingTicket(ticket.swimmingpool_id);
    setEditedValues({ ...ticket });
  };

  const saveEditing = async () => {
    if (editedValues.name && editedValues.gender && editedValues.age && editedValues.entry_date && editedValues.entry_time) {
      try {
        const price = editedValues.age === 'گەورە' ? 15 : 8;

        const data = {
          swimmingpool_id: editedValues.swimmingpool_id,
          name: editedValues.name,
          gender: editedValues.gender,
          age: editedValues.age,
          price: price,
          entry_date: editedValues.entry_date,
          entry_time: editedValues.entry_time
        }

        const res = await axios.patch(`http://localhost:3000/pool/update_pool`, data);

        if (res.status === 200) {
          setTicketSales(ticketSales.map(ticket =>
            ticket.swimmingpool_id === editingTicket ? { ...editedValues, price : price * 1000 } : ticket
          ));
          setEditingTicket(null);
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const cancelEditing = () => {
    setEditingTicket(null);
  };

  const deleteTicket = async (id) => {
    if (confirm('دڵنیایت کە دەتەوێت ئەم بلیتە بسڕیتەوە؟')) {
      try {
        const res = await axios.delete(`http://localhost:3000/pool/delete_pool/${id}`)

        if (res.status === 200) {
          alert('pool ticket deleted successfully')
          setTicketSales(ticketSales.filter(ticket => ticket.swimmingpool_id !== id));
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-gb', options);
  };

  const formatCurrency = (amount) => {
    return `${amount?.toLocaleString()} د.ع`;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 ml-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">کۆی بلیت فرۆشراو ئەمڕۆ</p>
              <p className="text-xl font-bold">{stats.sold_tickets}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 ml-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">داهاتی ئەمڕۆ</p>
              <p className="text-xl font-bold">{(formatCurrency(stats.total_sold_tickets)) || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 ml-4">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">گەورە / منداڵ</p>
              <p className="text-xl font-bold">{stats.adult} / {stats.kids}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-orange-100 p-3 ml-4">
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">پیاو / ئافرەت</p>
              <p className="text-xl font-bold">{stats.male} / {stats.female}</p>
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
                  <option value="پیاو">پیاو</option>
                  <option value="ئافرەت">ئافرەت</option>
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
                    <tr key={ticket.swimmingpool_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.swimmingpool_id ? (
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
                        {editingTicket === ticket.swimmingpool_id ? (
                          <select
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.gender}
                            onChange={(e) => setEditedValues({ ...editedValues, gender: e.target.value })}
                          >
                            <option value="پیاو">پیاو</option>
                            <option value="ئافرەت">ئافرەت</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{ticket.gender}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.swimmingpool_id ? (
                          <select
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.age}
                            onChange={(e) => setEditedValues({ ...editedValues, age: e.target.value })}
                          >
                            <option value="گەورە">گەورە</option>
                            <option value="منداڵ">منداڵ</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{ticket?.age}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(ticket.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.swimmingpool_id ? (
                          <input
                            type="date"
                            className="border rounded px-2 py-1 w-full"
                            value={new Date(new Date(editedValues.entry_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                            onChange={(e) => setEditedValues({ ...editedValues, entry_date: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{formatDate(ticket.entry_date)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTicket === ticket.swimmingpool_id ? (
                          <input
                            type="time"
                            className="border rounded px-2 py-1 w-full"
                            value={editedValues.entry_time}
                            onChange={(e) => setEditedValues({ ...editedValues, entry_time: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{ticket.entry_time}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingTicket === ticket.swimmingpool_id ? (
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
                              onClick={() => deleteTicket(ticket.swimmingpool_id)}
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
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute left-4 top-4 text-gray-100 hover:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="bg-blue-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white text-right">زیادکردنی بلیتی نوێ</h3>
            </div>

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
                  <option value="پیاو">پیاو</option>
                  <option value="ئافرەت">ئافرەت</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">تەمەن</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTicket.age}
                  onChange={(e) => setNewTicket({ ...newTicket, age: e.target.value })}
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
                    value={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                    onChange={(e) => setNewTicket({ ...newTicket, entry_date: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">کات</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTicket.entry_time}
                    onChange={(e) => setNewTicket({ ...newTicket, entry_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

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