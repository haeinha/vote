import { useEffect, useState } from 'react';
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
import { OPTION_NAMES } from '../utils/constants';

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
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-white p-4 rounded-lg shadow flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  const validResults = Object.entries(results)
    .filter(([key]) => Object.values(OPTION_NAMES).includes(key))
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});
  const sortedEntries = Object.entries(validResults)
    .sort(([, a], [, b]) => (b as number) - (a as number));
  
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
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          display: false,
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    indexAxis: 'y' as const,
    layout: {
      padding: {
        right: 100
      }
    },
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

  const plugins = [{
    id: 'customLabels',
    afterDatasetsDraw(chart: any) {
      const { ctx, scales: { x, y } } = chart;
      
      chart.data.datasets[0].data.forEach((value: number, index: number) => {
        const percentage = ((value / totalVotes) * 100).toFixed(1);
        const text = `${value} (${percentage}%)`;
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#4B5563';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const xPos = x.getPixelForValue(value) + 8;
        const yPos = y.getPixelForValue(index);
        
        ctx.fillText(text, xPos, yPos);
      });
    }
  }];

  return (
    <div className="w-full h-[600px] bg-white p-4 rounded-lg shadow">
      <Bar options={options} data={data} plugins={plugins} />
    </div>
  );
} 