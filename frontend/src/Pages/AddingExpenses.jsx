import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';

export default function AddExpense() {
  const navigate = useNavigate();
  
  // State for new expense
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  });
  
  // State for validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Categories for selection
  const categories = ['ئامێر', 'خزمەتگوزاری', 'پڕۆتین', 'چاککردنەوە', 'مووچە', 'ڕیکلام', 'کەلوپەل', 'هیتر'];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value) || 0) : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!newExpense.date) {
      newErrors.date = 'تکایە بەروار دیاری بکە';
    }
    
    if (!newExpense.category) {
      newErrors.category = 'تکایە جۆر دیاری بکە';
    }
    
    if (!newExpense.amount || newExpense.amount <= 0) {
      newErrors.amount = 'تکایە بڕێکی دروست بنووسە';
    }
    
    if (!newExpense.description.trim()) {
      newErrors.description = 'تکایە وەسفێک بنووسە';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Here you would typically save the expense to your database or state
    // For now, we'll simulate a successful save and redirect
    
    setTimeout(() => {
      // In a real app, you would add the expense to your state or database here
      // For example: addExpenseToDatabase(newExpense);
      
      // Then redirect back to expenses page
      navigate('/expenses');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/expenses')}
              className="p-2 rounded-full hover:bg-white/20 transition-colors mr-2"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">زیادکردنی خەرجی نوێ</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">تۆمارکردنی خەرجی نوێ</h2>
            <p className="text-white/80 text-sm mt-1">تکایە زانیارییەکان بە دروستی پڕ بکەوە</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بەروار</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                    value={newExpense.date}
                    onChange={handleChange}
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">جۆر</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-gray-400" />
                  </div>
                  <select
                    name="category"
                    className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    value={newExpense.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>جۆرێک هەڵبژێرە</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بڕ</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={handleChange}
                  />
                </div>
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وەسف</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="description"
                    className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="وەسفی خەرجییەکە بنووسە"
                    value={newExpense.description}
                    onChange={handleChange}
                  />
                </div>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>
            
            <div className="mt-8 flex justify-start gap-2">
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    تۆمارکردن...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save size={18} className="ml-1" />
                    تۆمارکردن
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/expenses')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ml-3"
              >
                <span className="flex items-center">
                  <X size={18} className="ml-1" />
                  پاشگەزبوونەوە
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}