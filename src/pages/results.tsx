import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getResults } from '../utils/csvHandler';
import VoteChart from '../components/VoteChart';

interface ResultsProps {
  results: Record<string, number>;
  totalVotes: number;
}

export default function Results({ results, totalVotes }: ResultsProps) {
  const handleDownloadCSV = () => {
    const csvContent = Object.entries(results)
      .map(([option, count]) => `${option},${count}`)
      .join('\n');
    const blob = new Blob([`Option,Votes\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voting-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Voting Results</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Vote
            </Link>
          </div>
        </div>

        <VoteChart results={results} totalVotes={totalVotes} />


        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download CSV
          </button>
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