import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getResults } from '../utils/csvHandler';

interface ResultsProps {
  results: Record<string, number>;
  totalVotes: number;
}

export default function Results({ results, totalVotes }: ResultsProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download');
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a temporary link element
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'votes.csv';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Voting Results
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Total Votes: {totalVotes}
          </p>
          
          <button
            onClick={handleDownload}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>

        <div className="mt-8 space-y-6">
          {Object.entries(results).map(([option, count]) => (
            <div key={option} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{option}</h3>
                <span className="text-lg font-medium text-indigo-600">
                  {count} votes
                </span>
              </div>
              <div className="mt-4 relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(count / totalVotes) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {totalVotes > 0 ? `${((count / totalVotes) * 100).toFixed(1)}%` : '0%'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            Back to Voting
          </Link>
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