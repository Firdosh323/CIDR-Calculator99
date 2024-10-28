import React, { useState } from 'react';
import { Globe, Wifi, Loader2, Share2, BarChart2, Zap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function NetworkTools() {
  const [pingTarget, setPingTarget] = useState('');
  const [dnsTarget, setDnsTarget] = useState('');
  const [dnsResults, setDnsResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const handleDNSLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(`https://dns.google/resolve?name=${dnsTarget}`);
      setDnsResults(response.data);
      toast.success('DNS lookup completed successfully');
    } catch (error) {
      toast.error('Failed to perform DNS lookup');
      console.error('DNS lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectivityTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const response = await axios.get(`https://dns.google/resolve?name=${pingTarget}`);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      setLatencyHistory(prev => [...prev, latency].slice(-10));
      
      if (response.status === 200) {
        toast.success(`Target is reachable (${latency}ms)`);
      } else {
        toast.error('Target is not reachable');
      }
    } catch (error) {
      toast.error('Failed to reach target');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring && pingTarget) {
      const interval = setInterval(() => {
        handleConnectivityTest(new Event('submit') as any);
      }, 5000);
      return () => clearInterval(interval);
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-green-500';
    if (latency < 200) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark-text">
            <Wifi className="h-5 w-5 text-blue-500" />
            Network Connectivity Test
          </h3>
          <form onSubmit={handleConnectivityTest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark-text">
                Target Host
              </label>
              <input
                type="text"
                value={pingTarget}
                onChange={(e) => setPingTarget(e.target.value)}
                placeholder="example.com"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus-ring"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus-ring flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Zap className="h-5 w-5 mr-2" />}
                Test Connectivity
              </button>
              <button
                type="button"
                onClick={toggleMonitoring}
                className={`px-4 rounded-lg focus-ring ${
                  isMonitoring 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <BarChart2 className="h-5 w-5" />
              </button>
            </div>
          </form>

          {latencyHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 dark-text">Latency History</h4>
              <div className="flex items-end space-x-1 h-24">
                {latencyHistory.map((latency, index) => (
                  <div
                    key={index}
                    className="flex-1 relative group"
                    style={{ height: `${(latency / 500) * 100}%` }}
                  >
                    <div
                      className={`w-full ${getLatencyColor(latency)} bg-current rounded-t`}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                      <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                        {latency}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark-text">
            <Globe className="h-5 w-5 text-blue-500" />
            DNS Lookup
          </h3>
          <form onSubmit={handleDNSLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark-text">
                Domain Name
              </label>
              <input
                type="text"
                value={dnsTarget}
                onChange={(e) => setDnsTarget(e.target.value)}
                placeholder="example.com"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus-ring"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus-ring flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Share2 className="h-5 w-5 mr-2" />}
                Lookup DNS
              </button>
            </div>
          </form>

          {dnsResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <h4 className="text-sm font-medium mb-2 dark-text">Results:</h4>
              <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-x-auto">
                {JSON.stringify(dnsResults, null, 2)}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4 dark-text">Network Tools Pro Features</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Real-time Monitoring',
              description: 'Monitor network latency and performance in real-time',
              icon: BarChart2,
            },
            {
              title: 'Batch DNS Lookup',
              description: 'Look up multiple domains at once',
              icon: Share2,
            },
            {
              title: 'Performance Analytics',
              description: 'Detailed network performance metrics and trends',
              icon: Zap,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <feature.icon className="h-6 w-6 text-blue-500 mb-2" />
              <h4 className="font-medium mb-1 dark-text">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}