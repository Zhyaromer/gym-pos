import { useState } from 'react';
import {
    Package,
    ArrowRight,
    Camera,
    Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddInventory() {
    const navigate = useNavigate();
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        image: ''
    });

    // Categories for filtering
    const categories = ['Weights', 'Equipment', 'Accessories', 'Supplements'];

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({ ...newItem, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset form fields
    const resetForm = () => {
        setNewItem({
            name: '',
            category: '',
            quantity: 0,
            price: 0,
            image: ''
        });
    };

    // Handle adding new item
    const handleAddItem = () => {
        if (newItem.name && newItem.category && newItem.quantity >= 0 && newItem.price >= 0) {
            const status = newItem.quantity === 0 ? 'Out of Stock' :
                newItem.quantity <= 5 ? 'Low Stock' : 'In Stock';

            // If no image is provided, use a placeholder
            const image = newItem.image || 'https://via.placeholder.com/150?text=No+Image';

            // In a real app, you would send this data to your backend or state management
            // For now, we'll just show a success message and reset the form
            alert('کاڵا بە سەرکەوتوویی زیاد کرا');
            resetForm();
        } else {
            alert('تکایە هەموو خانەکان پڕ بکەوە');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <header className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Package size={28} />
                        <h1 className="text-2xl font-bold">زیادکردنی کاڵای نوێ</h1>
                    </div>
                    <button
                        onClick={() => navigate('/inventory')}
                        className="flex items-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                        <ArrowRight size={16} className="ml-2" />
                        گەڕانەوە بۆ کۆگا
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ناوی کاڵا</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">جۆر</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option value="">جۆرێک هەڵبژێرە</option>
                                {categories.map(category => {
                                    const categoryTranslations = {
                                        'Weights': 'قورسایی',
                                        'Equipment': 'ئامێر',
                                        'Accessories': 'کەرەستە',
                                        'Supplements': 'تەواوکەر'
                                    };
                                    return (
                                        <option key={category} value={category}>{categoryTranslations[category] || category}</option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وێنە</label>
                            <div className="flex flex-col space-y-2">
                                {newItem.image && (
                                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={newItem.image}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                                <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <Camera size={20} className="mr-2 text-gray-500" />
                                    <span className="text-gray-500">وێنەیەک هەڵبژێرە</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ژمارە</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نرخ ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-2 justify-start ">
                        <button
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            onClick={handleAddItem}
                        >
                            <Save size={18} className="ml-2" />
                            زیادکردنی کاڵا
                        </button>
                        <button
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                            onClick={resetForm}
                        >
                            پاکردنەوە
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}