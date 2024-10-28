import type { CIDRRange, ExportFormat } from '../types/network';
import { networkAnalytics } from './networkAnalytics';

export async function exportNetworks(networks: CIDRRange[], format: ExportFormat): Promise<string> {
  switch (format.type) {
    case 'csv':
      return exportToCSV(networks, format);
    case 'json':
      return exportToJSON(networks, format);
    case 'yaml':
      return exportToYAML(networks, format);
    default:
      throw new Error(`Unsupported export format: ${format.type}`);
  }
}

function exportToCSV(networks: CIDRRange[], format: ExportFormat): string {
  const headers = ['Network', 'Broadcast', 'First Host', 'Last Host', 'Total Hosts', 'Subnet Mask'];
  
  if (format.includeMetrics) {
    headers.push('Usage Count', 'Last Accessed');
  }

  const rows = networks.map(network => {
    const metrics = format.includeMetrics ? networkAnalytics.getMetrics().find(m => m.cidr === network.network) : null;
    
    const row = [
      network.network,
      network.broadcast,
      network.firstHost,
      network.lastHost,
      network.totalHosts.toString(),
      network.subnetMask
    ];

    if (format.includeMetrics && metrics) {
      row.push(
        metrics.accessCount.toString(),
        metrics.lastAccessed.toISOString()
      );
    }

    return row.join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function exportToJSON(networks: CIDRRange[], format: ExportFormat): string {
  const data = networks.map(network => {
    const result: any = { ...network };

    if (format.includeMetrics) {
      const metrics = networkAnalytics.getMetrics().find(m => m.cidr === network.network);
      if (metrics) {
        result.metrics = metrics;
      }
    }

    if (format.includeHistory) {
      const history = networkAnalytics.getAuditLog().filter(entry => entry.cidr === network.network);
      if (history.length > 0) {
        result.history = history;
      }
    }

    return result;
  });

  return JSON.stringify(data, null, 2);
}

function exportToYAML(networks: CIDRRange[], format: ExportFormat): string {
  const jsonData = JSON.parse(exportToJSON(networks, format));
  return convertToYAML(jsonData);
}

function convertToYAML(obj: any, indent: number = 0): string {
  if (typeof obj !== 'object' || obj === null) {
    return JSON.stringify(obj);
  }

  const spaces = ' '.repeat(indent);
  let yaml = '';

  if (Array.isArray(obj)) {
    return obj.map(item => `${spaces}- ${convertToYAML(item, indent + 2)}`).join('\n');
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      yaml += `${spaces}${key}:\n${convertToYAML(value, indent + 2)}`;
    } else {
      yaml += `${spaces}${key}: ${convertToYAML(value)}\n`;
    }
  }

  return yaml;
}