import { useState, useEffect } from 'react';
import {
    Package,
    Search,
    Plus,
    Edit,
    Trash2,
    Filter,
    Tag,
    FolderOpen,
    ChevronDown,
    DollarSign,
    ShoppingBag,
    Save,
    X,
    Camera,
    Barcode,
    Download,
    Printer
} from 'lucide-react';
import { toPng } from 'html-to-image';
import jsbarcode from 'jsbarcode';
import QRCode from 'qrcode';
import axios from 'axios';
import Navbar from '../../components/layout/Nav';

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/sales/getallsales');
                setInventoryItems(response.data.data);
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            }
        };


        fetchItems();
    }, [])
    const [imagePreview, setImagePreview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        stock: '',
        selling_price: '',
        cost_price: '',
        img: '',
        barcode: ''
    });
    const [editingItem, setEditingItem] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [currentBarcode, setCurrentBarcode] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`http://localhost:3000/category/getallcategory`)
            const categoriesArray = Object.values(res.data.rows);
            setCategories(categoriesArray);
        }
        fetchCategories()
    }, [])

    const filteredItems = inventoryItems?.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const generateBarcode = () => {
        const categoryPrefix = {
            'Weights': 'WT',
            'Equipment': 'EQ',
            'Accessories': 'AC',
            'Supplements': 'SP'
        }[newItem.category] || 'IT';

        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
        return `${categoryPrefix}${randomDigits}`;
    };

    const renderBarcodeOnCanvas = (barcodeText, canvasId) => {
        const canvas = document.getElementById(canvasId);
        if (canvas && window.JsBarcode) {
            JsBarcode(canvas, barcodeText, {
                format: "CODE128",
                width: canvasId === 'barcode-canvas-print' ? 1 : 2,
                height: canvasId === 'barcode-canvas-print' ? 30 : 50,
                displayValue: false
            });
        }
    };

    const handlePrintBarcode = () => {
        const printElement = document.querySelector('.barcode-modal-print');
        if (printElement) {
            printElement.style.display = 'block';
        }
        renderBarcodeOnCanvas(currentBarcode, 'barcode-canvas-print');

        window.print();

        setTimeout(() => {
            if (printElement) {
                printElement.style.display = 'none';
            }
        }, 100);
    };

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
                    location.reload()
                }

            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    const startEditing = (item) => {
        setEditingItem(item.product_id);
        setEditedValues({ ...item });
    };

    const saveEditing = async () => {
        if (editedValues.name && editedValues.category && editedValues.stock >= 0 && editedValues.selling_price >= 0 && editedValues.cost_price >= 0) {
            const status = editedValues.stock === 0 ? 'Out of Stock' :
                editedValues.stock <= 5 ? 'Low Stock' : 'In Stock';

            const formData = new FormData();
            formData.append('name', editedValues.name);
            formData.append('category', editedValues.category);
            formData.append('stock', editedValues.stock);
            formData.append('selling_price', editedValues.selling_price);
            formData.append('cost_price', editedValues.cost_price);
            formData.append('image', editedValues.img);
            formData.append('barcode', editedValues.barcode);

            const res = await axios.patch(`http://localhost:3000/inventory/updateproduct/${editedValues.product_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.status === 200) {
                alert('کالایەکە با موفقیت ویرایشکرا');
                setInventoryItems(inventoryItems.map(item =>
                    item.product_id === editingItem ? { ...editedValues, status } : item
                ));
                setEditingItem(null);
            }
        }
    };

    const cancelEditing = () => {
        setEditingItem(null);
    };

    const deleteItem = async (product_id) => {
        if (confirm(`Are you sure you want to delete this item? ${product_id}`)) {
            try {
                const res = await axios.delete(`http://localhost:3000/inventory/deleteproduct/${product_id}`);

                if (res.status === 200) {
                    alert('کالایەکە با موفقیت حذفکرا');
                    setInventoryItems(inventoryItems.filter(item => item.product_id !== product_id));
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'بەردەست': return 'text-green-600 bg-green-100';
            case 'کەم': return 'text-amber-600 bg-amber-100';
            case 'نەماوە': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    useEffect(() => {
        if (showBarcodeModal && currentBarcode) {
            setTimeout(() => {
                const canvas = document.getElementById('barcode-canvas');
                if (canvas) {
                    jsbarcode(canvas, currentBarcode, {
                        format: "CODE128",
                        lineColor: "#000",
                        width: 2,
                        height: 100,
                        displayValue: true,
                        fontSize: 16,
                        margin: 10
                    });
                }
            }, 100);
        }
    }, [showBarcodeModal, currentBarcode]);

    const downloadBarcode = async () => {
        try {
            const barcodeElement = document.getElementById('barcode-canvas');
            if (barcodeElement) {
                const dataUrl = await toPng(barcodeElement);
                const link = document.createElement('a');
                link.download = `barcode-${currentBarcode}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error('Error downloading barcode:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50" dir="rtl">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-row-reverse flex-wrap gap-4 items-center justify-between">
                        <div className="relative flex-grow max-w-md">
                            <input
                                type="text"
                                placeholder="گەڕان بۆ کاڵاکان..."
                                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>

                        <div className="flex flex-row-reverse gap-4 items-center space-x-reverse">
                            <div className="flex gap-2 items-center">
                                <select
                                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="all">هەمووی</option>
                                    {categories?.map(category => {
                                        return (
                                            <option key={category.name} value={category.name}>{category.name}</option>
                                        );
                                    })}
                                </select>
                                <Filter size={18} className="text-gray-500" />
                            </div>

                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-1 space-x-reverse transition-colors"
                                onClick={() => setShowAddModal(true)}
                            >
                                <span>زیادکردنی کاڵا</span>
                                <Plus size={18} className='mr-2' />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4 flex gap-2 items-center space-x-4 space-x-reverse">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">کۆی کاڵاکان</p>
                                <p className="text-xl font-bold">{inventoryItems.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 flex gap-2 items-center space-x-4 space-x-reverse">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">بەردەست</p>
                                <p className="text-xl font-bold">
                                    {inventoryItems.filter(item => item.stock > 0).length}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 flex gap-2 items-center space-x-4 space-x-reverse">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">کەم</p>
                                <p className="text-xl font-bold">
                                    {inventoryItems.filter(item => item.stock >= 1 && item.stock < 10).length}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 flex gap-2 items-center space-x-4 space-x-reverse">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">نەماوە</p>
                                <p className="text-xl font-bold">
                                    {inventoryItems.filter(item => item.stock == 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div key={item.product_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                item.stock >= 10 ? 'بەردەست' :
                                                    item.stock <= 1 && item.stock > 10 ? 'کەم' : 'نەماوە')}`}>

                                                {item.stock >= 10 ? 'بەردەست' :
                                                    item.stock <= 1 && item.stock > 10 ? 'کەم' : 'نەماوە'}
                                            </span>
                                        </div>
                                    </div>

                                    {editingItem === item.product_id ? (
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">ناو</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editedValues.name}
                                                        onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">جۆر</label>
                                                        <select
                                                            className="w-full border rounded px-2 py-1 text-sm"
                                                            value={editedValues.category}
                                                            onChange={(e) => setEditedValues({ ...editedValues, category: e.target.value })}
                                                        >
                                                            {categories.map(category => {
                                                                return (
                                                                    <option key={category.category_id} value={category.category_id}>{category.name}</option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">عەدەد</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="w-full border rounded px-2 py-1 text-sm"
                                                            value={editedValues.stock}
                                                            onChange={(e) => setEditedValues({ ...editedValues, stock: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">نرخی کڕاو</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editedValues.cost_price}
                                                        onChange={(e) => setEditedValues({ ...editedValues, cost_price: parseFloat(e.target.value) || 0 })}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">نرخی فرۆشتن</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editedValues.selling_price}
                                                        onChange={(e) => setEditedValues({ ...editedValues, selling_price: parseFloat(e.target.value) || 0 })}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">وێنە</label>
                                                    <div className="flex items-center">
                                                        <label className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded cursor-pointer text-center transition-colors">
                                                            <Camera size={16} className="inline mr-2" />
                                                            <span>هەڵبژاردنی وێنە</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleImageUpload(e, true)}
                                                            />
                                                        </label>
                                                    </div>
                                                    {(imagePreview || editedValues.img) && (
                                                        <div className="mt-2 relative h-16 w-16 rounded overflow-hidden">
                                                            <img
                                                                src={imagePreview || editedValues.img}
                                                                alt="Preview"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2 justify-start space-x-2 space-x-reverse">
                                                <button
                                                    className="p-1 rounded bg-green-500 text-white hover:bg-green-600"
                                                    onClick={saveEditing}
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    onClick={cancelEditing}
                                                >
                                                    <X size={16} />
                                                </button>
                                                <button
                                                    className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                                                    onClick={() => {
                                                        setCurrentBarcode(editedValues.barcode);
                                                        setCurrentItem(editedValues);
                                                        setShowBarcodeModal(true);
                                                    }}
                                                    title="چاپکردنی بارکۆد"
                                                >
                                                    <Barcode size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                                <div className="flex space-x-1 space-x-reverse">
                                                    <button
                                                        className="p-1 rounded hover:bg-gray-100 text-indigo-600"
                                                        onClick={() => startEditing(item)}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1 rounded hover:bg-gray-100 text-red-600"
                                                        onClick={() => deleteItem(item.product_id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-3 flex justify-between items-center">
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {item.category}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setCurrentBarcode(item.barcode);
                                                        setCurrentItem(item);
                                                        setShowBarcodeModal(true);
                                                    }}
                                                    className="text-xs flex items-center text-gray-600 hover:text-blue-600"
                                                >
                                                    <Barcode size={14} className="mr-1" />
                                                    {item.barcode}
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-center text-sm">
                                                <div className="font-medium">نرخی فرۆشتن {item.selling_price} د.ع</div>
                                                <div className="text-gray-500">ژمارە: {item.stock}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                هیچ کاڵایەک نەدۆزرایەوە.
                            </div>
                        )}
                    </div>
                </main>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center rtl:space-x-reverse">
                                    <span>زیادکردنی کاڵای نوێ</span>
                                    <Plus size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={24} className="text-gray-500 dark:text-gray-400" />
                                </button>
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
                                    onClick={() => setShowAddModal(false)}
                                >
                                    پاشگەزبوونەوە
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showBarcodeModal && (
                    <>
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn print:hidden">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">بارکۆد</h3>
                                    <button
                                        onClick={() => setShowBarcodeModal(false)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center p-4">
                                    <div className="text-center mb-4">
                                        <h4 className="font-bold text-lg">{currentItem?.name || 'Item Name'}</h4>
                                        <p className="text-gray-600">
                                            {currentItem?.category}
                                        </p>
                                        <p className="font-medium">{currentItem?.selling_price || '0.00'} د.ع</p>
                                    </div>

                                    <div className="w-full mb-4">
                                        <canvas
                                            id="barcode-canvas"
                                            className="w-full"
                                        />
                                        <p className="text-center font-mono text-lg">{currentBarcode}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button
                                            onClick={downloadBarcode}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                                        >
                                            <Download size={18} />
                                            داگرتنی بارکۆد
                                        </button>
                                        <button
                                            onClick={handlePrintBarcode}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                                        >
                                            <Printer size={18} />
                                            چاپکردن
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="barcode-modal-print" style={{ display: 'none' }}>
                            <div className="text-center mb-4" style={{ borderBottom: '1px dashed #666', paddingBottom: '8px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Your Store Name</h2>
                                <p style={{ fontSize: '12px', marginBottom: '2px' }}>Address Line 1</p>
                                <p style={{ fontSize: '12px' }}>Phone: +964 XXX XXX XXXX</p>
                            </div>

                            <div className="text-center mb-4">
                                <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                                    {currentItem?.name || 'Item Name'}
                                </h4>
                                <p style={{ fontSize: '12px', marginBottom: '2px' }}>
                                    Category: {currentItem?.category}
                                </p>
                                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                    {currentItem?.selling_price || '0.00'} د.ع
                                </p>
                            </div>

                            <div className="text-center mb-4">
                                <canvas
                                    id="barcode-canvas-print"
                                    style={{ width: '60mm', height: '15mm', display: 'block', margin: '8px auto' }}
                                />
                                <p className="font-mono" style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '1px', marginTop: '4px' }}>
                                    {currentBarcode}
                                </p>
                            </div>

                            <div className="text-center" style={{ borderTop: '1px dashed #666', paddingTop: '8px', fontSize: '12px' }}>
                                <p>Thank you for shopping with us!</p>
                                <p>{new Date().toLocaleDateString('en-GB')} - {new Date().toLocaleTimeString('en-GB', { hour12: false })}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}