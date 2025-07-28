import { useState, useEffect } from 'react';
import { Clock, User, Mail, Shield, Calendar, Filter, Search, Trash } from 'lucide-react';
import Navbar from '../components/layout/Nav';

export default function LoginHistory() {
    const [loginHistory, setLoginHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const today = new Date().toLocaleDateString('en-CA');
    const [dateFilter, setDateFilter] = useState(today);

    useEffect(() => {
        fetchLoginHistory();
    }, []);

    const fetchLoginHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/auth/login-history`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch login history');
            }

            const data = await response.json();
            setLoginHistory(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ckb-IQ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filterLoginHistory = () => {
        let filtered = loginHistory;

        if (filter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(record => {
                const loginDate = new Date(record.login_time);

                switch (filter) {
                    case 'today':
                        return loginDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return loginDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return loginDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(record => {
                const loginDate = new Date(record.login_time);
                return loginDate.toDateString() === filterDate.toDateString();
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(record =>
                record?.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredHistory = filterLoginHistory();

    const getRoleColor = (role) => {
        const colors = {
            'بەڕێوەبەر': 'bg-purple-100 text-purple-800 border-purple-200',
            'ژمێریار': 'bg-green-100 text-green-800 border-green-200',
            'پرۆگرامەر': 'bg-blue-100 text-blue-800 border-blue-200',
            'وەرگێڕ': 'bg-orange-100 text-orange-800 border-orange-200',
            'default': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[role] || colors.default;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">تکایە چاوەڕوان بە...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
                <div className="container mx-auto p-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="گەڕان لە تۆمارەکان..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <Filter className="text-gray-500" size={20} />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="all">هەموو تۆمارەکان</option>
                                    <option value="today">ئەمڕۆ</option>
                                    <option value="week">ئەم هەفتەیە</option>
                                    <option value="month">ئەم مانگە</option>
                                </select>
                            </div>

                            <div className="relative">
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="دیاریکردنی ڕۆژ"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setSearchTerm('');
                                    setDateFilter(today);
                                }}
                                className="px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 cursor-pointer transition-colors
                                flex items-center justify-center gap-2"
                            >
                               <span>پاککردنەوەی فلتەرەکان</span>
                                <span><Trash/></span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-600 text-center font-medium">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            کارمەند
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            پۆست
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            کاتی چوونەژوورەوە
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            ئیمەیڵ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                                        <Clock className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500 text-lg font-medium mb-2">هیچ تۆمارێک نییە</p>
                                                    <p className="text-gray-400 text-sm">هیچ تۆمارێکی چوونەژوورەوە نەدۆزرایەوە کە لەگەڵ ئەو پێوەرانە بگونجێت</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map((record, index) => (
                                            <tr key={record.login_track_id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                                                                <User className="h-6 w-6 text-white" />
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {record.employee_name || 'ناو نەدۆزرایەوە'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                ناسنامە: {record.e_id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(record.employee_role)}`}>
                                                        <Shield className="h-3 w-3" />
                                                        {record.employee_role || 'پۆست دیاری نەکراوە'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900 font-medium">
                                                            {formatDate(record.login_time)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {record.employee_email || 'ئیمەیڵ نەدۆزرایەوە'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}