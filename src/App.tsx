import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import CIDRForm from './components/CIDRForm';
import ResultsDisplay from './components/ResultsDisplay';
import BatchProcessor from './components/BatchProcessor';
import SubnetPlanner from './components/SubnetPlanner';
import NetworkTools from './components/NetworkTools';
import IPHistory from './components/IPHistory';
import SettingsPanel from './components/Settings';
import Documentation from './components/Documentation';
import Navigation from './components/Navigation';
import { calculateCIDRRange } from './utils/ipCalculator';
import type { CIDRRange } from './types/network';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import { NetworkSettingsProvider } from './context/NetworkSettingsContext';
import { useHistory } from './context/HistoryContext';

type Tab = 'calculator' | 'batch' | 'planner' | 'tools' | 'history' | 'settings' | 'docs';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [results, setResults] = useState<CIDRRange | null>(null);
  const { addToHistory } = useHistory();

  const handleCalculate = (ip: string, prefix: number) => {
    const range = calculateCIDRRange(ip, prefix);
    setResults(range);
    addToHistory(`${ip}/${prefix}`, range);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <CIDRForm onCalculate={handleCalculate} />
              </div>
              <div>{results && <ResultsDisplay results={results} />}</div>
            </div>
          )}
          {activeTab === 'batch' && <BatchProcessor />}
          {activeTab === 'planner' && <SubnetPlanner />}
          {activeTab === 'tools' && <NetworkTools />}
          {activeTab === 'history' && <IPHistory />}
          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'docs' && <Documentation />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <NetworkSettingsProvider>
          <AppContent />
        </NetworkSettingsProvider>
      </HistoryProvider>
    </ThemeProvider>
  );
}