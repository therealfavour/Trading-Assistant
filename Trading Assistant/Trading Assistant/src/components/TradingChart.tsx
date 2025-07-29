import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, CandlestickChart } from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { marketDataService } from '../services/marketApi';

interface TradingChartProps {
  symbol: string;
  onClose: () => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({ symbol, onClose }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1min');

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const data = await marketDataService.getHistoricalData(symbol, timeframe);
        if (data.length === 0) {
          // Generate mock data if API fails
          const mockData = generateMockChartData();
          setChartData(mockData);
        } else {
          setChartData(data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        const mockData = generateMockChartData();
        setChartData(mockData);
      }
      setLoading(false);
    };

    fetchChartData();
  }, [symbol, timeframe]);

  const generateMockChartData = () => {
    const data = [];
    let price = 150 + Math.random() * 100;
    const now = new Date();

    for (let i = 99; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
      const change = (Math.random() - 0.5) * 4;
      price = Math.max(50, price + change);
      
      data.push({
        timestamp,
        close: price,
        open: price - change,
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    return data;
  };

  const formatXAxis = (tickItem: any) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-white font-medium">
            Price: ${data.close?.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm">
            Volume: {data.volume?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">{symbol} Chart</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {['1min', '5min', '15min', '1hour'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-blue-400 animate-pulse" />
                <span className="text-white">Loading chart data...</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxis}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  stroke="#9CA3AF"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Current Price</div>
              <div className="text-white font-medium">
                ${chartData.length > 0 ? chartData[chartData.length - 1]?.close?.toFixed(2) : '---'}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 mb-1">24h High</div>
              <div className="text-green-400 font-medium">
                ${chartData.length > 0 ? Math.max(...chartData.map(d => d.high || 0)).toFixed(2) : '---'}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 mb-1">24h Low</div>
              <div className="text-red-400 font-medium">
                ${chartData.length > 0 ? Math.min(...chartData.map(d => d.low || 0)).toFixed(2) : '---'}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Volume</div>
              <div className="text-white font-medium">
                {chartData.length > 0 ? 
                  chartData.reduce((sum, d) => sum + (d.volume || 0), 0).toLocaleString() : 
                  '---'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};