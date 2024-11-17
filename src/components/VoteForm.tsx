import { useState } from 'react';
import { useRouter } from 'next/router';
import { OPTION_NAMES } from '../utils/constants';

const OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

export default function VoteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeNumber: '',
    name: '',
    option: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.isUpdate 
          ? 'Your previous vote has been updated!' 
          : 'Thank you for voting!'
        );
        router.push('/results');
      } else {
        alert(data.message || 'Error submitting vote');
      }
    } catch (error) {
      alert('Error submitting vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pt-20">
      <div className="mb-40">
        <div className="grid grid-cols-5 gap-4">
          {Object.values(OPTION_NAMES).map((name) => (
            <div 
              key={name}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                formData.option === name 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setFormData({ ...formData, option: name })}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-center font-medium">{name}</span>
                <input
                  type="radio"
                  name="option"
                  value={name}
                  checked={formData.option === name}
                  onChange={() => {}}
                  className="mt-2 h-4 w-4 text-indigo-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '30px' }}></div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
        <div className="max-w-6xl mx-auto flex gap-4">
          <input
            type="text"
            placeholder="사번을 입력해 주세요"
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            value={formData.employeeNumber}
            onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
          />
          <input
            type="text"
            placeholder="이름을 입력해 주세요"
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Vote'}
          </button>
        </div>
      </div>
    </form>
  );
}