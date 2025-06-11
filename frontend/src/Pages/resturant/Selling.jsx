import { useRef, useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { forwardRef } from 'react';
import { ShoppingCart, CheckCircle, Minus, Plus, X, Percent, Search, Tag, ShoppingCartIcon } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/layout/Nav';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden h-96 flex flex-col transform hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold rounded-full px-3 py-1 shadow-sm ${product.stock > 5
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : product.stock > 0
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
            {product.stock > 0 ? `${product.stock} بەردەستە` : 'نەماوە'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        <div className="mb-4">
          <p className="text-2xl font-bold text-blue-600 mb-1">
            {product.selling_price}
            <span className="text-sm font-medium text-gray-500 mr-1">د.ع</span>
          </p>
        </div>

        <div className="text-xs text-gray-500 mb-4 bg-gray-50 py-2 px-3 rounded-lg border border-gray-100">
          <span className="font-medium">بارکۆد:</span> {product.barcode}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${product.stock > 0
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {product.stock > 0 ? (
              <div className='flex items-center justify-center'>
                <span>زیادکردن بۆ سەبەتە</span>
                <ShoppingCart size={20} className='mr-2' />
              </div>
            ) : 'بەردەست نییە'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 mb-3 overflow-hidden group">
      <div className="flex items-center p-3">
        <div className="h-16 w-16 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mr-3 flex-grow">
          <h4 className="font-bold text-gray-800">{item.name}</h4>
          <div className="flex items-center justify-between mt-1">
            <p className="text-blue-600 font-medium">{item.selling_price} د.ع</p>
            <div className="flex items-center text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">
              <span>کۆ: </span>
              <span className="mr-1 font-bold">{(item.selling_price * item.quantity).toFixed(3)} د.ع</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-t border-gray-100">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
          <span className="mx-2 w-8 text-center font-medium text-gray-800">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="p-1 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.product_id)}
          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
          aria-label="Remove item"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
        {item.quantity}x
      </div>
    </div>
  );
};

const DiscountForm = ({ discount, setDiscount, applyDiscount }) => {
  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Percent className="h-5 w-5 ml-2 text-blue-600" />
        داشکاندن
      </h3>
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
        <div className="flex gap-4 space-x-2 space-x-reverse">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-full">
                <div className="relative rounded-lg shadow-sm overflow-hidden">
                  <input
                    type="text"
                    value={discount.value}
                    onChange={(e) => setDiscount({ ...discount, value: e.target.value })}
                    placeholder="بڕی داشکاندن"
                    className="w-full p-3 border-0 bg-white rounded-r-lg focus:outline-none focus:ring-2  focus:ring-blue-500"
                  />
                  <select
                    value={discount.type}
                    onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
                    className="absolute inset-y-0 left-0 w-16 bg-gray-100 text-gray-800 font-medium text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percent">%</option>
                    <option value="amount">د.ع</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={applyDiscount}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
          >
            جێبەجێکردن
          </button>
        </div>
        {discount.applied ? (
          <div className="mt-3 flex items-center bg-green-100 p-2 rounded-lg text-green-700">
            <CheckCircle className="h-4 w-4 ml-2" />
            <span className="text-sm">
              داشکاندن جێبەجێ کرا: {discount.type === 'percent' ? discount.value + '%' : ((discount.value) * 1000) + ' د.ع'}
            </span>
          </div>
        ) : (
          <div className="mt-2 text-xs text-blue-700 text-right">
            داشکاندن دابنێ بۆ بەدەستهێنانی نرخی باشتر
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">سەبەتەکەت بەتاڵە</h3>
      <p className="text-gray-500">کاڵا لە لیستی بەرهەمەکان زیاد بکە بۆ دەستپێکردن.</p>
    </div>
  );
};

const Receipt = forwardRef(({ orderNumber, items, subtotal, discount, total, payment, change, currencyType = 'iqd', changeType = 'iqd', exchangeRate = 1 }, ref) => {
  const handleDownload = async () => {
    try {
      const receiptElement = ref.current;

      const originalStyles = {
        position: receiptElement.style.position,
        visibility: receiptElement.style.visibility,
        zIndex: receiptElement.style.zIndex,
      };

      receiptElement.style.position = 'absolute';
      receiptElement.style.visibility = 'visible';
      receiptElement.style.zIndex = '9999';
      receiptElement.style.left = '0';
      receiptElement.style.top = '0';

      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: 0,
        windowWidth: receiptElement.scrollWidth,
        windowHeight: receiptElement.scrollHeight,
      });

      Object.assign(receiptElement.style, originalStyles);

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      pdf.save(`receipt_${orderNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate receipt: ${error.message}`);
    }
  };

  const paymentDisplay = currencyType === 'iqd'
    ? `${Number(payment)} د.ع`
    : `$${Number(payment)}`;

  const changeAmount = currencyType === 'iqd'
    ? change
    : change;

  const changeDisplay = changeType === 'iqd'
    ? `${Number(changeAmount)} د.ع`
    : `$${(changeAmount / exchangeRate)}`;


  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{
          width: '80mm',
          minHeight: '50mm',
          padding: '15px',
          backgroundColor: 'white',
          color: 'black',
          margin: '0 auto',
          boxSizing: 'border-box',
          fontFamily: "'Courier New', monospace",
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderRadius: '4px',
        }}
      >
        <div dir='rtl' style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            color: '#333'
          }}>دوکانی جیم</h2>
          <p style={{ margin: '3px 0', fontSize: '10px', color: '#666' }}>
            هەولێر، کەسی ڕێگای 60 مەتری
          </p>
          <p style={{ margin: '3px 0', fontSize: '10px', color: '#666' }}>
            تەلەفۆن: 0750 123 4567
          </p>
          <div style={{
            borderTop: '1px dashed #ccc',
            borderBottom: '1px dashed #ccc',
            padding: '5px 0',
            margin: '8px 0'
          }}>
            <p style={{ margin: '3px 0', fontSize: '12px', fontWeight: 'bold' }}>
              ژمارەی داواکاری: #{orderNumber}
            </p>
            <p style={{ margin: '3px 0', fontSize: '11px' }}>
              {new Date().toLocaleString()}
            </p>
            <p style={{ margin: '3px 0', fontSize: '11px' }}>
              Cashier: عەلی
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '3px 0',
            borderBottom: '1px dashed #eee',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            <span style={{ width: '40%' }}>بەرهەم</span>
            <span style={{ width: '30%', textAlign: 'center' }}>دانە</span>
            <span style={{ width: '30%', textAlign: 'center' }}>نرخ</span>
          </div>

          {items.map(item => (
            <div key={item.product_id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '5px 0',
              borderBottom: '1px dashed #eee',
              fontSize: '12px'
            }}>
              <span style={{ width: '40%' }}>{item.name}</span>
              <span style={{ width: '30%', textAlign: 'center' }}>{item.quantity}</span>
              <span style={{ width: '30%', textAlign: 'center' }}>{item.selling_price}</span>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px dashed #ccc',
          borderBottom: '1px dashed #ccc',
          padding: '8px 0',
          margin: '10px 0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>کۆی گشتی:</span>
            <span>{Number(subtotal).toFixed(3)} د.ع</span>
          </div>
          {discount.applied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>داشکاندن ({discount.percentage}%):</span>
              <span>-{Number(discount.amount).toFixed(3)} د.ع</span>
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            marginTop: '5px',
            paddingTop: '5px',
            borderTop: '1px dashed #ccc'
          }}>
            <span>کۆی کۆتایی:</span>
            <span>{Number(total).toFixed(3)} د.ع</span>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          paddingTop: '5px',
          borderTop: '1px dashed #ccc'
        }}>
          <p style={{
            margin: '5px 0',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>سوپاس بۆ داواکاریەکەت!</p>
          <p style={{
            margin: '3px 0',
            fontSize: '10px',
            color: '#666'
          }}>بەهیوای بینینت دووبارە</p>
          <p style={{
            margin: '3px 0',
            fontSize: '9px',
            color: '#999'
          }}>www.jimstore.com</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        <Download style={{ marginRight: '8px' }} />
        داگرتنی پێداچوونەوە
      </button>
    </div>
  );
});

const CartSummary = ({
  subtotal,
  discount,
  total,
  completeOrder,
  payment,
  setPayment,
  change,
  currencyType,
  setCurrencyType,
  changeType,
  setChangeType,
  exchangeRate,
  setExchangeRate
}) => {
  const paymentInIQD = currencyType === 'iqd'
    ? parseFloat(payment) || 0
    : (parseFloat(payment) || 0) * exchangeRate;

  const isPaymentSufficient = paymentInIQD >= total;

  return (
    <div className="pt-4 border-t border-gray-200">
      <CurrencyConverter
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
      />

      <div className="flex justify-between items-center mb-2 bg-gray-50 p-2 rounded-lg">
        <span className="text-gray-700 font-medium">{subtotal.toFixed(3)} د.ع</span>
        <span className="text-gray-700">کۆی گشتی</span>
      </div>

      {discount.applied && (
        <div className="flex justify-between items-center mb-2 bg-green-50 p-2 rounded-lg">
          <span className="text-green-700 font-medium">-{discount.amount.toFixed(3)} د.ع</span>
          <div className="flex items-center">
            <span className="text-green-700">داشکاندن</span>
            {discount.type === 'percent' && (
              <span className="mr-1 bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full">
                {discount.value}%
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200 bg-blue-50 p-3 rounded-lg mt-3">
        <span className="text-lg font-bold text-blue-700">{total.toFixed(3)} د.ع</span>
        <span className="text-lg font-bold text-blue-700">کۆی گشتی کۆتایی</span>
      </div>

      <PaymentInput
        payment={payment}
        setPayment={setPayment}
        currencyType={currencyType}
        setCurrencyType={setCurrencyType}
        exchangeRate={exchangeRate}
      />

      {payment > 0 && paymentInIQD >= total && (
        <ChangeDisplay
          change={currencyType === 'iqd' ? paymentInIQD - total : ((paymentInIQD - (total * 100))) / 100}
          changeType={changeType}
          setChangeType={setChangeType}
          exchangeRate={exchangeRate}
        />
      )}

      <button
        onClick={() => completeOrder()}
        disabled={!isPaymentSufficient && payment > 0}
        className={`w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center mb-2 ${(!isPaymentSufficient && payment > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CheckCircle className="h-5 w-5 ml-2" />
        تەواوکردنی داواکاری
      </button>
    </div>
  );
};

const CurrencyConverter = ({ exchangeRate, setExchangeRate }) => {
  return (
    <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-bold mb-2 text-gray-800">نرخی گۆڕینەوە</h3>
      <div className="flex items-center">
        <span className="text-sm text-gray-600 ml-2">1 دۆلار =</span>
        <input
          type="number"
          value={exchangeRate}
          onChange={(e) => setExchangeRate(Math.max(1, parseFloat(e.target.value) || 0))}
          className="w-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          step="0.01"
        />
        <span className="text-sm text-gray-600 mr-2">د.ع</span>
      </div>
    </div>
  );
};

const PaymentInput = ({ payment, setPayment, currencyType, setCurrencyType, exchangeRate }) => {
  const handleCurrencyChange = (e) => {
    setCurrencyType(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">پارەی وەرگیراو</label>
      <div className="flex">
        <div className="relative rounded-md shadow-sm flex-grow">
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            placeholder="بڕی پارە"
            className="block w-full pr-12 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">{currencyType === 'iqd' ? 'د.ع' : '$'}</span>
          </div>
        </div>
        <select
          value={currencyType}
          onChange={handleCurrencyChange}
          className="p-3 border border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-l-0"
        >
          <option value="iqd">د.ع</option>
          <option value="usd">$</option>
        </select>
      </div>
      {payment > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {currencyType === 'usd' ? (
            <span>≈ {(payment * exchangeRate)} د.ع</span>
          ) : (
            <span>≈ ${(payment / exchangeRate)} دۆلار</span>
          )}
        </div>
      )}
    </div>
  );
};

const ChangeDisplay = ({ change, changeType, setChangeType, exchangeRate }) => {
  const handleChangeTypeChange = (e) => {
    setChangeType(e.target.value);
  };

  const displayChange = changeType === 'iqd'
    ? ((change))
    : ((change * 100) / 145);

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold">{displayChange}</span>
          <span className="ml-1">{changeType === 'iqd' ? 'د.ع' : '$'}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">گۆڕاوە:</span>
          <select
            value={changeType}
            onChange={handleChangeTypeChange}
            className="p-1 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="iqd">د.ع</option>
            <option value="usd">$</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const BarcodeScanner = ({ onScan }) => {
  const [barcode, setBarcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode);
      setBarcode('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-blue-100">
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <Search className="h-5 w-5 ml-2 text-blue-600" />
        سکان کردنی بارکۆد
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="بارکۆد داخڵ بکە یان سکان بکە"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
        >
          زیادکردن
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        بارکۆد داخڵ بکە بۆ زیادکردنی ڕاستەوخۆ بۆ سەبەتە
      </p>
    </div>
  );
};

export default function GymPOSSalesDashboard() {
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

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`http://localhost:3000/category/getallcategory`)
      const categoriesArray = Object.values(res.data.rows);
      setCategories(categoriesArray);
    }
    fetchCategories()
  }, [])

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('هەموو');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [discount, setDiscount] = useState({
    value: '',
    type: 'amount',
    applied: false,
    amount: 0
  });
  const [payment, setPayment] = useState(0);
  const receiptRef = useRef();
  const [currencyType, setCurrencyType] = useState('iqd');
  const [changeType, setChangeType] = useState('iqd');
  const [exchangeRate, setExchangeRate] = useState(145);

  const filteredProducts = inventoryItems.filter(product => {
    const matchesSearch = product.name.includes(searchTerm);
    const matchesCategory = selectedCategory === 'هەموو' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const paymentInIQD = currencyType === 'iqd'
    ? parseFloat(payment) || 0
    : (parseFloat(payment) || 0) * exchangeRate;


  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === product.product_id);

      if (existingItem) {
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);

  const applyDiscount = () => {
    if (!discount.value || isNaN(discount.value)) {
      return;
    }

    let discountAmount = 0;
    if (discount.type === 'percent') {
      const percentValue = Math.min(100, Math.max(0, parseFloat(discount.value)));
      discountAmount = subtotal * (percentValue / 100);
    } else {
      discountAmount = Math.min(subtotal, Math.max(0, parseFloat(discount.value)));
    }

    setDiscount({
      ...discount,
      applied: true,
      amount: discountAmount
    });
  };

  const total = discount.applied ? subtotal - discount.amount : subtotal;

  const change = paymentInIQD > total ? paymentInIQD - total : 0;

  const completeOrder = () => {
    if (paymentInIQD < total && paymentInIQD > 0) return;

    const timestamp = Date.now().toString().slice(-7);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = timestamp + random;
    setOrderNumber(orderNumber);
    setOrderComplete(true);
  };

  const handleBarcodeScan = (barcode) => {
    const product = inventoryItems.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
    } else {
      alert("بارکۆدی داخڵکراو نەدۆزرایەوە!");
    }
  };

  const resetCart = () => {
    setCart([]);
    setOrderComplete(false);
    setOrderNumber('');
    setPayment(0);
    setDiscount({
      value: '',
      type: 'amount',
      applied: false,
      amount: 0
    });
  };

  const submitOrder = async (orderDetails) => {
    try {
      const res = await axios.post(`http://localhost:3000/sales/buyingproducts`, orderDetails);

      if (res.status = 201) {
        alert("order completed successfully");
        resetCart();
        const updatedItems = await axios.get('http://localhost:3000/sales/getallsales');
        setInventoryItems(updatedItems.data.data);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">دوکانی جیم</h1>
            <div className="relative">
              <button className="flex items-center bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50 shadow-sm">
                <ShoppingCart className="h-5 w-5 ml-2" />
                <span>{cart.length} {cart.length === 1 ? 'کاڵا' : 'کاڵا'}</span>
              </button>
            </div>
          </div>

          <BarcodeScanner onScan={handleBarcodeScan} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="گەڕان بە دوای بەرهەم..."
                      className="pr-10 pl-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className={`ml-2 mb-2 px-4 py-1.5 text-sm rounded-lg ${selectedCategory === category.name
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">هیچ بەرهەمێک نەدۆزرایەوە</h3>
                    <p className="text-gray-500">گەڕان یان فلتەر بگۆڕە.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.product_id}
                        product={product}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 sticky top-8">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    سەبەتە
                    <span className="mr-2 bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {cart.length} {cart.length === 1 ? 'کاڵا' : 'کاڵا'}
                    </span>
                  </h2>
                </div>

                <div className="px-6">
                  {cart.length === 0 && !orderComplete ? (
                    <EmptyCart />
                  ) : orderComplete ? (
                    <div className="text-center py-4">
                      <Receipt
                        orderNumber={orderNumber}
                        items={cart}
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                        payment={payment}
                        change={change}
                        currencyType="iqd"
                        changeType="iqd"
                        exchangeRate={1200}
                        ref={receiptRef}
                      />
                      <div className="flex gap-2 mt-4 justify-center">
                        <button
                          onClick={() => {
                            resetCart();
                            submitOrder({
                              e_id: 1,
                              orderNumber: orderNumber,
                              carts: cart,
                              discount_type: discount.type,
                              discount_value: discount.value,
                              total_amount: subtotal,
                              final_amount: total
                            });
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          درێژەدان بە بازاڕکردن
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-96 overflow-y-auto py-4 space-y-0">
                        {cart.map(item => (
                          <CartItem
                            key={item.product_id}
                            item={item}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                          />
                        ))}
                      </div>

                      <DiscountForm
                        discount={discount}
                        setDiscount={setDiscount}
                        applyDiscount={applyDiscount}
                      />

                      <CartSummary
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                        completeOrder={completeOrder}
                        payment={parseFloat(payment) || 0}
                        setPayment={(val) => setPayment(val >= 0 ? val : 0)}
                        change={change}
                        currencyType={currencyType}
                        setCurrencyType={setCurrencyType}
                        changeType={changeType}
                        setChangeType={setChangeType}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}