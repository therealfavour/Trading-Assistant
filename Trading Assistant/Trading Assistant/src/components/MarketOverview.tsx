import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { Stock } from '../types/trading';

interface MarketOverviewProps {
  stocks: Stock[];
  onShowChart?: (symbol: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ stocks, onShowChart }) => {
  const marketIndices = [
    { name: 'S&P 500', value: 4789.85, change: 23.45, changePercent: 0.49 },
    { name: 'NASDAQ', value: 14924.76, change: -12.34, changePercent: -0.08 },
    { name: 'DOW', value: 37863.80, change: 156.92, changePercent: 0.42 }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2" />
        Market Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {marketIndices.map((index) => (
          <div key={index.name} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-300 text-sm font-medium">{index.name}</h3>
              {index.change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">
                {index.value.toLocaleString()}
              </div>
              <div className={`text-sm ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {stocks.slice(0, 4).map((stock) => (
          <div 
            key={stock.symbol} 
            className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors group"
            onClick={() => onShowChart?.(stock.symbol)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-white">{stock.symbol}</div>
                <div className="text-xs text-gray-400">{stock.name}</div>
              </div>
              <div className="flex items-center space-x-1">
                {stock.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <BarChart3 className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <div className="text-xl font-bold text-white mb-1">
              ${stock.price.toFixed(2)}
            </div>
            <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};