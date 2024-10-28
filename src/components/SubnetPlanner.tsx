import React, { useState } from 'react';
import { calculateCIDRRange } from '../utils/ipCalculator';
import { CIDRRange } from '../types/network';

export default function SubnetPlanner() {
  const [baseNetwork, setBaseNetwork] = useState('');
  const [requiredSubnets, setRequiredSubnets] = useState<number[]>([]);
  const [subnets, setSubnets] = useState<CIDRRange[]>([]);

  const calculateSubnets = () => {
    const [ip, prefix] = baseNetwork.split('/');
    const basePrefix = parseInt(prefix);
    
    // Sort required subnets by size (descending)
    const sortedSizes = [...requiredSubnets].sort((a, b) => b - a);
    
    let currentIp = ip;
    const newSubnets: CIDRRange[] = [];

    sortedSizes.forEach(size => {
      const hostsNeeded = size + 2; // Add 2 for network and broadcast addresses
      const subnetPrefix = 32 - Math.ceil(Math.log2(hostsNeeded));
      
      if (subnetPrefix < basePrefix) {
        return; // Skip if subnet is larger than base network
      }

      const subnet = calculateCIDRRange(currentIp, subnetPrefix);
      newSubnets.push(subnet);

      // Calculate next available IP
      const parts = currentIp.split('.');
      parts[3] = (parseInt(parts[3]) + Math.pow(2, 32 - subnetPrefix)).toString();
      currentIp = parts.join('.');
    });

    setSubnets(newSubnets);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl font-semibold mb-4">Subnet Planner</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base Network (CIDR)</label>
            <input
              type="text"
              value={baseNetwork}
              onChange={(e) => setBaseNetwork(e.target.value)}
              placeholder="192.168.0.0/24"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Required Host Counts</label>
            <input
              type="text"
              placeholder="50,20,10"
              onChange={(e) => setRequiredSubnets(e.target.value.split(',').map(Number))}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={calculateSubnets}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Calculate Subnets
          </button>
        </div>
      </div>

      {subnets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prefix
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usable Hosts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subnets.map((subnet, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono">
                    {subnet.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    /{32 - Math.log2(subnet.totalHosts + 2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subnet.totalHosts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}