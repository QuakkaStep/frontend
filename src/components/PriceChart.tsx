import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  step: number;
  amountPerStep: number;
}

const PriceChart: React.FC<PriceChartProps> = ({
  currentPrice,
  minPrice,
  maxPrice,
  step,
  amountPerStep,
}) => {
  // 生成价格数据点
  const generatePricePoints = () => {
    const points = [];
    const steps = 20; // 显示20个点
    const priceRange = maxPrice - minPrice;
    const stepSize = priceRange / steps;

    for (let i = 0; i <= steps; i++) {
      const price = minPrice + (stepSize * i);
      const trumpAmount = amountPerStep * (i + 1); // 累计投入的 TRUMP 数量
      points.push({
        price,
        trumpAmount,
      });
    }
    return points;
  };

  const pricePoints = generatePricePoints();

  const data = {
    labels: pricePoints.map((_, index) => `Step ${index + 1}`),
    datasets: [
      {
        label: 'TRUMP Price',
        data: pricePoints.map(point => point.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const point = pricePoints[index];
            return [
              `Price: $${point.price.toFixed(2)}`,
              `TRUMP Invested: ${point.trumpAmount.toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'TRUMP Price ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Steps',
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] p-4 bg-white rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart; 