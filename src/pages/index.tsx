import VoteForm from '../components/VoteForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Employee Voting System
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Please submit your vote below
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <VoteForm />
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/results" 
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View Results →
          </Link>
        </div>
      </div>
    </div>
  );
} 