import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VoteChartProps {
  results: Record<string, number>;
  totalVotes: number;
}

export default function VoteChart({ results, totalVotes }: VoteChartProps) {
  // Sort the results entries by vote count in descending order
  const sortedEntries = Object.entries(results).sort(([, a], [, b]) => b - a);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Total Votes: ${totalVotes}`,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    indexAxis: 'y' as const,
  };

  const data = {
    labels: sortedEntries.map(([label]) => label),
    datasets: [
      {
        data: sortedEntries.map(([, value]) => value),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-[600px] bg-white p-4 rounded-lg shadow">
      <Bar options={options} data={data} />
    </div>
  );
} 