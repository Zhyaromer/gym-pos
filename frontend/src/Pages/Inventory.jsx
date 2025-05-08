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
    Dumbbell,
    ShoppingBag,
    Bell,
    Save,
    X,
    Camera,
    Barcode,
    Download,
    Printer,
    RefreshCw
} from 'lucide-react';
import { toPng } from 'html-to-image';
import jsbarcode from 'jsbarcode';
import QRCode from 'qrcode';

export default function Inventory() {
    // State for inventory items
    const [inventoryItems, setInventoryItems] = useState([
        {
            id: 1,
            name: 'Dumbbells (5kg)',
            category: 'Weights',
            quantity: 20,
            price: 25,
            status: 'In Stock',
            image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'WT001234567890'
        },
        {
            id: 2,
            name: 'Yoga Mats',
            category: 'Accessories',
            quantity: 15,
            price: 30,
            status: 'In Stock',
            image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'AC002345678901'
        },
        {
            id: 3,
            name: 'Protein Powder',
            category: 'Supplements',
            quantity: 8,
            price: 45,
            status: 'Low Stock',
            image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'SP003456789012'
        },
        {
            id: 4,
            name: 'Treadmill',
            category: 'Equipment',
            quantity: 2,
            price: 1200,
            status: 'In Stock',
            image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'EQ004567890123'
        },
        {
            id: 5,
            name: 'Resistance Bands',
            category: 'Accessories',
            quantity: 25,
            price: 15,
            status: 'In Stock',
            image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'AC005678901234'
        },
        {
            id: 6,
            name: 'Pre-Workout',
            category: 'Supplements',
            quantity: 5,
            price: 35,
            status: 'Low Stock',
            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'SP006789012345'
        },
        {
            id: 7,
            name: 'Kettlebells',
            category: 'Weights',
            quantity: 12,
            price: 40,
            status: 'In Stock',
            image: 'https://images.unsplash.com/photo-1603455778956-d71832eafa4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'WT007890123456'
        },
        {
            id: 8,
            name: 'Gym Towels',
            category: 'Accessories',
            quantity: 0,
            price: 10,
            status: 'Out of Stock',
            image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            barcode: 'AC008901234567'
        },
    ]);

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        image: '',
        barcode: ''
    });

    // State for editing
    const [editingItem, setEditingItem] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    // State for barcode modal
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [currentBarcode, setCurrentBarcode] = useState('');
    const [currentItem, setCurrentItem] = useState(null);

    // Categories for filtering
    const categories = ['All', 'Weights', 'Equipment', 'Accessories', 'Supplements'];

    // Filter items based on search term and category
    const filteredItems = inventoryItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Generate a 12-character barcode
    const generateBarcode = () => {
        const categoryPrefix = {
            'Weights': 'WT',
            'Equipment': 'EQ',
            'Accessories': 'AC',
            'Supplements': 'SP'
        }[newItem.category] || 'IT';
        
        // Generate 10 random digits (12 total with prefix)
        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
        return `${categoryPrefix}${randomDigits}`;
    };

    // Handle file upload
    const handleImageUpload = (e, isEditing = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEditing) {
                    setEditedValues({ ...editedValues, image: reader.result });
                } else {
                    setNewItem({ ...newItem, image: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle adding new item
    const handleAddItem = () => {
        if (newItem.name && newItem.category && newItem.quantity >= 0 && newItem.price >= 0) {
            const status = newItem.quantity === 0 ? 'Out of Stock' :
                newItem.quantity <= 5 ? 'Low Stock' : 'In Stock';

            // If no image is provided, use a placeholder
            const image = newItem.image || 'https://via.placeholder.com/150?text=No+Image';
            
            // Generate barcode if not provided
            const barcode = newItem.barcode || generateBarcode();

            const newItemWithBarcode = {
                id: inventoryItems.length + 1,
                ...newItem,
                image,
                status,
                barcode
            };

            setInventoryItems([...inventoryItems, newItemWithBarcode]);
            
            // Show barcode modal after adding
            setCurrentBarcode(barcode);
            setCurrentItem(newItemWithBarcode);
            setShowBarcodeModal(true);
            
            // Reset form
            setNewItem({
                name: '',
                category: '',
                quantity: 0,
                price: 0,
                image: '',
                barcode: ''
            });
            setShowAddModal(false);
        }
    };

    // Start editing an item
    const startEditing = (item) => {
        setEditingItem(item.id);
        setEditedValues({ ...item });
    };

    // Save edited item
    const saveEditing = () => {
        if (editedValues.name && editedValues.category && editedValues.quantity >= 0 && editedValues.price >= 0) {
            const status = editedValues.quantity === 0 ? 'Out of Stock' :
                editedValues.quantity <= 5 ? 'Low Stock' : 'In Stock';

            setInventoryItems(inventoryItems.map(item =>
                item.id === editingItem ? { ...editedValues, status } : item
            ));
            setEditingItem(null);
        }
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingItem(null);
    };

    // Delete an item
    const deleteItem = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setInventoryItems(inventoryItems.filter(item => item.id !== id));
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Stock': return 'text-green-600 bg-green-100';
            case 'Low Stock': return 'text-amber-600 bg-amber-100';
            case 'Out of Stock': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Initialize barcode when modal opens
    useEffect(() => {
        if (showBarcodeModal && currentBarcode) {
            // Generate barcode
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

    // Download barcode as image
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
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
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
                                {categories.map(category => {
                                    const categoryTranslations = {
                                        'All': 'هەموو',
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
                            <Filter size={18} className="text-gray-500" />
                        </div>

                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-1 space-x-reverse transition-colors"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={18} />
                            <span>زیادکردنی کاڵا</span>
                        </button>
                    </div>
                </div>

                {/* Inventory Stats */}
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
                                {inventoryItems.filter(item => item.status === 'In Stock').length}
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
                                {inventoryItems.filter(item => item.status === 'Low Stock').length}
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
                                {inventoryItems.filter(item => item.status === 'Out of Stock').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Inventory Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Card Image */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                            {item.status === 'In Stock' ? 'بەردەست' :
                                                item.status === 'Low Stock' ? 'کەم' : 'نەماوە'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                {editingItem === item.id ? (
                                    // Editing Mode
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
                                                        {categories.filter(cat => cat !== 'All').map(category => {
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
                                                    <label className="block text-xs text-gray-500 mb-1">ژمارە</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editedValues.quantity}
                                                        onChange={(e) => setEditedValues({ ...editedValues, quantity: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">نرخ ($)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full border rounded px-2 py-1 text-sm"
                                                    value={editedValues.price}
                                                    onChange={(e) => setEditedValues({ ...editedValues, price: parseFloat(e.target.value) || 0 })}
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
                                                {editedValues.image && (
                                                    <div className="mt-2 relative h-16 w-16 rounded overflow-hidden">
                                                        <img
                                                            src={editedValues.image}
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
                                    // View Mode
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
                                                    onClick={() => deleteItem(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3 flex justify-between items-center">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {item.category === 'Weights' ? 'قورسایی' :
                                                    item.category === 'Equipment' ? 'ئامێر' :
                                                        item.category === 'Accessories' ? 'کەرەستە' :
                                                            item.category === 'Supplements' ? 'تەواوکەر' : item.category}
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
                                            <div className="font-medium">${item.price.toFixed(2)}</div>
                                            <div className="text-gray-500">ژمارە: {item.quantity}</div>
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

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center rtl:space-x-reverse">
                                <Plus size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
                                <span>زیادکردنی کاڵای نوێ</span>
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Close"
                            >
                                <X size={24} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">
                            {/* Name */}
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

                            {/* Category */}
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
                                        {categories.filter(cat => cat !== 'All').map(category => {
                                            const categoryTranslations = {
                                                'Weights': 'قورسایی',
                                                'Equipment': 'ئامێر',
                                                'Accessories': 'کەرەستە',
                                                'Supplements': 'تەواوکەر'
                                            };
                                            return (
                                                <option key={category} value={category}>
                                                    {categoryTranslations[category] || category}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <span className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pl-3 flex items-center pointer-events-none">
                                        <ChevronDown size={18} className="text-gray-400" />
                                    </span>
                                </div>
                            </div>

                            {/* Barcode */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                    بارکۆد (بەخۆڕایی دروست دەکرێت)
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                        <Barcode size={18} className="text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all placeholder:text-gray-400 rtl:text-right"
                                        placeholder="بارکۆد"
                                        value={newItem.barcode}
                                        onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
                                    />
                                    <button 
                                        onClick={() => setNewItem({ ...newItem, barcode: generateBarcode() })}
                                        className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pl-3 flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                    وێنە
                                </label>
                                <div className="mt-1">
                                    {!newItem.image ? (
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
                                                src={newItem.image}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <button
                                                    onClick={() => setNewItem({ ...newItem, image: null })}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price and Quantity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                        ژمارە
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                            <Package size={18} className="text-gray-400" />
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all rtl:text-right"
                                            value={newItem.quantity}
                                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
                                        نرخ ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                            <DollarSign size={18} className="text-gray-400" />
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all rtl:text-right"
                                            value={newItem.price}
                                            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-2 justify-start space-x-3 rtl:space-x-reverse">
                            <button
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium
                    hover:bg-blue-700 transition-colors shadow-sm 
                    disabled:bg-blue-400 disabled:cursor-not-allowed"
                                onClick={handleAddItem}
                                disabled={!newItem.name || !newItem.category}
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

            {/* Barcode Modal */}
            {showBarcodeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md print:p-0 print:shadow-none print:bg-transparent print:w-auto">
                        <div className="flex justify-between items-center mb-4 print:hidden">
                            <h3 className="text-xl font-bold">بارکۆد</h3>
                            <button 
                                onClick={() => setShowBarcodeModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 print:p-2">
                            {/* Item Info */}
                            <div className="text-center mb-4 print:mb-2">
                                <h4 className="font-bold text-lg print:text-sm">{currentItem?.name || 'Item Name'}</h4>
                                <p className="text-gray-600 print:text-xs">
                                    {currentItem?.category === 'Weights' ? 'قورسایی' :
                                     currentItem?.category === 'Equipment' ? 'ئامێر' :
                                     currentItem?.category === 'Accessories' ? 'کەرەستە' :
                                     currentItem?.category === 'Supplements' ? 'تەواوکەر' : currentItem?.category || 'Category'}
                                </p>
                                <p className="font-medium print:text-xs">${currentItem?.price?.toFixed(2) || '0.00'}</p>
                            </div>
                            
                            {/* Barcode Section */}
                            <div className="w-full mb-4 print:mb-2">
                                <canvas 
                                    id="barcode-canvas" 
                                    className="w-full print:w-64 print:h-16"
                                />
                                <p className="text-center font-mono text-lg print:text-sm">{currentBarcode}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-center print:hidden">
                                <button
                                    onClick={downloadBarcode}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                                >
                                    <Download size={18} />
                                    داگرتنی بارکۆد
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                                >
                                    <Printer size={18} />
                                    چاپکردن
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}