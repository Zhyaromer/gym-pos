import React, { useState } from 'react';
import { Users, Clock, CheckCircle, Plus, ArrowLeft, Minus, Trash2, ShoppingCart, Eye, Edit2, MapPin, X, CheckIcon } from 'lucide-react';
import Navbar from '../../components/layout/Nav';

const foodImages = {
  appetizers: {
    wings: 'https://tse1.mm.bing.net/th/id/OIP.LJEk4sjCaoF2HH4tcsKAowHaHa?rs=1&pid=ImgDetMain',
    mozzarella: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    nachos: 'https://tse3.mm.bing.net/th/id/OIP.fGaA0ZgsYInmrZwGV5-yLAHaJQ?rs=1&pid=ImgDetMain',
    calamari: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  mains: {
    salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    steak: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    chicken: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    fishchips: 'https://www.thespruceeats.com/thmb/uALIO4N-VCYA5SXIguM_9sJfEnk=/3606x2352/filters:fill(auto,1)/IMG_5442-58b427d35f9b586046d8dfa1.JPG',
    pasta: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  desserts: {
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    tiramisu: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    sundae: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  beverages: {
    cola: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    juice: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    coffee: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    wine: 'https://images.unsplash.com/photo-1568219656418-15c329312bf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  category: {
    appetizers: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    mains: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    desserts: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    beverages: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
};

const TableManager = () => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [currentView, setCurrentView] = useState('floors');
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('appetizers');
  const [cart, setCart] = useState([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingCartItemIndex, setEditingCartItemIndex] = useState(null);
  const [itemNote, setItemNote] = useState('');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reservationTime, setReservationTime] = useState('');
  const [tableToReserve, setTableToReserve] = useState(null);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tempTableId, setTempTableId] = useState(null);

  const [foodCategories] = useState({
    appetizers: [
      { id: 1, name: 'Buffalo Wings', price: 12.99, description: 'Spicy chicken wings with ranch dip', image: foodImages.appetizers.wings },
      { id: 2, name: 'Mozzarella Sticks', price: 9.99, description: 'Crispy cheese sticks with marinara sauce', image: foodImages.appetizers.mozzarella },
      { id: 3, name: 'Loaded Nachos', price: 14.99, description: 'Tortilla chips with cheese, jalapeños, and sour cream', image: foodImages.appetizers.nachos },
      { id: 4, name: 'Calamari Rings', price: 13.99, description: 'Golden fried squid rings with aioli', image: foodImages.appetizers.calamari },
    ],
    mains: [
      { id: 5, name: 'Grilled Salmon', price: 24.99, description: 'Fresh Atlantic salmon with lemon butter', image: foodImages.mains.salmon },
      { id: 6, name: 'Ribeye Steak', price: 32.99, description: '12oz premium cut with garlic mashed potatoes', image: foodImages.mains.steak },
      { id: 7, name: 'Chicken Parmesan', price: 19.99, description: 'Breaded chicken breast with marinara and mozzarella', image: foodImages.mains.chicken },
      { id: 8, name: 'Fish & Chips', price: 17.99, description: 'Beer-battered cod with fries and mushy peas', image: foodImages.mains.fishchips },
      { id: 9, name: 'Pasta Carbonara', price: 16.99, description: 'Creamy pasta with bacon and parmesan', image: foodImages.mains.pasta },
    ],
    desserts: [
      { id: 10, name: 'Chocolate Cake', price: 7.99, description: 'Rich chocolate layer cake with ganache', image: foodImages.desserts.cake },
      { id: 11, name: 'Tiramisu', price: 8.99, description: 'Classic Italian coffee-flavored dessert', image: foodImages.desserts.tiramisu },
      { id: 12, name: 'Ice Cream Sundae', price: 6.99, description: 'Vanilla ice cream with chocolate sauce and nuts', image: foodImages.desserts.sundae },
    ],
    beverages: [
      { id: 13, name: 'Coca Cola', price: 2.99, description: 'Classic cola soft drink', image: foodImages.beverages.cola },
      { id: 14, name: 'Fresh Orange Juice', price: 4.99, description: 'Freshly squeezed orange juice', image: foodImages.beverages.juice },
      { id: 15, name: 'Coffee', price: 3.99, description: 'Premium roasted coffee', image: foodImages.beverages.coffee },
      { id: 16, name: 'Wine - House Red', price: 8.99, description: 'Glass of house red wine', image: foodImages.beverages.wine },
    ]
  });

  const [tables, setTables] = useState({
    firstFloor: [
      { id: 1, number: 'T1', status: 'بەردەست', seats: 4, order: [] },
      { id: 2, number: 'T2', status: 'گیراو', seats: 2, employee: 'هالان دیاری', order: [{ id: 1, name: 'Buffalo Wings', price: 12.99, quantity: 1, note: '', image: foodImages.appetizers.wings }] },
      { id: 3, number: 'T3', status: 'حیجزکراو', seats: 6, حیجزکراوTime: '2025-06-10T19:00', order: [] },
      { id: 4, number: 'T4', status: 'بەردەست', seats: 4, order: [] },
      { id: 5, number: 'T5', status: 'تەواوبوون', seats: 8, employee: 'ئەحمەد ئەردەلان', order: [{ id: 6, name: 'Ribeye Steak', price: 32.99, quantity: 2, note: 'medium rare', image: foodImages.mains.steak }, { id: 13, name: 'Coca Cola', price: 2.99, quantity: 2, note: '', image: foodImages.beverages.cola }] },
      { id: 6, number: 'T6', status: 'بەردەست', seats: 2, order: [] },
      { id: 7, number: 'T7', status: 'حیجزکراو', seats: 4, حیجزکراوTime: '2025-06-10T20:30', order: [] },
      { id: 8, number: 'T8', status: 'بەردەست', seats: 6, order: [] },
    ],
    secondFloor: [
      { id: 9, number: 'T9', status: 'بەردەست', seats: 4, order: [] },
      { id: 10, number: 'T10', status: 'گیراو', seats: 2, employee: 'ژیار عومەر', order: [{ id: 15, name: 'Coffee', price: 3.99, quantity: 1, note: 'with milk', image: foodImages.beverages.coffee }] },
      { id: 11, number: 'T11', status: 'بەردەست', seats: 6, order: [] },
      { id: 12, number: 'T12', status: 'حیجزکراو', seats: 4, حیجزکراوTime: '2025-06-10T18:15', order: [] },
      { id: 13, number: 'T13', status: 'بەردەست', seats: 8, order: [] },
      { id: 14, number: 'T14', status: 'گیراو', seats: 2, employee: 'دیاکۆ سۆران', order: [] },
    ]
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'بەردەست':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'گیراو':
        return <Users className="w-5 h-5 text-red-600" />;
      case 'حیجزکراو':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'تێکەڵ':
        return <Plus className="w-5 h-5 text-purple-600" />;
      case 'تەواوبوون':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleTableSelect = (tableId) => {
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };

  const handleMergeTables = () => {
    if (selectedTables.length < 2) {
      alert('Please select at least 2 tables to merge');
      return;
    }

    const allTables = [...tables.firstFloor, ...tables.secondFloor];
    const selectedTableObjects = allTables.filter(table => selectedTables.includes(table.id));
    const allبەردەست = selectedTableObjects.every(table => table.status === 'بەردەست');

    if (!allبەردەست) {
      alert('Can only merge بەردەست tables');
      return;
    }

    const totalSeats = selectedTableObjects.reduce((sum, table) => sum + table.seats, 0);
    const tableNumbers = selectedTableObjects.map(t => t.number).join('+');
    const تێکەڵTable = {
      id: Date.now(),
      number: tableNumbers,
      status: 'تێکەڵ',
      seats: totalSeats,
      تێکەڵTables: selectedTableObjects.map(t => ({ id: t.id, number: t.number })),
      order: []
    };

    setTables(prev => {
      const newTables = { ...prev };
      newTables.firstFloor = newTables.firstFloor.filter(table => !selectedTables.includes(table.id));
      newTables.secondFloor = newTables.secondFloor.filter(table => !selectedTables.includes(table.id));
      newTables.firstFloor.push(تێکەڵTable);
      return newTables;
    });

    setSelectedTables([]);
  };

  const handleOccupyTable = (tableId) => {
    setTables(prev => {
      const newTables = { ...prev };
      for (const floor in newTables) {
        newTables[floor] = newTables[floor].map(table =>
          table.id === tableId ? { ...table, status: 'گیراو', employee: 'Assigned Server' } : table
        );
      }
      return newTables;
    });
  };

  const handleReserveTableClick = (tableId) => {
    const table = getAllTables().find(t => t.id === tableId);
    setTableToReserve(table);
    setReservationTime(table.حیجزکراوTime || '');
    setReserveModalOpen(true);
  };

  const handleConfirmReservation = () => {
    if (!reservationTime) {
      alert('Please select a reservation time.');
      return;
    }

    const newReservationDateTime = new Date(reservationTime);
    const currentDateTime = new Date();

    // Check if the reservation time is in the future
    if (newReservationDateTime <= currentDateTime) {
      alert('Reservation time must be in the future.');
      return;
    }

    const reservationDurationMinutes = 90; // Assume 1.5 hours for a reservation slot

    const conflictFound = getAllTables().some(table => {
      if (table.status === 'حیجزکراو' && table.id !== tableToReserve.id && table.حیجزکراوTime) {
        const existingReservationDateTime = new Date(table.حیجزکراوTime);
        const existingReservationEnd = new Date(existingReservationDateTime.getTime() + reservationDurationMinutes * 60 * 1000);
        const newReservationEnd = new Date(newReservationDateTime.getTime() + reservationDurationMinutes * 60 * 1000);

        if (newReservationDateTime < existingReservationEnd && newReservationEnd > existingReservationDateTime) {
          return true;
        }
      }
      return false;
    });

    if (conflictFound) {
      alert('This time slot conflicts with another حیجزکراو table. Please choose a different time.');
      return;
    }

    setTables(prev => {
      const newTables = { ...prev };
      for (const floor in newTables) {
        newTables[floor] = newTables[floor].map(table =>
          table.id === tableToReserve.id
            ? { ...table, status: 'حیجزکراو', حیجزکراوTime: reservationTime }
            : table
        );
      }
      return newTables;
    });
    setReserveModalOpen(false);
    setTableToReserve(null);
    setReservationTime('');
  };

  const handleTakeOrder = (tableId) => {
    const table = getAllTables().find(t => t.id === tableId);
    setCurrentTable(table);
    setCart(table.order || []); // Load existing order into cart
    setShowCheckout(true);
  };

  const addToCart = (item) => {
    setCart(prev => {
      // Find if an item with the same ID and no specific note already exists
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id && !cartItem.note);

      if (existingItemIndex > -1) {
        // If it exists and has no specific note, increment its quantity
        return prev.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      // Otherwise, add the new item (initially without a note)
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
  };


  const handleOpenNoteModal = (item, index) => {
    setEditingCartItemIndex(index);
    setItemNote(item.note || '');
    setNoteModalOpen(true);
  };

  const handleSaveItemNote = () => {
    setCart(prev => prev.map((item, idx) =>
      idx === editingCartItemIndex ? { ...item, note: itemNote } : item
    ));
    setNoteModalOpen(false);
    setEditingCartItemIndex(null);
    setItemNote('');
  };

  const updateQuantity = (itemIndex, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter((_, idx) => idx !== itemIndex));
    } else {
      setCart(prev =>
        prev.map((item, idx) =>
          idx === itemIndex ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemIndex) => {
    setCart(prev => prev.filter((_, idx) => idx !== itemIndex));
  };

  const getCartTotal = (items = cart) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = () => {
    setTables(prev => {
      const newTables = { ...prev };
      for (const floor in newTables) {
        newTables[floor] = newTables[floor].map(table =>
          table.id === currentTable.id
            ? { ...table, status: 'گیراو', order: cart }
            : table
        );
      }
      return newTables;
    });

    alert(`Order placed for ${currentTable.number}!\nTotal: ${getCartTotal().toFixed(3)}`);
    setCart([]);
    setShowCheckout(false);
    setCurrentTable(null);
  };

  const handleFinishTable = (tableId) => {
    setTables(prev => {
      const newTables = { ...prev };
      for (const floor in newTables) {
        newTables[floor] = newTables[floor].map(table =>
          table.id === tableId ? { ...table, status: 'تەواوبوون' } : table
        );
      }
      return newTables;
    });
  };

  const handleCheckoutTable = (tableId) => {
    const table = getAllTables().find(t => t.id === tableId);
    const total = table?.order?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const finalAmount = total - discountAmount;

    alert(`Table ${table?.number} checked out. Total: ${total.toFixed(3)}, Discount: ${discountAmount.toFixed(3)}, Final: ${finalAmount.toFixed(3)}`);

    setTables(prev => {
      const newTables = { ...prev };
      for (const floor in newTables) {
        newTables[floor] = newTables[floor].map(t =>
          t.id === tableId ? { ...t, status: 'بەردەست', employee: undefined, order: [] } : t
        );
      }
      return newTables;
    });

    setShowCheckout(false);
    setCurrentTable(null);
    setCart([]);
  };

  const handleViewOrder = (tableId) => {
    const table = getAllTables().find(t => t.id === tableId);
    setCurrentTable(table);
    setShowOrderDetailsModal(true);
  };

  const handleGuestArrived = (tableId) => {
    setTables(prev => {
      const newTables = { ...prev };
      for (const floor in newTables) {
        newTables[floor] = newTables[floor].map(table =>
          table.id === tableId ? { ...table, status: 'گیراو', حیجزکراوTime: undefined } : table
        );
      }
      return newTables;
    });
  };

  const getAllTables = () => {
    return [...tables.firstFloor, ...tables.secondFloor];
  };

  const getTablesByStatus = (status) => {
    const allTables = getAllTables();
    if (status === 'بەردەست') {
      return allTables.filter(table => table.status === 'بەردەست');
    }
    if (status === 'گیراو') {
      return allTables.filter(table => table.status === 'گیراو' || table.status === 'تەواوبوون');
    }
    return allTables.filter(table => table.status === status);
  };


  const TableCard = ({ table, floor, showFloorInfo = false }) => {
    const isSelected = selectedTables.includes(table.id);
    const canSelect = currentView === 'floors' && table.status === 'بەردەست';

    const statusColors = {
      بەردەست: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      گیراو: 'bg-red-100 text-red-800 border-red-200',
      حیجزکراو: 'bg-amber-100 text-amber-800 border-amber-200',
      تێکەڵ: 'bg-purple-100 text-purple-800 border-purple-200',
      تەواوبوون: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <div
        dir='rtl'
        onClick={() => canSelect && handleTableSelect(table.id)}
        className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${canSelect ? 'cursor-pointer' : 'cursor-default'}
        ${statusColors[table.status] || 'bg-gray-50'}
        ${isSelected ? 'ring-2 ring-blue-400 border-blue-400 shadow-md' : ''}
        ${canSelect ? 'transform hover:scale-[1.02] hover:shadow-md' : ''}
        flex flex-col h-full
        bg-white shadow-sm
      `}
      >
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-10">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800">مێزی {table.number}</h3>
          </div>
          <div className="mb-3">
            <span className={`inline-flex px-2 py-1 gap-2 rounded-full text-xs font-medium ${statusColors[table.status]}`}>
              {getStatusText(table.status)}
              {getStatusIcon(table.status)}
            </span>
          </div>
        </div>

        <div className="mb-3 space-y-1 text-sm">
          {showFloorInfo && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{tables.firstFloor.find(t => t.id === table.id) ? '1F' : '2F'}</span>
            </div>
          )}

          {table.employee && (
            <div className="flex items-center text-gray-600 truncate">
              <Users className="w-3 h-3 ml-1" />
              <span>شاگرد : {table.employee}</span>
            </div>
          )}

          {table.status === 'حیجزکراو' && table.حیجزکراوTime && (
            <div dir='ltr' className="flex items-center text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>{new Date(table.حیجزکراوTime).toLocaleTimeString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          {table.status === 'تێکەڵ' && table.تێکەڵTables && (
            <div className="flex items-center text-xs text-gray-500">
              <Merge className="w-3 h-3 mr-1" />
              <span>تێکەڵ: {table.تێکەڵTables.map(t => t.number).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {table.status === 'بەردەست' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOccupyTable(table.id);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                >
                  بیگرە
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReserveTableClick(table.id);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-xs font-medium"
                >
                  حیجزی کە
                </button>
              </>
            )}

            {table.status === 'گیراو' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFinishTable(table.id);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                >
                  هێنانی حساب
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTakeOrder(table.id);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                >
                  داواکردن
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOrder(table.id);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-xs font-medium flex items-center justify-center"
                >
                  زانیاری
                  <Eye className="w-3 h-3 mr-1" />
                </button>
              </>
            )}

            {table.status === 'حیجزکراو' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGuestArrived(table.id);
                }}
                className="flex-1 min-w-[80px] px-2 py-1.5 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors text-xs font-medium"
              >
                کاتی حیجزەکە
              </button>
            )}

            {table.status === 'تەواوبوون' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempTableId(table.id);
                    setShowCheckoutModal(true);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                >
                  واسڵ کردنی پارەکە
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOrder(table.id);
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-xs font-medium flex items-center justify-center"
                >
                  زانیاری
                  <Eye className="w-3 h-3 mr-1" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FloorSection = ({ title, tables, floor }) => (
    <div dir='rtl' className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          {title}
          <span className="ml-3 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
            {tables.length} مێز
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map(table => (
          <TableCard key={table.id} table={table} floor={floor} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Navbar/>
      <div dir='rtl' className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {showCheckout ? (
          // Checkout Page - Full Screen
          <div className="flex h-screen w-screen">
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ئۆردەری مێزی {currentTable?.number}</h1>
                  <p className="text-gray-600 mt-2">شاگرد : {currentTable?.employee}</p>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="mr-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Category Tabs with Images */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(foodCategories).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        relative overflow-hidden rounded-lg h-32 flex items-end 
                        transition-all duration-300 transform hover:scale-105
                        ${selectedCategory === category ? 'ring-4 ring-blue-500' : ''}
                      `}
                    >
                      <img
                        src={foodImages.category[category]}
                        alt={category}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative z-10 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-white font-bold capitalize text-lg">
                          {category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foodCategories[selectedCategory].map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <span className="text-2xl font-bold text-blue-600">{item.price}د.ع</span>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        زیادکردن بۆ داواکردن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/3 bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">کورتەی داواکاری</h2>
                <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>هیچ خواردنێک داوا نەکراوە</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${item.note}-${index}`} className="bg-gray-50 rounded-lg p-4 flex gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            {item.note ? (
                              <p className="text-sm text-gray-500 italic flex items-center">
                                تێبینی: {item.note}
                                <button onClick={() => handleOpenNoteModal(item, index)} className="ml-2 text-blue-500 hover:text-blue-700">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </p>
                            ) : (
                              <button
                                onClick={() => handleOpenNoteModal(item, index)}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                زیادکردنی تێبینی
                                <Edit2 className="w-3 h-3 mr-1" />
                              </button>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="font-bold text-blue-600">
                              {(item.price * item.quantity).toFixed(2)}د.ع
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">کۆی گشتی:</span>
                      <span className="font-semibold">{getCartTotal().toFixed(2)}د.ع</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">سێرڤس:</span>
                      <span className="font-semibold">{(getCartTotal() * 0.085).toFixed(2)}د.ع</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                      <span>حسابی کۆتایی:</span>
                      <span className="text-blue-600">{(getCartTotal() * 1.085).toFixed(2)}د.ع</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
                  >
                    داواکردنی خواردن
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 w-screen h-screen overflow-y-auto">
            <div className="max-w-full mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">بەڕێوەبردنی مێز</h1>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setCurrentView('floors')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'floors'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    هەمووی
                  </button>
                  <button
                    onClick={() => setCurrentView('بەردەست')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'بەردەست'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    بەردەست ({getTablesByStatus('بەردەست').length})
                  </button>
                  <button
                    onClick={() => setCurrentView('گیراو')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'گیراو'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    گیراو ({getTablesByStatus('گیراو').length})
                  </button>
                  <button
                    onClick={() => setCurrentView('حیجزکراو')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'حیجزکراو'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    حیجزکراو ({getTablesByStatus('حیجزکراو').length})
                  </button>
                  <button
                    onClick={() => setCurrentView('تێکەڵ')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'تێکەڵ'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    تێکەڵ ({getTablesByStatus('تێکەڵ').length})
                  </button>
                  <button
                    onClick={() => setCurrentView('تەواوبوون')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentView === 'تەواوبوون'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    تەواوبوو ({getTablesByStatus('تەواوبوون').length})
                  </button>
                </div>
              </div>

              {/* Merge Controls */}
              {currentView === 'floors' && selectedTables.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {selectedTables.length} table{selectedTables.length > 1 ? 's' : ''} selected
                      </h3>
                      <p className="text-gray-600 text-sm">Select multiple بەردەست tables to merge them</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedTables([])}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Clear Selection
                      </button>
                      <button
                        onClick={handleMergeTables}
                        disabled={selectedTables.length < 2}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Merge Tables
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content based on current view */}
              {currentView === 'floors' && (
                <>
                  <FloorSection
                    title="قاتی یەکەم"
                    tables={tables.firstFloor}
                    floor="first"
                  />

                  <FloorSection
                    title="قاتی دووەم"
                    tables={tables.secondFloor}
                    floor="second"
                  />
                </>
              )}

              {currentView !== 'floors' && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    {currentView.charAt(0).toUpperCase() + currentView.slice(1)} مێز
                    <span className="ml-3 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                      {getTablesByStatus(currentView).length} مێز
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getTablesByStatus(currentView).map(table => (
                      <TableCard key={table.id} table={table} showFloorInfo={true} />
                    ))}
                    {getTablesByStatus(currentView).length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        هیچ {currentView} مێزێک نەدۆزرایەوە
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Note Modal */}
        {noteModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">زیادکردنی تێبینی</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-200 focus:border-blue-500"
                rows="4"
                placeholder="e.g., No onions, extra cheese, well done..."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setNoteModalOpen(false); setEditingCartItemIndex(null); setItemNote(''); }}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  onClick={handleSaveItemNote}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  تۆمارکردنی تێبینی
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetailsModal && currentTable && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">ئۆردەری مێزی {currentTable.number}</h3>
                <button
                  onClick={() => setShowOrderDetailsModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {currentTable.order && currentTable.order.length > 0 ? (
                <>
                  <div className="overflow-y-auto flex-grow mb-4">
                    {currentTable.order.map((item, index) => (
                      <div key={`${item.id}-${item.note}-${index}`} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 mr-2">{item.name} ( {item.quantity} دانە)</p>
                            {item.note && (
                              <p className="text-sm text-gray-500 italic mr-2">تێبینی : {item.note}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">کۆی گشتی :</span>
                      <span className="font-semibold">${getCartTotal(currentTable.order).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">سێرڤس :</span>
                      <span className="font-semibold">${(getCartTotal(currentTable.order) * 0.085).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                      <span>حسابی کۆتایی :</span>
                      <span className="text-blue-600">${(getCartTotal(currentTable.order) * 1.085).toFixed(3)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No items ordered for this table yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reserve Table Modal */}
        {reserveModalOpen && tableToReserve && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">حیجزکردنی مێزی {tableToReserve.number}</h3>
              <label htmlFor="reservation-time" className="block text-gray-700 text-sm font-bold mb-2">
                کاتی حیجزکردن :
              </label>
              <input
                type="datetime-local"
                id="reservation-time"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setReserveModalOpen(false); setTableToReserve(null); setReservationTime(''); }}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  پەشیمان بوونەوە
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  حیجزکردن
                </button>
              </div>
            </div>
          </div>
        )}

        {
          showCheckoutModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      🧾
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">پاشکەوتکردنی داواکاری</h3>
                      <p className="text-indigo-100 text-lg">مێزی ژمارە {tempTableId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setDiscountAmount(0);
                    }}
                    className="cursor-pointer p-2 hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white hover:text-gray-200" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      داواکارییەکان
                    </h4>
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {getAllTables()
                        .find(t => t.id === tempTableId)
                        ?.order?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                {item.quantity}
                              </div>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg border"
                              />
                              <span className="font-medium text-gray-800">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()} د.ع</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3 text-gray-600">
                      <span>کۆی گشتی:</span>
                      <span className="font-semibold">
                        {getAllTables().find(t => t.id === tempTableId)?.order?.reduce(
                          (sum, item) => sum + (item.price * item.quantity), 0
                        ).toLocaleString()} د.ع
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600">%</span>
                        <label className="font-medium text-orange-800">داشکاندن:</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                          className="border border-orange-300 rounded-lg px-3 py-2 w-24 text-right bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="0"
                        />
                        <span className="text-orange-800 font-medium">د.ع</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <span className="font-bold text-green-800 text-lg">کۆی گشتی دوای داشکاندن:</span>
                      <span className="font-bold text-green-900 text-xl">
                        {(getAllTables().find(t => t.id === tempTableId)?.order?.reduce(
                          (sum, item) => sum + (item.price * item.quantity), 0
                        ) - discountAmount).toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setDiscountAmount(0);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    پاشگەزبوونەوە
                  </button>
                  <button
                    onClick={() => {
                      handleCheckoutTable(tempTableId);
                      setShowCheckoutModal(false);
                      setDiscountAmount(0);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  >
                    واسڵ کردنی داواکاری
                    <CheckIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TableManager;