import { useState } from 'react';
import { useRouter } from 'next/router';

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Employee Number
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.employeeNumber}
          onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select an Option
        </label>
        <div className="mt-4 space-y-4">
          {OPTIONS.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                name="option"
                value={option}
                required
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onChange={(e) => setFormData({ ...formData, option: e.target.value })}
              />
              <label className="ml-3 block text-sm font-medium text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Vote'}
      </button>
    </form>
  );
} 