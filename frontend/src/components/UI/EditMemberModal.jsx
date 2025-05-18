import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';

const EditMemberModal = ({ isOpen, onClose, member, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    emergencyphoneNumber: '',
    gender: '',
    height: '',
    weight: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phoneNumber: member.phoneNumber || '',
        emergencyphoneNumber: member.emergencyphoneNumber || '',
        gender: member.gender || '',
        height: member.height || '',
        weight: member.weight || ''
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/members/updatemember/${member.m_id}`, formData);

      if (response.status === 200) {
        onUpdate({
          ...member,
          ...formData
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating member:', error);
    } 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white hover:text-blue-200"
          >
            <X size={20} />
          </button>
          <div className="flex items-center">
            <div>
              <h2 className="text-xl font-bold">دەستکاری ئەندام</h2>
              <p className="text-blue-100">ناسنامەی ئەندام: #{member.m_id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">زانیاری کەسی</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ناوی تەواو</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ڕەگەز</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="پیاو">پیاو</option>
                      <option value="ئافرەت">ئافرەت</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆن</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ژمارەی تەلەفۆنی کاتی نائاسایی</label>
                    <input
                      type="text"
                      name="emergencyphoneNumber"
                      value={formData.emergencyphoneNumber}
                      onChange={handleChange}
                      className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بەرزی</label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">کێش</label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">وردەکاری ئەندامێتی</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">پلانی ئەندامێتی</label>
                    <input
                      type="text"
                      value={member.membership_title}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">جۆری ئەندامێتی</label>
                    <input
                      type="text"
                      value={member.type}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری دەستپێک</label>
                    <input
                      type="date"
                      value={(new Date(member.start_date).toISOString().split('T')[0])}
                      className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">بەرواری کۆتایی</label>
                    <input
                      type="date"
                      value={(new Date(member.end_date).toISOString().split('T')[0])}
                      className="w-full p-2 border focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                هەڵوەشاندنەوە
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Save size={18} className="ml-2" />
                هەڵگرتنی گۆڕانکاریەکان
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;