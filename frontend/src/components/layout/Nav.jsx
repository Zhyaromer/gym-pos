import { ArrowLeft, Dumbbell, UserCircle, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
    const [isShown, setIsShown] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    useEffect(() => {
        setIsShown(location.pathname !== "/dashboard");
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    return (
        <nav dir="rtl" className="bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">

                <div className="flex items-center space-x-3 ml-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center space-x-2 px-3 py-2 cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-transparent hover:border-gray-200"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {user?.name || "کاربەر"}
                            </span>
                            <UserCircle className="text-gray-500" size={20} />
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full cursor-pointer flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>چوونە دەرەوە</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <p>|</p>
                    <p
                        className="flex items-center space-x-2 px-3 py-2 cursor-pointer rounded-lg bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200"
                    >
                        <span className="text-sm font-medium text-gray-700">
                            {user?.role}
                        </span>
                    </p>
                </div>

                <div className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 rounded-lg p-2">
                        <Dumbbell className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">یانەی تەندروستی</h1>
                </div>

                <div className="flex items-center mr-3">
                    {isShown && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 cursor-pointer rounded-lg hover:bg-gray-50 bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200"
                        >
                            <ArrowLeft className="text-gray-600" size={20} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;