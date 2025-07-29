import React from 'react';
import { Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketNews } from '../types/trading';

interface NewsWidgetProps {
  news: MarketNews[];
}

export const NewsWidget: React.FC<NewsWidgetProps> = ({ news }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-400/30 bg-green-400/5';
      case 'negative': return 'border-red-400/30 bg-red-400/5';
      default: return 'border-gray-400/30 bg-gray-400/5';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Newspaper className="h-5 w-5 mr-2" />
        Market News
      </h2>
      
      <div className="space-y-4">
        {news.map((article) => (
          <div key={article.id} className={`border rounded-lg p-4 ${getSentimentColor(article.sentiment)}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium text-sm leading-tight flex-1 mr-2">
                {article.title}
              </h3>
              {getSentimentIcon(article.sentiment)}
            </div>
            <p className="text-gray-300 text-sm mb-3">{article.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{article.source}</span>
              <span>{article.timestamp.toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};