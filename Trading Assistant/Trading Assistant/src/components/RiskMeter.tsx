import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Portfolio } from '../types/trading';
import { aiTradingService } from '../services/aiService';

interface RiskMeterProps {
  portfolio: Portfolio | null;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ portfolio }) => {
  const riskMetrics = portfolio ? aiTradingService.calculateRiskMetrics(portfolio) : null;
  const riskLevel = riskMetrics?.riskLevel || 65;
  
  const getRiskColor = (level: number) => {
    if (level < 30) return 'text-green-400';
    if (level < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (level: number) => {
    if (level < 30) return 'Low Risk';
    if (level < 70) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2" />
        Risk Assessment
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Portfolio Risk Level</span>
          <span className={`font-bold ${getRiskColor(riskLevel)}`}>
            {getRiskLabel(riskLevel)}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              riskLevel < 30 ? 'bg-green-400' : 
              riskLevel < 70 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${riskLevel}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-gray-400 mb-1">VaR (1 Day)</div>
            <div className="text-white font-medium">
              -${riskMetrics?.var.toFixed(0) || '2,450'}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-gray-400 mb-1">Beta</div>
            <div className="text-white font-medium">
              {riskMetrics?.beta.toFixed(2) || '1.23'}
            </div>
          </div>
        </div>
        
        {riskMetrics?.recommendations && riskMetrics.recommendations.length > 0 && (
          <div className="space-y-2">
            {riskMetrics.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Risk Alert</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};