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
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          maxWidth: '100%'
        }}>
          {Object.values(OPTION_NAMES).map((name, index) => (
            <label key={name} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name="vote"
                value={name}
                checked={formData.option === name}
                onChange={(e) => setFormData({ ...formData, option: e.target.value })}
                style={{ marginRight: '8px' }}
                required={true}
              />
              {name}
            </label>
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