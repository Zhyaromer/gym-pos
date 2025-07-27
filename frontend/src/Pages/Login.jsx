import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Lock, 
  LogIn,
  Dumbbell
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.username || !credentials.password) {
      setError('تکایە ناوی بەکارهێنەر و وشەی نهێنی بنووسە');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(credentials.username, credentials.password);
      
      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە');
      }
    } catch (err) {
      setError('هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەوە');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Dumbbell size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold">چوونەژوورەوەی سیستەمی یانە</h1>
          <p className="text-blue-100 mt-1">زانیاریەکانت بنووسە بۆ چوونەژوورەوە</p>
        </div>
        
        <div className="p-6" dir="rtl">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ناوی بەکارهێنەر</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="ناوی بەکارهێنەر بنووسە"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وشەی نهێنی</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="وشەی نهێنی بنووسە"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <span dir='rtl' className="flex items-center">
                      چاوەڕوان بە... 
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      چوونەژوورەوە
                      <LogIn size={18} className="mr-2" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>زانیاری بۆ تاقیکردنەوە: admin / admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}