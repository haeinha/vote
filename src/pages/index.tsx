import VoteForm from '../components/VoteForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Employee Voting System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please submit your vote below
          </p>
        </div>
        
        <div className="mt-8">
          <VoteForm />
        </div>

        <div className="mt-6 text-center">
          <Link href="/results" className="text-indigo-600 hover:text-indigo-500">
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
} 