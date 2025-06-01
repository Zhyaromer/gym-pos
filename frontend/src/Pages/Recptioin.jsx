import React, { useState, useRef, forwardRef, useEffect } from 'react';
import {
  Search, Download, Calendar, User, Package,
  Trash2, Edit, Plus, Save, X, Percent,
  DollarSign
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import Navbar from '../components/layout/Nav';
import axios from 'axios';

const Receipt = forwardRef(({
  orderNumber,
  items,
  subtotal,
  discount,
  total,
  payment,
  change,
  date,
  cashierName
}, ref) => {
  const handleDownload = async () => {
    try {
      const receiptContent = `
      Receipt #${orderNumber}
      Date: ${new Date(date).toLocaleString()}
      Items: ${items.length}
      Total: ${Number(total)} د.ع
            `;

      console.log(discount);

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${orderNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div
        ref={ref}
        className="w-80 min-h-96 p-4 bg-white text-black mx-auto border border-gray-200 rounded font-mono text-sm"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        <div dir="rtl" className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">دوکانی جیم</h2>
          <p className="text-xs text-gray-600 mb-1">هەولێر، کەسی ڕێگای 60 مەتری</p>
          <p className="text-xs text-gray-600 mb-1">تەلەفۆن: 0750 123 4567</p>

          <div className="border-t border-b border-dashed border-gray-300 py-2 my-3">
            <p className="text-sm font-bold mb-1">ژمارەی داواکاری: {orderNumber} </p>
            <p className="text-xs">{new Date(date).toLocaleString()}</p>
            <p className="text-xs">Cashier: {cashierName}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between py-1 border-b border-dashed border-gray-200 font-bold text-xs">
            <span className="w-2/5">بەرهەم</span>
            <span className="w-1/5 text-center">دانە</span>
            <span className="w-2/5 text-center">نرخ</span>
          </div>

          {items?.map(item => (
            <div key={item.product_id} className="flex justify-between py-2 border-b border-dashed border-gray-200 text-xs">
              <span className="w-2/5">{item.name}</span>
              <span className="w-1/5 text-center">{item.quantity}</span>
              <span className="w-2/5 text-center">{item.selling_price} د.ع</span>
            </div>
          ))}
        </div>

        <div className="border-t border-b border-dashed border-gray-300 py-3 my-4">
          <div className="flex justify-between mb-2">
            <span>کۆی گشتی :</span>
            <span>{Number(subtotal).toFixed(3)} د.ع</span>
          </div>

          {discount?.discount_value !== 0.000 && (
            <div className="flex justify-between mb-2">
              <span>داشکاندن :</span>
              <p>{discount.discount_type == 'percentage' ? `${Number(discount.discount_value)}%` : `${(discount.discount_value).toFixed(3)} د.ع`} </p>
            </div>
          )}

          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed border-gray-300">
            <span>کۆی کۆتایی</span>
            <span>{Number(total).toFixed(3)} د.ع</span>
          </div>
        </div>

        <div className="text-center mt-4 pt-2 border-t border-dashed border-gray-300">
          <p className="text-xs font-bold mb-1">سوپاس بۆ داواکاریەکەت!</p>
          <p className="text-xs text-gray-600 mb-1">بەهیوای بینینت دووبارە</p>
          <p className="text-xs text-gray-500">www.jimstore.com</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center justify-center mx-auto mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors shadow-sm"
      >
        داگرتنی پێداچوونەوە
        <Download className="w-4 h-4 mr-2" />
      </button>
    </div>
  );
});

const ItemModal = ({ isOpen, onClose, item, onSave, mode }) => {
  const [formData, setFormData] = useState({
    barcode: item?.barcode || '',
    quantity: item?.quantity || 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [productInfo, setProductInfo] = useState(item ? {
    name: item.name,
    selling_price: item.selling_price
  } : null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productInfo) {
      setIsLoading(true);
      // Simulate API call to fetch product info by barcode
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Mock response - in real app this would come from your backend
        const mockProducts = {
          '1234567890': { name: 'شیر پاک', selling_price: 2500 },
          '1234567891': { name: 'نان تازە', selling_price: 1000 },
          '1234567892': { name: 'پەنیر کوردی', selling_price: 8000 },
          '1234567893': { name: 'چای ئەحمەد', selling_price: 5000 },
          '1234567894': { name: 'شەکر سپی', selling_price: 3500 }
        };

        const product = mockProducts[formData.barcode];
        if (product) {
          setProductInfo(product);
        } else {
          alert('بەرهەم بەم بارکۆدە نەدۆزرایەوە');
        }
      } catch (error) {
        alert('هەڵەیەک ڕوویدا لە گەڕان بۆ بەرهەم');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    onSave({
      ...item,
      ...formData,
      ...productInfo,
      quantity: parseInt(formData.quantity),
      selling_price: parseFloat(productInfo.selling_price)
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>
                    {mode === 'add' ? 'زیادکردنی بەرهەم' : 'دەستکاریکردنی بەرهەم'}
                  </span>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      بارکۆد
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={!!productInfo}
                    />
                  </div>

                  {productInfo && (
                    <>
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">ناو:</span>
                          <span>{productInfo.name}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="font-medium">نرخ:</span>
                          <span>{productInfo.selling_price} د.ع</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ژمارە
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg"
                    >
                      پەشیمانبوونەوە
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center min-w-24"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {productInfo ? 'پاشەکەوت' : 'گەڕان'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DiscountModal = ({ isOpen, onClose, discount, onSave , orderNumber }) => {
  const [discountType, setDiscountType] = useState(discount?.type || 'none');
  const [discountValue, setDiscountValue] = useState(discount?.value || 0);

  const handleSubmit = (e) => {
    if (discountType === 'none') {
      setDiscountValue(0);
    }
    console.log(discountType, discountValue,orderNumber);
    e.preventDefault();
    onSave({
      type: discountType,
      value: parseFloat(discountValue)
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50" />
        </Transition.Child>

        <div dir='rtl' className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>داشکاندن</span>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                      جۆری داشکاندن
                    </label>
                    <div className="space-y-2">
                      {['none', 'percentage', 'fixed_amount'].map((type) => (
                        <label key={type} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            value={type}
                            checked={discountType === type}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ml-2"
                          />
                          <span className="ml-3 flex items-center">
                            {type === 'none' && 'بەبێ داشکاندن'}
                            {type === 'percentage' && (
                              <>
                                ڕێژەیی
                                <Percent className="w-4 h-4 mr-1" />
                              </>
                            )}
                            {type === 'fixed_amount' && (
                              <>
                                بڕی دیاریکراو
                                <DollarSign className="w-4 h-4 mr-1" />
                              </>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {discountType !== 'none' && (
                    <div>
                      <label className="text-right block text-sm font-medium text-gray-700 mb-1">
                        بەها {discountType === 'percentage' ? '(%)' : '(د.ع)'}
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        max={discountType === 'percentage' ? "100" : undefined}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-start space-x-3 pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
                    >
                      پاشەکەوتکردن
                      <Save className="w-4 h-4 mr-2" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 text-black hover:text-gray-800 transition-colors rounded-lg"
                    >
                      پەشیمانبوونەوە
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DateModal = ({ isOpen, onClose, date, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedDate);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>گۆڕینی بەروار</span>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                {/* add the code to change date here  */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="flex justify-center">

                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg"
                    >
                      پەشیمانبوونەوە
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      پاشەکەوتکردن
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const TransactionView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const receiptRef = useRef();

  const [mockTransactions, setMockTransactions] = useState({});

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/reception/get_reception?orderNumber=${searchQuery}`);
      setTransaction(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteTransaction = async () => {
    if (!transaction) return;

    if (window.confirm('ئایا دڵنیای لە سڕینەوەی ئەم داواکاریە؟')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const newTransactions = { ...mockTransactions };
        delete newTransactions[transaction.orderNumber];
        setMockTransactions(newTransactions);

        setTransaction(null);
        setSearchQuery('');
        setSuccess('داواکاری بە سەرکەوتوویی سڕایەوە');
      } catch (err) {
        setError('هەڵەیەک ڕوویدا لە سڕینەوە');
      }
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setModalMode('add');
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalMode('edit');
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('ئایا دڵنیای لە سڕینەوەی ئەم بەرهەمە؟')) {
      const updatedTransaction = {
        ...transaction,
        items: transaction.items.filter(item => item.item_id !== itemId)
      };

      // Recalculate totals
      const newTotal = updatedTransaction.items.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0);
      updatedTransaction.total_amount = newTotal;

      // Apply discount
      if (updatedTransaction.discount_type === 'percentage') {
        updatedTransaction.final_amount = newTotal * (1 - updatedTransaction.discount_value / 100);
      } else if (updatedTransaction.discount_type === 'fixed_amount') {
        updatedTransaction.final_amount = Math.max(0, newTotal - updatedTransaction.discount_value);
      } else {
        updatedTransaction.final_amount = newTotal;
      }

      setTransaction(updatedTransaction);
      setMockTransactions({
        ...mockTransactions,
        [transaction.orderNumber]: updatedTransaction
      });
      setSuccess('بەرهەم بە سەرکەوتوویی سڕایەوە');
    }
  };

  const handleSaveItem = (itemData) => {
    let updatedItems;

    if (modalMode === 'add') {
      const newItem = {
        ...itemData,
        item_id: Date.now(), // Simple ID generation
        product_id: itemData.product_id || Date.now()
      };
      updatedItems = [...transaction.items, newItem];
    } else {
      updatedItems = transaction.items.map(item =>
        item.item_id === itemData.item_id ? itemData : item
      );
    }

    const updatedTransaction = {
      ...transaction,
      items: updatedItems
    };

    // Recalculate totals
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0);
    updatedTransaction.total_amount = newTotal;

    // Apply discount
    if (updatedTransaction.discount_type === 'percentage') {
      updatedTransaction.final_amount = newTotal * (1 - updatedTransaction.discount_value / 100);
    } else if (updatedTransaction.discount_type === 'fixed_amount') {
      updatedTransaction.final_amount = Math.max(0, newTotal - updatedTransaction.discount_value);
    } else {
      updatedTransaction.final_amount = newTotal;
    }

    setTransaction(updatedTransaction);
    setMockTransactions({
      ...mockTransactions,
      [transaction.orderNumber]: updatedTransaction
    });
    setSuccess(modalMode === 'add' ? 'بەرهەم بە سەرکەوتوویی زیادکرا' : 'بەرهەم بە سەرکەوتوویی نوێکرایەوە');
  };

  const handleSaveDiscount = (discountData) => {
    const updatedTransaction = {
      ...transaction,
      discount_type: discountData.type,
      discount_value: discountData.value
    };

    // Recalculate final amount
    if (discountData.type === 'percentage') {
      updatedTransaction.final_amount = transaction.total_amount * (1 - discountData.value / 100);
    } else if (discountData.type === 'fixed_amount') {
      updatedTransaction.final_amount = Math.max(0, transaction.total_amount - discountData.value);
    } else {
      updatedTransaction.final_amount = transaction.total_amount;
    }

    setTransaction(updatedTransaction);
    setMockTransactions({
      ...mockTransactions,
      [transaction.orderNumber]: updatedTransaction
    });
    setSuccess('داشکاندن بە سەرکەوتوویی نوێکرایەوە');
  };

  const handleSaveDate = (newDate) => {
    const updatedTransaction = {
      ...transaction,
      transaction_date: newDate.toISOString()
    };

    setTransaction(updatedTransaction);
    setMockTransactions({
      ...mockTransactions,
      [transaction.orderNumber]: updatedTransaction
    });
    setSuccess('بەروار بە سەرکەوتوویی نوێکرایەوە');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  const calculateDiscount = (transaction) => {
    if (transaction.discount_type === 'none') {
      return { applied: false, amount: 0, percentage: 0 };
    }

    const amount = transaction.total_amount - transaction.final_amount;
    const percentage = transaction.discount_type === 'percentage'
      ? transaction.discount_value
      : (amount / transaction.total_amount) * 100;

    return {
      applied: true,
      amount: amount,
      percentage: percentage
    };
  };

  return (
    <div>
      <Navbar />
      <div dir='rtl' className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              گەڕان بە ژمارەی داواکاری
              <Search className="w-6 h-6 mr-2" />
            </h1>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ژمارەی داواکاری داخڵ بکە (وەک ORD001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={fetchTransactions}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                گەڕان
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}
          </div>

          {transaction && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    زانیاری داواکاری
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsDiscountModalOpen(true)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm flex items-center shadow-sm"
                    >
                      داشکاندن
                      <Percent className="w-4 h-4 mr-1" />
                    </button>
                    <button
                      onClick={handleDeleteTransaction}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center shadow-sm"
                    >
                      سڕینەوە
                      <Trash2 className="w-4 h-4 mr-1" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">ژمارەی داواکاری:</span>
                    <span className="font-bold text-lg">{transaction.orderNumber} #</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 ml-1" />
                      بەروار :
                    </span>
                    <div className="flex items-center">
                      <span>{formatDate(transaction.transaction_date)}</span>
                      <button
                        onClick={() => setIsDateModalOpen(true)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600 flex items-center">
                      <User className="w-4 h-4 ml-1" />
                      کارمەند :
                    </span>
                    <span>{transaction.e_name}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600 flex items-center">
                      جۆری داشکاندن :
                    </span>
                    {transaction.discount_value == 0.000 ? (
                      <span>داشکاندنی نییە</span>
                    ) : (
                      <span>{transaction.discount_type === 'percentage' ? ` ڕێژەیی ` : ' بڕی دیاریکراو '}
                        {transaction.discount_type === 'percentage' ? + Number(transaction.discount_value) + "%" : Number(transaction.discount_value).toFixed(3) + " د.ع"}</span>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-gray-700 flex items-center">
                        <Package className="w-4 h-4 ml-1" />
                        بەرهەمەکان ({transaction.items.length} بەرهەم)
                      </h3>
                      <button
                        onClick={handleAddItem}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center shadow-sm"
                      >
                        زیادکردن
                        <Plus className="w-4 h-4 mr-1" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {transaction.items?.map(item => (
                        <div key={item.item_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-600">کۆد: {item.barcode}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{item.quantity} × {Number(item.selling_price).toFixed(3)} د.ع</div>
                            <div className="text-sm text-gray-600">کۆ: {(item.quantity * item.selling_price).toFixed(3)} د.ع</div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-1 text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.item_id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>کۆی گشتی :</span>
                      <span className="font-semibold">{Number(transaction.total_amount).toFixed(3)} د.ع</span>
                    </div>

                    {transaction.discount_type !== 'none' && (
                      <div className="flex justify-between text-red-600">
                        <span>داشکاندن </span>
                        <span>{(transaction.total_amount - transaction.final_amount).toFixed(3)} د.ع</span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>کۆی کۆتایی:</span>
                      <span>{Number(transaction.final_amount).toFixed(3)} د.ع</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Receipt
                  ref={receiptRef}
                  orderNumber={transaction.orderNumber}
                  items={transaction.items}
                  subtotal={transaction.total_amount}
                  discount={transaction}
                  total={transaction.final_amount}
                  payment={transaction.final_amount}
                  change={0}
                  date={transaction.transaction_date}
                  cashierName={transaction.e_name}
                />
              </div>
            </div>
          )}
        </div>

        <ItemModal
          isOpen={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          item={editingItem}
          onSave={handleSaveItem}
          mode={modalMode}
        />

        <DiscountModal
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
          discount={{
            type: transaction?.discount_type || 'none',
            value: transaction?.discount_value || 0
          }}
          onSave={handleSaveDiscount}
          orderNumber={transaction?.orderNumber}
        />

        <DateModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          date={transaction?.transaction_date}
          onSave={handleSaveDate}
        />
      </div>
    </div>
  );
};

export default TransactionView;