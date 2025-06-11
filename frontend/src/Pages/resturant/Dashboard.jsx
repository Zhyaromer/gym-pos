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
    Settings,
    Bell,
    BadgeDollarSign,
    FileBarChart,
    TrendingUp,
    Ticket,
    Coins,
    ReceiptTextIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Nav';

export default function GymDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "جۆن دۆ", role: "بەڕێوەبەر" });

    const dashboardItems = [
        {
            title: "مێزەکان",
            icon: <Bell size={24} />,
            color: "bg-gradient-to-r from-pink-500 to-rose-600",
            link: "/R_main"
        },
        {
            title: "زیادکردنی کارمەند",
            icon: <UserPlus2 size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link: "/R_AddEmployee"
        },
        {
            title: "کارمەندەکان",
            icon: <UserCircle size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link: "/R_employees"
        },
        {
            title: "موچەی کارمەندەکان",
            icon: <DollarSign size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link: "/R_salarypayments"
        },
        {
            title: "فرۆشتن",
            icon: <ShoppingCart size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/R_selling"
        },
        {
            title: "کۆگا",
            icon: <Package size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/R_inventory"
        },
        {
            title: "زیادکردنی بەرهەم",
            icon: <PlusCircle size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/R_addinventory"
        },
        {
            title: "گەڕان بۆ وەسڵ",
            icon: <ReceiptTextIcon size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/R_recptioin"
        },
        {
            title: "خیابات",
            icon: <ClipboardList size={24} />,
            color: "bg-gradient-to-r from-red-500 to-rose-600",
            link: "/R_attendence"
        },
        {
            title: "خەرجیەکان",
            icon: <Coins size={24} />,
            color: "bg-gradient-to-r from-green-500 to-emerald-600",
            link: "/R_expenses"
        },
        {
            title: "ڕاپۆرت",
            icon: <FileBarChart size={24} />,
            color: "bg-gradient-to-r from-cyan-500 to-teal-600",
            link: "/R_report"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Navbar />

            <div>
                <img src="/imgs/employees/employee_1747749643328.jpg" alt="" />
            </div>

            <div className="container mx-auto p-6">
                <div className="mb-8 bg-white rounded-xl p-6 shadow-lg text-right">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">داشبۆردی بەڕێوەبردنی ڕێستۆرانت</h1>
                    <p className="text-gray-600">بەخێربێیت، {user.name} | {user.role}</p>
                </div>

                <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 cursor-pointer">
                    {dashboardItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.link)}
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