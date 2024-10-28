import React from 'react';
import { useHistory } from '../context/HistoryContext';
import { formatDistanceToNow } from 'date-fns';

export default function IPHistory() {
  const { history } = useHistory();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No calculation history yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Calculation History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hosts</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((entry, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {entry.input}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {entry.result.network}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.result.totalHosts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}