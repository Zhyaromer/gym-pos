import { useState, useEffect } from 'react';
import {
    Camera,
    Save,
    Plus,
    Tag,
    FolderOpen,
    DollarSign,
    Package,
    Trash2,
    ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

export default function AddInventory() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        stock: '',
        selling_price: '',
        cost_price: '',
        img: '',
        barcode: ''
    });

    const handleImageUpload = (e, isEditing = false) => {
        const file = e.target.files[0];
        if (file) {
            if (isEditing) {
                setEditedValues({ ...editedValues, img: file });
            } else {
                setNewItem({ ...newItem, img: file });
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`http://localhost:3000/category/getallcategory`)
            const categoriesArray = Object.values(res.data.rows);
            setCategories(categoriesArray);
        }
        fetchCategories()
    }, [])

    const [imagePreview, setImagePreview] = useState(null);

    const resetForm = () => {
        setNewItem({
            name: '',
            category: '',
            stock: '',
            selling_price: '',
            cost_price: '',
            img: '',
            barcode: ''
        });
    };

    const generateBarcode = () => {
        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
        return `${randomDigits}`;
    };

    const handleAddItem = async () => {
        if (newItem.name && newItem.category && newItem.stock >= 0 && newItem.selling_price >= 0 && newItem.cost_price >= 0) {

            const barcode = generateBarcode();

            try {
                const formData = new FormData();
                formData.append('name', newItem.name);
                formData.append('category_id', newItem.category);
                formData.append('stock', newItem.stock);
                formData.append('selling_price', newItem.selling_price);
                formData.append('cost_price', newItem.cost_price);
                formData.append('image', newItem.img);
                formData.append('barcode', barcode);

                const res = await axios.post(`http://localhost:3000/inventory/addproduct`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (res.status === 201) {
                    alert('کالایەکە با موفقیت زیادکرا');
                    resetForm();
                }

            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <Navbar />

            <div className="flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-gray-200 dark:border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center rtl:space-x-reverse">
                            <span>زیادکردنی کاڵای نوێ</span>
                            <Plus size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
                        </h2>
                    </div>

                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                ناوی کاڵا
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <Tag size={18} className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all placeholder:text-gray-400 rtl:text-right"
                                    placeholder="ناوی کاڵا بنووسە..."
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                جۆر
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <FolderOpen size={18} className="text-gray-400" />
                                </span>
                                <select
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3
                                            bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all appearance-none rtl:text-right"
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option value="">جۆرێک هەڵبژێرە</option>
                                    {categories?.map(category => {
                                        return (
                                            <option key={category.category_id} value={category.category_id}>{category.name}</option>
                                        );
                                    })}
                                </select>
                                <span className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pl-3 flex items-center pointer-events-none">
                                    <ChevronDown size={18} className="text-gray-400" />
                                </span>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                    نرخی کڕاو
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                        <DollarSign size={18} className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 
                                                bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                transition-all placeholder:text-gray-400 rtl:text-right"
                                        placeholder="نرخی کڕاو بنووسە..."
                                        value={newItem.cost_price}
                                        onChange={(e) => setNewItem({ ...newItem, cost_price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                    نرخی فرۆشتن
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                        <DollarSign size={18} className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 
                                        bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition-all placeholder:text-gray-400 rtl:text-right"
                                        placeholder="ناوی کاڵا بنووسە..."
                                        value={newItem.selling_price}
                                        onChange={(e) => setNewItem({ ...newItem, selling_price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                ژمارەی عەدەد
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <Package size={18} className="text-gray-400" />
                                </span>
                                <input
                                    type='text'
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3
                                            bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all rtl:text-right"
                                    placeholder="ژمارەی عەدەد بنووسە..."
                                    value={newItem.stock}
                                    onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                وێنە
                            </label>
                            <div className="mt-1">
                                {!newItem.img ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 
                              border-2 border-dashed border-gray-300 dark:border-gray-600 
                              rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 
                              transition-colors cursor-pointer group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera size={30} className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                <span className="font-medium text-blue-600 dark:text-blue-400">کرتە بکە بۆ هەڵبژاردنی وێنە</span>
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e)}
                                        />
                                    </label>
                                ) : (
                                    <div className="relative h-32 w-full rounded-xl overflow-hidden group">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button
                                                onClick={() => setNewItem({ ...newItem, img: null })}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-2 justify-start space-x-3 rtl:space-x-reverse">
                        <button
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium
                                        hover:bg-blue-700 transition-colors shadow-sm 
                                        disabled:bg-blue-400 disabled:cursor-not-allowed"
                            onClick={handleAddItem}
                            disabled={!newItem.name || !newItem.category || !newItem.cost_price || !newItem.selling_price || !newItem.stock}
                        >
                            زیادکردن
                        </button>
                        <button
                            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl
                                        text-gray-700 dark:text-gray-300 font-medium
                                        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => resetForm()}
                        >
                            پاکردنەوە
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}