export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface AISignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  createdAt: Date;
}

export interface Portfolio {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  positions: Position[];
}

export interface Position {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface MarketNews {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  source: string;
}