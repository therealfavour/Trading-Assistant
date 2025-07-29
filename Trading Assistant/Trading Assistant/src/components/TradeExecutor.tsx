import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator } from 'lucide-react';

interface TradeExecutorProps {
  symbol: string;
  currentPrice: number;
  onClose: () => void;
  onExecuteTrade: (trade: any) => void;
}

export const TradeExecutor: React.FC<TradeExecutorProps> = ({ 
  symbol, 
  currentPrice, 
  onClose, 
  onExecuteTrade 
}) => {
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP'>('MARKET');
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);
  const [stopPrice, setStopPrice] = useState<number>(currentPrice * 0.95);
  const [timeInForce, setTimeInForce] = useState<'DAY' | 'GTC'>('DAY');

  const totalValue = quantity * (orderType === 'MARKET' ? currentPrice : limitPrice);
  const estimatedFees = totalValue * 0.001; // 0.1% fee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trade = {
      symbol,
      type: tradeType,
      orderType,
      quantity,
      price: orderType === 'MARKET' ? currentPrice : limitPrice,
      stopPrice: orderType === 'STOP' ? stopPrice : undefined,
      timeInForce,
      totalValue,
      estimatedFees,
      timestamp: new Date()
    };

    onExecuteTrade(trade);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Trade {symbol}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Trade Type */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Trade Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`p-3 rounded-lg border flex items-center justify-center space-x-2 ${
                  tradeType === 'BUY'
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>BUY</span>
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`p-3 rounded-lg border flex items-center justify-center space-x-2 ${
                  tradeType === 'SELL'
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                <span>SELL</span>
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Order Type
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="MARKET">Market Order</option>
              <option value="LIMIT">Limit Order</option>
              <option value="STOP">Stop Order</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          {/* Price Fields */}
          {orderType === 'LIMIT' && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Limit Price
              </label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || currentPrice)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          )}

          {orderType === 'STOP' && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Stop Price
              </label>
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(parseFloat(e.target.value) || currentPrice)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          )}

          {/* Time in Force */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Time in Force
            </label>
            <select
              value={timeInForce}
              onChange={(e) => setTimeInForce(e.target.value as any)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="DAY">Day Order</option>
              <option value="GTC">Good Till Canceled</option>
            </select>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium">Order Summary</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Price:</span>
              <span className="text-white">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white">{quantity} shares</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Value:</span>
              <span className="text-white">${totalValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Est. Fees:</span>
              <span className="text-white">${estimatedFees.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-300">Total Cost:</span>
                <span className="text-white">${(totalValue + estimatedFees).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              tradeType === 'BUY'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {tradeType} {quantity} shares of {symbol}
          </button>
        </form>
      </div>
    </div>
  );
};