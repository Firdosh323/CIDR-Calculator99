import type { CIDRRange, UsageMetrics, AuditLogEntry } from '../types/network';

class NetworkAnalytics {
  private static instance: NetworkAnalytics;
  private metrics: Map<string, UsageMetrics> = new Map();
  private auditLog: AuditLogEntry[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): NetworkAnalytics {
    if (!NetworkAnalytics.instance) {
      NetworkAnalytics.instance = new NetworkAnalytics();
    }
    return NetworkAnalytics.instance;
  }

  private loadFromStorage() {
    try {
      const savedMetrics = localStorage.getItem('networkMetrics');
      const savedAuditLog = localStorage.getItem('networkAuditLog');
      
      if (savedMetrics) {
        const metricsData = JSON.parse(savedMetrics);
        this.metrics = new Map(Object.entries(metricsData));
      }
      
      if (savedAuditLog) {
        this.auditLog = JSON.parse(savedAuditLog);
      }
    } catch (error) {
      console.error('Error loading network analytics:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('networkMetrics', JSON.stringify(Object.fromEntries(this.metrics)));
      localStorage.setItem('networkAuditLog', JSON.stringify(this.auditLog));
    } catch (error) {
      console.error('Error saving network analytics:', error);
    }
  }

  trackUsage(cidr: string, region?: string) {
    const existing = this.metrics.get(cidr) || {
      cidr,
      accessCount: 0,
      lastAccessed: new Date(),
      region
    };

    existing.accessCount++;
    existing.lastAccessed = new Date();
    this.metrics.set(cidr, existing);
    this.saveToStorage();
  }

  logAudit(entry: Omit<AuditLogEntry, 'timestamp'>) {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date()
    };
    this.auditLog.unshift(logEntry);
    this.auditLog = this.auditLog.slice(0, 1000); // Keep last 1000 entries
    this.saveToStorage();
  }

  getMetrics(): UsageMetrics[] {
    return Array.from(this.metrics.values());
  }

  getAuditLog(): AuditLogEntry[] {
    return this.auditLog;
  }

  getMostUsedNetworks(limit: number = 10): UsageMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  getRecentActivity(limit: number = 10): UsageMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
      .slice(0, limit);
  }

  clearMetrics() {
    this.metrics.clear();
    this.saveToStorage();
  }
}

export const networkAnalytics = NetworkAnalytics.getInstance();