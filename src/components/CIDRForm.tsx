import React, { useState } from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { isValidIP, isValidCIDR } from '../utils/ipCalculator';
import toast from 'react-hot-toast';

interface CIDRFormProps {
  onCalculate: (ip: string, prefix: number) => void;
}

export default function CIDRForm({ onCalculate }: CIDRFormProps) {
  const [ip, setIp] = useState('192.168.1.0');
  const [prefix, setPrefix] = useState('24');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidIP(ip)) {
      setError('Invalid IP address format');
      toast.error('Invalid IP address format');
      return;
    }

    const prefixNum = parseInt(prefix);
    if (!isValidCIDR(prefixNum)) {
      setError('CIDR prefix must be between 0 and 32');
      toast.error('CIDR prefix must be between 0 and 32');
      return;
    }

    onCalculate(ip, prefixNum);
    toast.success('CIDR calculation completed');
  };

  const commonNetworks = [
    { cidr: '10.0.0.0/8', name: 'Private Network (Class A)' },
    { cidr: '172.16.0.0/12', name: 'Private Network (Class B)' },
    { cidr: '192.168.0.0/16', name: 'Private Network (Class C)' },
    { cidr: '127.0.0.0/8', name: 'Localhost' },
  ];

  const applyCommonNetwork = (network: string) => {
    const [networkIp, networkPrefix] = network.split('/');
    setIp(networkIp);
    setPrefix(networkPrefix);
    toast.success(`Applied ${network}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="ip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          IP Address
        </label>
        <input
          type="text"
          id="ip"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="192.168.1.0"
        />
      </div>

      <div>
        <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          CIDR Prefix
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            min="0"
            max="32"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Info size={16} className="text-gray-400 dark:text-gray-500" />
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-md text-sm text-blue-700 dark:text-blue-300">
          <h4 className="font-medium mb-2">Common CIDR Prefixes:</h4>
          <ul className="space-y-1">
            <li>/32 - Single IP</li>
            <li>/24 - 256 IPs (255.255.255.0)</li>
            <li>/16 - 65,536 IPs (255.255.0.0)</li>
            <li>/8 - 16,777,216 IPs (255.0.0.0)</li>
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Common Networks
        </label>
        <div className="flex flex-wrap gap-2">
          {commonNetworks.map((network) => (
            <button
              key={network.cidr}
              type="button"
              onClick={() => applyCommonNetwork(network.cidr)}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {network.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Calculate
      </button>
    </form>
  );
}