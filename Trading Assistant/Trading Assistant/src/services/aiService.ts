import { AISignal, Stock } from '../types/trading';

export class AITradingService {
  private static instance: AITradingService;

  static getInstance(): AITradingService {
    if (!AITradingService.instance) {
      AITradingService.instance = new AITradingService();
    }
    return AITradingService.instance;
  }

  async generateSignals(stocks: Stock[]): Promise<AISignal[]> {
    // Simulate AI analysis with realistic logic
    const signals: AISignal[] = [];

    for (const stock of stocks.slice(0, 3)) { // Generate signals for top 3 stocks
      const signal = this.analyzeStock(stock);
      if (signal) {
        signals.push(signal);
      }
    }

    return signals;
  }

  private analyzeStock(stock: Stock): AISignal | null {
    // Simulate AI analysis based on price movement and volatility
    const volatility = Math.abs(stock.changePercent);
    const momentum = stock.changePercent;
    
    let type: 'BUY' | 'SELL' | 'HOLD';
    let confidence: number;
    let reasoning: string;
    let targetPrice: number;
    let stopLoss: number;

    // Simple momentum-based strategy
    if (momentum > 2 && volatility < 5) {
      type = 'BUY';
      confidence = Math.min(0.9, 0.6 + (momentum / 10));
      reasoning = `Strong upward momentum (+${momentum.toFixed(2)}%) with controlled volatility. Technical indicators suggest continued strength with RSI in favorable territory.`;
      targetPrice = stock.price * 1.08;
      stopLoss = stock.price * 0.95;
    } else if (momentum < -2 && volatility > 3) {
      type = 'SELL';
      confidence = Math.min(0.85, 0.6 + (Math.abs(momentum) / 15));
      reasoning = `Negative momentum (${momentum.toFixed(2)}%) with high volatility signals potential further decline. Support levels appear weak.`;
      targetPrice = stock.price * 0.92;
      stopLoss = stock.price * 1.05;
    } else if (Math.abs(momentum) < 1) {
      type = 'HOLD';
      confidence = 0.7;
      reasoning = `Consolidation phase with low volatility. Waiting for clearer directional signals before taking action.`;
      targetPrice = stock.price * 1.03;
      stopLoss = stock.price * 0.97;
    } else {
      return null; // No clear signal
    }

    return {
      id: `signal_${stock.symbol}_${Date.now()}`,
      symbol: stock.symbol,
      type,
      confidence,
      reasoning,
      targetPrice,
      stopLoss,
      timeframe: this.getTimeframe(confidence),
      createdAt: new Date()
    };
  }

  private getTimeframe(confidence: number): string {
    if (confidence > 0.8) return '1-2 weeks';
    if (confidence > 0.7) return '2-4 weeks';
    return '1-2 months';
  }

  calculateRiskMetrics(portfolio: any): {
    riskLevel: number;
    var: number;
    beta: number;
    recommendations: string[];
  } {
    // Simulate risk calculation
    const positions = portfolio?.positions || [];
    const totalValue = portfolio?.totalValue || 0;
    
    // Calculate concentration risk
    const concentrationRisk = positions.length > 0 
      ? Math.max(...positions.map((p: any) => p.value / totalValue)) * 100
      : 0;
    
    // Calculate sector concentration (simplified)
    const techStocks = positions.filter((p: any) => 
      ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'].includes(p.symbol)
    );
    const techConcentration = techStocks.reduce((sum: number, p: any) => sum + p.value, 0) / totalValue * 100;
    
    // Calculate overall risk level
    const riskLevel = Math.min(100, concentrationRisk + (techConcentration * 0.5));
    
    // Calculate VaR (simplified)
    const var95 = totalValue * 0.02; // 2% of portfolio value
    
    // Calculate beta (simplified)
    const beta = 1 + (riskLevel - 50) / 100;
    
    const recommendations: string[] = [];
    if (concentrationRisk > 20) {
      recommendations.push('Consider reducing position concentration');
    }
    if (techConcentration > 60) {
      recommendations.push('High tech sector exposure - consider diversification');
    }
    if (riskLevel > 70) {
      recommendations.push('Overall risk level is high - review position sizes');
    }

    return {
      riskLevel,
      var: var95,
      beta,
      recommendations
    };
  }
}

export const aiTradingService = AITradingService.getInstance();