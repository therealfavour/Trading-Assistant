import React from 'react';
import { Brain, Target, Shield, Clock } from 'lucide-react';
import { AISignal } from '../types/trading';

interface AISignalsProps {
  signals: AISignal[];
  onExecuteTrade?: (symbol: string, price: number) => void;
}

export const AISignals: React.FC<AISignalsProps> = ({ signals, onExecuteTrade }) => {
  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'SELL': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'HOLD': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Brain className="h-5 w-5 mr-2" />
        AI Trading Signals
      </h2>
      
      <div className="space-y-4">
        {signals.map((signal) => (
          <div key={signal.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="font-semibold text-white text-lg">{signal.symbol}</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSignalColor(signal.type)}`}>
                  {signal.type}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm">Confidence</div>
                <div className={`text-lg font-bold ${getConfidenceColor(signal.confidence)}`}>
                  {(signal.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{signal.reasoning}</p>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="text-gray-400">Target</div>
                  <div className="text-white font-medium">${signal.targetPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-400" />
                <div>
                  <div className="text-gray-400">Stop Loss</div>
                  <div className="text-white font-medium">${signal.stopLoss.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <div>
                  <div className="text-gray-400">Timeframe</div>
                  <div className="text-white font-medium">{signal.timeframe}</div>
                </div>
              </div>
            </div>
            
            {onExecuteTrade && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <button
                  onClick={() => onExecuteTrade(signal.symbol, signal.targetPrice)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    signal.type === 'BUY'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : signal.type === 'SELL'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  Execute {signal.type} Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};