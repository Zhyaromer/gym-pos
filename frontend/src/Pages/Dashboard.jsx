import { useState } from 'react';
import {
    Users,
    UserPlus,
    UserSearch,
    UserCircle,
    UserPlus2,
    Package,
    ShoppingCart,
    Database,
    BadgeDollarSign,
    FileBarChart,
    Clock,
    Ticket,
    Coins,
    ReceiptTextIcon,
    History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Nav';
import { useAuth } from "../contexts/AuthContext";

export default function GymDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const dashboardItems = [
        {
            title: "زیادکردنی ئەندام",
            icon: <UserPlus size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link: "/AddMember"
        },
        {
            title: "ئەندامەکان",
            icon: <Users size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link: "/users"
        },
        {
            title: "گەڕان بە دوای ئەندام",
            icon: <UserSearch size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link: "/membership-check"
        },
        ,
        {
            title: 'ئیشتراکەکان (کارمەند)',
            icon: <ReceiptTextIcon size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link: "/today_members"
        },
        {
            title: 'ئیشتراکەکان (بەڕیوبەر)',
            icon: <ReceiptTextIcon size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link: "/today_members_admin"
        },
        {
            title: 'کاتی هاتنی یاریزانەکان ',
            icon: <Clock size={24} />,
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            link: "/entery_time"
        },
        {
            title: "زیادکردنی کارمەند",
            icon: <UserPlus2 size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link: "/AddEmployee"
        },
        {
            title: "کارمەندەکان",
            icon: <UserCircle size={24} />,
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            link: "/employees"
        },
        {
            title: "فرۆشتن",
            icon: <ShoppingCart size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/selling"
        },
        {
            title: "کۆگا",
            icon: <Package size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/inventory"
        },
        {
            title: "گەڕان بۆ وەسڵ",
            icon: <ReceiptTextIcon size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/recptioin"
        },
        {
            title: "نرخەکان",
            icon: <BadgeDollarSign size={24} />,
            color: "bg-gradient-to-r from-teal-500 to-cyan-600",
            link: "/pricing"
        },
        {
            title: "خەرجیەکان",
            icon: <Coins size={24} />,
            color: "bg-gradient-to-r from-green-500 to-emerald-600",
            link: "/expenses"
        },
        {
            title: "مەلەوانگە",
            icon: <Ticket size={24} />,
            color: "bg-gradient-to-r from-slate-500 to-gray-600",
            link: "/pooltickets"
        },
        {
            title: "ڕاپۆرت",
            icon: <FileBarChart size={24} />,
            color: "bg-gradient-to-r from-cyan-500 to-teal-600",
            link: "/report"
        },
        {
            title: "باک ئەپ",
            icon: <Database size={24} />,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
            link: "/backup"
        },
        {
            title: "مێژووی چوونەژوورەوە",
            icon: <History size={24} />,
            color: "bg-gradient-to-r from-indigo-500 to-purple-600",
            link: "/login-history"
        },
    ];

    const currentTime = new Date().toLocaleDateString('ckb-IQ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Navbar />

            <div>
                <img src="/imgs/employees/employee_1747749643328.jpg" alt="" />
            </div>

            <div className="container mx-auto p-6">
                {/* <div className="mb-8 bg-white rounded-xl p-6 shadow-md text-right border border-gray-100">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">داشبۆردی بەڕێوەبردنی یانەی وەرزشی</h1>
                    <p className="text-gray-500 text-sm md:text-base">بەخێربێیت بۆ سیستەمەکە، {user.name} | {user.role}</p>
                </div> */}

                <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 cursor-pointer">
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