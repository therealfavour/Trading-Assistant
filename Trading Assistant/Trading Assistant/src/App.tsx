import React, { useState } from 'react';
import { Header } from './components/Header';
import { MarketOverview } from './components/MarketOverview';
import { AISignals } from './components/AISignals';
import { Portfolio } from './components/Portfolio';
import { NewsWidget } from './components/NewsWidget';
import { RiskMeter } from './components/RiskMeter';
import { TradingChart } from './components/TradingChart';
import { TradeExecutor } from './components/TradeExecutor';
import { useMarketData } from './hooks/useMarketData';
import { Loader, AlertCircle } from 'lucide-react';

function App() {
  const { stocks, signals, portfolio, news, loading, error } = useMarketData();
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [tradeModal, setTradeModal] = useState<{ symbol: string; price: number } | null>(null);
  const [trades, setTrades] = useState<any[]>([]);

  const handleExecuteTrade = (trade: any) => {
    setTrades(prev => [...prev, { ...trade, id: Date.now() }]);
    // In a real app, this would send the trade to a broker API
    console.log('Trade executed:', trade);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 text-blue-400 animate-spin" />
          <span className="text-white">Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm">{error}</span>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <MarketOverview 
              stocks={stocks} 
              onShowChart={setSelectedChart}
            />
            <AISignals 
              signals={signals}
              onExecuteTrade={(symbol, price) => setTradeModal({ symbol, price })}
            />
            {portfolio && <Portfolio portfolio={portfolio} />}
          </div>
          
          <div className="space-y-6">
            <RiskMeter portfolio={portfolio} />
            <NewsWidget news={news} />
          </div>
        </div>
        
        {/* Recent Trades */}
        {trades.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Trades</h2>
            <div className="space-y-2">
              {trades.slice(-5).reverse().map((trade) => (
                <div key={trade.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.type === 'BUY' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {trade.type}
                    </span>
                    <span className="text-white font-medium">{trade.symbol}</span>
                    <span className="text-gray-400">{trade.quantity} shares</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${trade.price.toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">
                      {trade.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Modals */}
      {selectedChart && (
        <TradingChart 
          symbol={selectedChart} 
          onClose={() => setSelectedChart(null)} 
        />
      )}
      
      {tradeModal && (
        <TradeExecutor
          symbol={tradeModal.symbol}
          currentPrice={tradeModal.price}
          onClose={() => setTradeModal(null)}
          onExecuteTrade={handleExecuteTrade}
        />
      )}
    </div>
  );
}

export default App;