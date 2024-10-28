import React, { useState } from 'react';
import { calculateCIDRRange, isValidIP, isValidCIDR } from '../utils/ipCalculator';
import { BatchResult } from '../types/network';
import { Download } from 'lucide-react';

export default function BatchProcessor() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<BatchResult[]>([]);
  const [error, setError] = useState('');

  const processBatch = () => {
    setError('');
    const lines = input.split('\n').filter(line => line.trim());
    const newResults: BatchResult[] = [];

    for (const line of lines) {
      const [ip, prefixStr] = line.split('/');
      const prefix = parseInt(prefixStr);

      if (!ip || !prefixStr || !isValidIP(ip.trim()) || !isValidCIDR(prefix)) {
        setError(`Invalid entry: ${line}`);
        return;
      }

      newResults.push({
        cidr: line.trim(),
        range: calculateCIDRRange(ip.trim(), prefix)
      });
    }

    setResults(newResults);
  };

  const exportCSV = () => {
    const headers = ['CIDR', 'Network', 'Broadcast', 'First Host', 'Last Host', 'Total Hosts', 'Subnet Mask'];
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.cidr,
        r.range.network,
        r.range.broadcast,
        r.range.firstHost,
        r.range.lastHost,
        r.range.totalHosts,
        r.range.subnetMask
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cidr-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter multiple CIDRs (one per line)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/16"
          className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex gap-2">
        <button
          onClick={processBatch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Process Batch
        </button>
        {results.length > 0 && (
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Batch Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIDR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broadcast</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hosts</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{result.cidr}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{result.range.network}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{result.range.broadcast}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.range.totalHosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}