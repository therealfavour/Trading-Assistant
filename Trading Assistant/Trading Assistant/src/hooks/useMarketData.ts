import { useState, useEffect } from 'react';
import { Stock, AISignal, Portfolio, MarketNews } from '../types/trading';
import { marketDataService } from '../services/marketApi';
import { aiTradingService } from '../services/aiService';

export const useMarketData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stock data
        const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
        const stockData = await marketDataService.getMultipleQuotes(stockSymbols);
        
        // Enhance with company profiles
        const enhancedStocks = await Promise.all(
          stockData.map(async (stock) => {
            const profile = await marketDataService.getStockProfile(stock.symbol);
            return {
              ...stock,
              name: profile?.name || stock.name,
              marketCap: profile?.marketCap || stock.marketCap
            };
          })
        );

        setStocks(enhancedStocks);

        // Generate AI signals based on real data
        const aiSignals = await aiTradingService.generateSignals(enhancedStocks);
        setSignals(aiSignals);

        // Fetch market news
        const marketNews = await marketDataService.getMarketNews();
        setNews(marketNews);

        // Generate mock portfolio (in real app, this would come from user's account)
        const mockPortfolio: Portfolio = {
          totalValue: 125750.50,
          dayChange: 2350.75,
          dayChangePercent: 1.91,
          positions: enhancedStocks.slice(0, 3).map((stock, index) => {
            const shares = [100, 50, 75][index];
            const avgPrice = stock.price * (0.9 + Math.random() * 0.2);
            const value = shares * stock.price;
            const unrealizedPnL = shares * (stock.price - avgPrice);
            
            return {
              symbol: stock.symbol,
              shares,
              avgPrice,
              currentPrice: stock.price,
              value,
              unrealizedPnL,
              unrealizedPnLPercent: (unrealizedPnL / (shares * avgPrice)) * 100
            };
          })
        };
        
        setPortfolio(mockPortfolio);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch market data:', err);
        setError('Failed to load market data. Using demo data.');
        
        // Fallback to mock data
        generateFallbackData();
        setLoading(false);
      }
    };

    const generateFallbackData = () => {
      // Your existing mock data generation code here
      const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
      const stockNames = [
        'Apple Inc.',
        'Alphabet Inc.',
        'Microsoft Corp.',
        'Amazon.com Inc.',
        'Tesla Inc.',
        'NVIDIA Corp.',
        'Meta Platforms Inc.',
        'Netflix Inc.'
      ];

      const mockStocks: Stock[] = stockSymbols.map((symbol, index) => ({
        symbol,
        name: stockNames[index],
        price: 100 + Math.random() * 300,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 10000000),
        marketCap: Math.floor(Math.random() * 1000000000000)
      }));

      setStocks(mockStocks);
      // ... rest of mock data setup
    };

    fetchMarketData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { stocks, signals, portfolio, news, loading, error };
};