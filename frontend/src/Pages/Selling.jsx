import { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, Tag, CheckCircle, DollarSign, Percent } from 'lucide-react';

// Mock product data
const productData = [
  {
    id: 1,
    name: "پڕۆتینی وەی",
    category: "پڕۆتین",
    price: 49.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 15,
  },
  {
    id: 2,
    name: "باندی بەرگری",
    category: "ئامێر",
    price: 24.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 8,
  },
  {
    id: 3,
    name: "وەرگری وەرزشی",
    category: "ئەلیکترۆنی",
    price: 89.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 6,
  },
  {
    id: 4,
    name: "خاولی جیم",
    category: "ئامێر",
    price: 12.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 30,
  },
  {
    id: 5,
    name: "کرێاتین",
    category: "پڕۆتین",
    price: 29.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 12,
  },
  {
    id: 6,
    name: "باتڵی ئاو",
    category: "ئامێر",
    price: 18.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 20,
  },
  {
    id: 7,
    name: "دەستکێش",
    category: "جلوبەرگ",
    price: 19.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 10,
  },
  {
    id: 8,
    name: "پێش وەرزش",
    category: "پڕۆتین",
    price: 39.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 8,
  },
  {
    id: 9,
    name: "رۆڵەری فۆم",
    category: "ئامێر",
    price: 34.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 7,
  },
  {
    id: 10,
    name: "بارەکانی پڕۆتین (12 دانە)",
    category: "پڕۆتین",
    price: 24.99,
    image: "https://i5.walmartimages.com/asr/663d9840-58da-4716-8a7d-d93f20daf6ea_1.58eb687b09f1b55c238d9e6ab3f4fc7a.jpeg",
    stock: 15,
  }
];

// Get all unique categories
const allCategories = ["هەموو", ...new Set(productData.map(product => product.category))];

// ProductCard component
const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      <div className="p-4">
        <div className="aspect-square w-full bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg overflow-hidden mb-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-gray-900 mb-1 text-lg">{product.name}</h3>
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-blue-600 text-xl">{product.price.toFixed(2)} د.ع</p>
          <span className={`text-xs rounded-full px-3 py-1 ${product.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            بەردەستە: {product.stock}
          </span>
        </div>
        <button 
          onClick={() => addToCart(product)} 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
        >
          زیادکردن بۆ سەبەتە
        </button>
      </div>
    </div>
  );
};

// Improved Cart item component
const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 mb-3 overflow-hidden group">
      <div className="flex items-center p-3">
        <div className="h-16 w-16 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mr-3 flex-grow">
          <h4 className="font-bold text-gray-800">{item.name}</h4>
          <div className="flex items-center justify-between mt-1">
            <p className="text-blue-600 font-medium">{item.price.toFixed(2)} د.ع</p>
            <div className="flex items-center text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">
              <span>کۆ: </span>
              <span className="mr-1 font-bold">{(item.price * item.quantity).toFixed(2)} د.ع</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-t border-gray-100">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
          <span className="mx-2 w-8 text-center font-medium text-gray-800">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="p-1 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <button 
          onClick={() => removeFromCart(item.id)}
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

// Discount component
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
                    onChange={(e) => setDiscount({...discount, value: e.target.value})}
                    placeholder="بڕی داشکاندن"
                    className="w-full p-3 border-0 bg-white rounded-r-lg focus:outline-none focus:ring-2  focus:ring-blue-500"
                  />
                  <select 
                    value={discount.type}
                    onChange={(e) => setDiscount({...discount, type: e.target.value})}
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
              داشکاندن جێبەجێ کرا: {discount.type === 'percent' ? discount.value + '%' : discount.value + ' د.ع'}
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

// Empty cart component
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

// Receipt component
const Receipt = ({ orderNumber, items, subtotal, discount, total, resetCart }) => {
  return (
    <div className="text-center py-8">
      <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">داواکاری تەواو بوو!</h3>
      <p className="text-gray-500 mb-6">ژمارەی داواکاری #{orderNumber}</p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-bold mb-3 text-right">پوختەی داواکاری</h4>
        <div className="space-y-2 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{(item.price * item.quantity).toFixed(2)} د.ع</span>
              <span>{item.quantity}x {item.name}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-sm pt-2">
            <span>{subtotal.toFixed(2)} د.ع</span>
            <span>کۆی گشتی</span>
          </div>
          {discount.applied && (
            <div className="flex justify-between text-sm pt-2 text-green-600">
              <span>-{discount.amount.toFixed(2)} د.ع</span>
              <span>داشکاندن {discount.type === 'percent' ? `(${discount.value}%)` : ''}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-2">
            <span>{total.toFixed(2)} د.ع</span>
            <span>کۆی گشتی کۆتایی</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={resetCart}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-6 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
      >
        درێژەدان بە بازاڕکردن
      </button>
    </div>
  );
};

// Cart Summary component
const CartSummary = ({ subtotal, discount, total, completeOrder }) => {
  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex justify-between items-center mb-2 bg-gray-50 p-2 rounded-lg">
        <span className="text-gray-700 font-medium">{subtotal.toFixed(2)} د.ع</span>
        <span className="text-gray-700">کۆی گشتی</span>
      </div>
      
      {discount.applied && (
        <div className="flex justify-between items-center mb-2 bg-green-50 p-2 rounded-lg">
          <span className="text-green-700 font-medium">-{discount.amount.toFixed(2)} د.ع</span>
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
      
      <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200 bg-blue-50 p-3 rounded-lg mt-3">
        <span className="text-lg font-bold text-blue-700">{total.toFixed(2)} د.ع</span>
        <span className="text-lg font-bold text-blue-700">کۆی گشتی کۆتایی</span>
      </div>
      
      <button
        onClick={completeOrder}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center mb-6"
      >
        <CheckCircle className="h-5 w-5 ml-2" />
        تەواوکردنی داواکاری
      </button>
    </div>
  );
};

// Main component
export default function GymPOSSalesDashboard() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('هەموو');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [discount, setDiscount] = useState({
    value: '',
    type: 'percent',
    applied: false,
    amount: 0
  });
  
  // Filter products
  const filteredProducts = productData.filter(product => {
    const matchesSearch = product.name.includes(searchTerm);
    const matchesCategory = selectedCategory === 'هەموو' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Add to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  
  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.min(newQuantity, item.stock) } 
          : item
      )
    );
  };
  
  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Apply discount
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
  
  // Calculate total
  const total = discount.applied ? subtotal - discount.amount : subtotal;
  
  // Complete order
  const completeOrder = () => {
    const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(randomOrderNum);
    setOrderComplete(true);
  };
  
  // Reset cart
  const resetCart = () => {
    setCart([]);
    setOrderComplete(false);
    setOrderNumber('');
    setDiscount({
      value: '',
      type: 'percent',
      applied: false,
      amount: 0
    });
  };
  
  return (
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List Section */}
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
                {allCategories.map((category) => (
                  <button
                    key={category}
                    className={`ml-2 mb-2 px-4 py-1.5 text-sm rounded-lg ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
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
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Cart/Checkout Section - Improved UI */}
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
                  <Receipt 
                    orderNumber={orderNumber}
                    items={cart}
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    resetCart={resetCart}
                  />
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto py-4 space-y-0">
                      {cart.map(item => (
                        <CartItem 
                          key={item.id}
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
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}