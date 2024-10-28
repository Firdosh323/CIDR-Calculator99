import React from 'react';
import { useNetworkSettings } from '../context/NetworkSettingsContext';
import { useHistory } from '../context/HistoryContext';
import { Trash2 } from 'lucide-react';

export default function SettingsPanel() {
  const { settings, updateSettings } = useNetworkSettings();
  const { clearHistory } = useHistory();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IP Address Format
            </label>
            <select
              value={settings.displayFormat}
              onChange={(e) => updateSettings({ displayFormat: e.target.value as 'decimal' | 'binary' | 'both' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="decimal">Decimal</option>
              <option value="binary">Binary</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showVisualizer"
              checked={settings.showBinaryVisualizer}
              onChange={(e) => updateSettings({ showBinaryVisualizer: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showVisualizer" className="ml-2 block text-sm text-gray-900">
              Show Binary Visualizer
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <button
          onClick={clearHistory}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </button>
      </div>
    </div>
  );
}