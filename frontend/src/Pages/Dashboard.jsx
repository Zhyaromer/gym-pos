import { useState } from 'react';
import {
    Users,
    UserPlus,
    UserSearch,
    UserCircle,
    UserPlus2,
    Package,
    PlusCircle,
    DollarSign,
    ClipboardList,
    ShoppingCart,
    CalendarDays,
    Settings,
    Bell,
    Dumbbell,
    LogOut,
    BadgeDollarSign,
    FileBarChart,
    TrendingUp,
    Ticket,
    Coins,
    Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GymDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });

    const dashboardItems = [
        {
            title: "زیادکردنی ئەندام",
            icon: <UserPlus size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link : "/AddMember"
        },
        {
            title: "ئەندامەکان",
            icon: <Users size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link : "/users"
        },
        {
            title: "گەڕان بە دوای ئەندام",
            icon: <UserSearch size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link : "/membership-check"
        },
        {
            title: "زیادکردنی کارمەند",
            icon: <UserPlus2 size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link : "/AddEmployee"
        },
        {
            title: "کارمەندەکان",
            icon: <UserCircle size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link : "/users"
        },
        {
            title: "موچەی کارمەندەکان",
            icon: <DollarSign size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link : "/users"
        },
        {
            title: "فرۆشتن",
            icon: <ShoppingCart size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link : "/users"
        },
        {
            title: "کۆگا",
            icon: <Package size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link : "/users"
        },
        {
            title: "زیادکردنی بەرهەم",
            icon: <PlusCircle size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link : "/users"
        },
        {
            title: "خیابات",
            icon: <ClipboardList size={24} />,
            color: "bg-gradient-to-r from-red-500 to-rose-600",
            link : "/users"
        },
        {
            title: "خشتەی ڕۆژانە",
            icon: <CalendarDays size={24} />,
            color: "bg-gradient-to-r from-indigo-500 to-violet-600",
            link : "/users"
        },
        {
            title: "نرخەکان",
            icon: <BadgeDollarSign size={24} />,
            color: "bg-gradient-to-r from-teal-500 to-cyan-600",
            link : "/users"
        },
        {
            title: "خەرجیەکان",
            icon: <Coins size={24} />,
            color: "bg-gradient-to-r from-green-500 to-emerald-600",
            link : "/users"
        },
        {
            title: "زیادکردنی خەرجی",
            icon: <Receipt size={24} />,
            color: "bg-gradient-to-r from-green-500 to-emerald-600",
            link : "/users"
        },
        {
            title: "مەلەوانگە",
            icon: <Ticket size={24} />,
            color: "bg-gradient-to-r from-orange-500 to-amber-600",
            link : "/users"
        },
        {
            title: "قازانج",
            icon: <TrendingUp size={24} />,
            color: "bg-gradient-to-r from-emerald-500 to-green-600",
            link : "/users"
        },
        {
            title: "ڕاپۆرت",
            icon: <FileBarChart size={24} />,
            color: "bg-gradient-to-r from-cyan-500 to-teal-600",
            link : "/users"
        },
        {
            title: "ئاگادارییەکان",
            icon: <Bell size={24} />,
            color: "bg-gradient-to-r from-pink-500 to-rose-600",
            link : "/users"
        },
        {
            title: "ڕێکخستنەکان",
            icon: <Settings size={24} />,
            color: "bg-gradient-to-r from-slate-500 to-gray-600",
            link : "/users"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Dumbbell className="text-blue-600" size={28} />
                        <h1 className="text-xl font-bold text-gray-800">یانەی تەندروستی</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 rounded-lg p-2 cursor-pointer">
                            <span className="text-sm font-medium text-gray-700">{user.name}</span>
                            <UserCircle className="text-blue-600" size={24} />
                        </div>
                        <LogOut className="text-gray-600 cursor-pointer hover:text-red-600" size={20} />
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-6">
                <div className="mb-8 bg-white rounded-xl p-6 shadow-lg text-right">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">داشبۆردی بەڕێوەبردنی یانەی وەرزشی</h1>
                    <p className="text-gray-600">بەخێربێیت، {user.name} | {user.role}</p>
                </div>

                <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 cursor-pointer">
                    {dashboardItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={()=> navigate(item.link)}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 ${item.color} opacity-90`}></div>

                            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white opacity-10 -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white opacity-10 -ml-8 -mb-8"></div>

                            <div className="relative p-6 flex flex-col items-center justify-center h-full min-h-40">
                                <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <div className={`text-${item.color.split('from-')[1].split('-')[0]}-600`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white text-center">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}