import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getResults } from '../utils/csvHandler';
import VoteChart from '../components/VoteChart';

interface ResultsProps {
  results: Record<string, number>;
  totalVotes: number;
}

export default function Results({ results, totalVotes }: ResultsProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Voting Results</h1>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Vote
          </Link>
        </div>

        <VoteChart results={results} totalVotes={totalVotes} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(results)
            .sort(([, a], [, b]) => b - a)
            .map(([option, count]) => (
              <div key={option} className="bg-white shadow rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">{option}</h3>
                  <span className="text-sm font-medium text-indigo-600">
                    {count}
                  </span>
                </div>
                <div className="mt-2 relative">
                  <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${(count / totalVotes) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {totalVotes > 0 ? `${((count / totalVotes) * 100).toFixed(1)}%` : '0%'}
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-center pt-4">
          <a
            href="/api/download"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Download CSV
          </a>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getResults();
  return {
    props: data
  };
} 