import { ArrowLeft, Dumbbell, UserCircle, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ user }) => {
    const [isShown, setIsShown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        setIsShown(location.pathname !== "/dashboard");
    }, [location.pathname]);

    return (
        <nav dir="rtl" className="bg-white shadow-lg p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3 ml-3">
                    <div className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 rounded-full py-1 px-3 cursor-pointer border border-blue-200">
                        <span className="text-sm font-medium text-gray-700">{user?.name || "کاربەر"}</span>
                        <UserCircle className="text-blue-600" size={24} />
                    </div>
                    <button className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200">
                        <LogOut className="text-gray-600 hover:text-red-600" size={20} />
                    </button>
                </div>

                <div className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
                    <Dumbbell className="text-blue-600" size={30} />
                    <h1 className="text-2xl font-bold text-blue-800">یانەی تەندروستی</h1>
                </div>

                <div className="flex items-center mr-3">
                    {isShown && (
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                            <ArrowLeft className="text-gray-700" size={22} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;