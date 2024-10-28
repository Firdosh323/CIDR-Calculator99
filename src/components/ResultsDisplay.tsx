import React from 'react';
import { CIDRRange } from '../types/network';
import { Copy, CheckCircle } from 'lucide-react';
import IPRangeVisualizer from './IPRangeVisualizer';
import { useNetworkSettings } from '../context/NetworkSettingsContext';
import toast from 'react-hot-toast';

interface ResultsDisplayProps {
  results: CIDRRange;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const { settings } = useNetworkSettings();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const ResultRow = ({ label, value, field }: { label: string; value: string | number; field: string }) => (
    <div className="flex justify-between items-center py-3 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3 -mx-3 transition-colors">
      <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-gray-900 dark:text-gray-100">{value}</span>
        <button
          onClick={() => copyToClipboard(value.toString(), field)}
          className={`p-1.5 rounded-full transition-colors ${
            copiedField === field
              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100'
          }`}
          title="Copy to clipboard"
        >
          {copiedField === field ? (
            <CheckCircle size={16} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Network Information</h3>
        <div className="space-y-1">
          <ResultRow label="Network Address" value={results.network} field="network" />
          <ResultRow label="Broadcast Address" value={results.broadcast} field="broadcast" />
          <ResultRow label="First Host" value={results.firstHost} field="firstHost" />
          <ResultRow label="Last Host" value={results.lastHost} field="lastHost" />
          <ResultRow label="Total Usable Hosts" value={results.totalHosts} field="totalHosts" />
          <ResultRow label="Subnet Mask" value={results.subnetMask} field="subnetMask" />
          <ResultRow label="Wildcard Mask" value={results.wildcardMask} field="wildcardMask" />
          
          {settings.displayFormat === 'both' && (
            <ResultRow label="Binary" value={results.binary} field="binary" />
          )}
        </div>
      </div>

      {settings.showBinaryVisualizer && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
          <IPRangeVisualizer range={results} />
        </div>
      )}
    </div>
  );
}