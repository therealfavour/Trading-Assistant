import axios from 'axios';
import { Stock, MarketNews } from '../types/trading';

// Using Alpha Vantage API (free tier available)
const ALPHA_VANTAGE_API_KEY = 'demo'; // Replace with actual API key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Using Finnhub API (free tier available)
const FINNHUB_API_KEY = 'demo'; // Replace with actual API key
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Using News API (free tier available)
const NEWS_API_KEY = 'demo'; // Replace with actual API key
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export class MarketDataService {
  private static instance: MarketDataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    return this.cache.get(key)?.data;
  }

  async getStockQuote(symbol: string): Promise<Stock | null> {
    const cacheKey = `quote_${symbol}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      // Try Finnhub first (more reliable for real-time data)
      const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
        params: {
          symbol: symbol,
          token: FINNHUB_API_KEY
        }
      });

      if (response.data && response.data.c) {
        const stock: Stock = {
          symbol,
          name: symbol, // We'll get the name from another endpoint
          price: response.data.c,
          change: response.data.d,
          changePercent: response.data.dp,
          volume: 0, // Not provided in this endpoint
          marketCap: 0 // Not provided in this endpoint
        };

        this.setCache(cacheKey, stock);
        return stock;
      }
    } catch (error) {
      console.warn(`Failed to fetch from Finnhub for ${symbol}:`, error);
    }

    // Fallback to Alpha Vantage
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });

      const quote = response.data['Global Quote'];
      if (quote) {
        const stock: Stock = {
          symbol,
          name: symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          marketCap: 0
        };

        this.setCache(cacheKey, stock);
        return stock;
      }
    } catch (error) {
      console.warn(`Failed to fetch from Alpha Vantage for ${symbol}:`, error);
    }

    return null;
  }

  async getMultipleQuotes(symbols: string[]): Promise<Stock[]> {
    const promises = symbols.map(symbol => this.getStockQuote(symbol));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<Stock> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  async getStockProfile(symbol: string): Promise<{ name: string; marketCap: number } | null> {
    const cacheKey = `profile_${symbol}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${FINNHUB_BASE_URL}/stock/profile2`, {
        params: {
          symbol: symbol,
          token: FINNHUB_API_KEY
        }
      });

      if (response.data && response.data.name) {
        const profile = {
          name: response.data.name,
          marketCap: response.data.marketCapitalization || 0
        };

        this.setCache(cacheKey, profile);
        return profile;
      }
    } catch (error) {
      console.warn(`Failed to fetch profile for ${symbol}:`, error);
    }

    return null;
  }

  async getMarketNews(): Promise<MarketNews[]> {
    const cacheKey = 'market_news';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      // Try Finnhub market news first
      const response = await axios.get(`${FINNHUB_BASE_URL}/news`, {
        params: {
          category: 'general',
          token: FINNHUB_API_KEY
        }
      });

      if (response.data && Array.isArray(response.data)) {
        const news: MarketNews[] = response.data.slice(0, 5).map((item: any, index: number) => ({
          id: `${item.id || index}`,
          title: item.headline || 'Market Update',
          summary: item.summary || 'Latest market developments',
          sentiment: this.analyzeSentiment(item.headline + ' ' + item.summary),
          timestamp: new Date(item.datetime * 1000),
          source: item.source || 'Market News'
        }));

        this.setCache(cacheKey, news);
        return news;
      }
    } catch (error) {
      console.warn('Failed to fetch market news:', error);
    }

    // Return mock data if API fails
    return this.getMockNews();
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['up', 'gain', 'rise', 'bull', 'growth', 'profit', 'strong', 'beat', 'surge'];
    const negativeWords = ['down', 'fall', 'drop', 'bear', 'loss', 'weak', 'miss', 'decline', 'crash'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private getMockNews(): MarketNews[] {
    return [
      {
        id: '1',
        title: 'Federal Reserve Signals Potential Rate Cuts',
        summary: 'Fed officials hint at dovish stance amid cooling inflation data',
        sentiment: 'positive',
        timestamp: new Date(),
        source: 'Reuters'
      },
      {
        id: '2',
        title: 'Tech Earnings Season Shows Strong AI Revenue Growth',
        summary: 'Major tech companies report significant AI-driven revenue increases',
        sentiment: 'positive',
        timestamp: new Date(),
        source: 'Bloomberg'
      },
      {
        id: '3',
        title: 'Geopolitical Tensions Rise in Energy Markets',
        summary: 'Oil prices volatile amid supply chain concerns',
        sentiment: 'negative',
        timestamp: new Date(),
        source: 'Financial Times'
      }
    ];
  }

  async getHistoricalData(symbol: string, interval: string = '1min'): Promise<any[]> {
    const cacheKey = `historical_${symbol}_${interval}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: symbol,
          interval: interval,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });

      const timeSeries = response.data[`Time Series (${interval})`];
      if (timeSeries) {
        const data = Object.entries(timeSeries)
          .slice(0, 100) // Last 100 data points
          .map(([timestamp, values]: [string, any]) => ({
            timestamp: new Date(timestamp),
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'])
          }))
          .reverse();

        this.setCache(cacheKey, data);
        return data;
      }
    } catch (error) {
      console.warn(`Failed to fetch historical data for ${symbol}:`, error);
    }

    return [];
  }
}

export const marketDataService = MarketDataService.getInstance();