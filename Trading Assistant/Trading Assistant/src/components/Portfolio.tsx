import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Portfolio as PortfolioType } from '../types/trading';

interface PortfolioProps {
  portfolio: PortfolioType;
}

export const Portfolio: React.FC<PortfolioProps> = ({ portfolio }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Wallet className="h-5 w-5 mr-2" />
        Portfolio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Value</div>
          <div className="text-2xl font-bold text-white">
            ${portfolio.totalValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Day Change</div>
          <div className={`text-2xl font-bold ${portfolio.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolio.dayChange >= 0 ? '+' : ''}${Math.abs(portfolio.dayChange).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Day Change %</div>
          <div className={`text-2xl font-bold flex items-center ${portfolio.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolio.dayChangePercent >= 0 ? (
              <TrendingUp className="h-5 w-5 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 mr-1" />
            )}
            {portfolio.dayChangePercent >= 0 ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Positions</h3>
        {portfolio.positions.map((position) => (
          <div key={position.symbol} className="bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
              <div>
                <div className="font-semibold text-white">{position.symbol}</div>
                <div className="text-sm text-gray-400">{position.shares} shares</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Avg Price</div>
                <div className="text-white font-medium">${position.avgPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Current Price</div>
                <div className="text-white font-medium">${position.currentPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Market Value</div>
                <div className="text-white font-medium">${position.value.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Unrealized P&L</div>
                <div className={`font-medium ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {position.unrealizedPnL >= 0 ? '+' : ''}${Math.abs(position.unrealizedPnL).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Return %</div>
                <div className={`font-medium ${position.unrealizedPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};