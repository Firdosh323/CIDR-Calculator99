export interface IPAddress {
  address: string;
  binary: string;
  region?: string;
}

export interface CIDRRange {
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binary: string;
  region?: string;
  usage?: number;
  lastAccessed?: Date;
}

export interface BatchResult {
  cidr: string;
  range: CIDRRange;
}

export interface SubnetRequirement {
  hosts: number;
  name: string;
  region?: string;
  purpose?: string;
}

export interface SubnetAllocation extends CIDRRange {
  name: string;
  prefix: number;
  conflicts?: string[];
  usage?: number;
}

export interface NetworkTemplate {
  id: string;
  name: string;
  description: string;
  baseNetwork: string;
  subnets: SubnetRequirement[];
  provider?: 'aws' | 'azure' | 'gcp';
  region?: string;
}

export interface UsageMetrics {
  cidr: string;
  accessCount: number;
  lastAccessed: Date;
  region?: string;
}

export interface AuditLogEntry {
  timestamp: Date;
  action: 'create' | 'modify' | 'delete' | 'access';
  cidr: string;
  user?: string;
  region?: string;
  details?: any;
}

export interface ExportFormat {
  type: 'csv' | 'json' | 'yaml';
  includeMetrics?: boolean;
  includeHistory?: boolean;
}

export interface CloudProviderConfig {
  provider: 'aws' | 'azure' | 'gcp';
  region: string;
  credentials?: {
    accessKey?: string;
    secretKey?: string;
    token?: string;
  };
}