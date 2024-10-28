import React from 'react';
import { BarChart2, Clock, TrendingUp } from 'lucide-react';
import { networkAnalytics } from '../utils/networkAnalytics';
import { formatDistanceToNow } from 'date-fns';

export default function AnalyticsPanel() {
  const mostUsed = networkAnalytics.getMostUsedNetworks(5);
  const recentActivity = networkAnalytics.getRecentActivity(5);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Most Used Networks
        </h3>
        <div className="space-y-4">
          {mostUsed.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-mono text-sm">{metric.cidr}</span>
              <span className="text-sm text-gray-500">
                {metric.accessCount} queries
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-mono text-sm">{metric.cidr}</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(metric.lastAccessed), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-500" />
          Usage Trends
        </h3>
        <div className="h-64">
          {/* Add a chart visualization here */}
        </div>
      </div>
    </div>
  );
}