import type { CIDRRange } from '../types/network';
import { ipToBinary } from './ipCalculator';

export function detectConflicts(networks: CIDRRange[]): Map<string, string[]> {
  const conflicts = new Map<string, string[]>();

  for (let i = 0; i < networks.length; i++) {
    const network1 = networks[i];
    const binary1 = ipToBinary(network1.network);
    const prefix1 = parseInt(network1.subnetMask.split('/')[1]);

    for (let j = i + 1; j < networks.length; j++) {
      const network2 = networks[j];
      const binary2 = ipToBinary(network2.network);
      const prefix2 = parseInt(network2.subnetMask.split('/')[1]);

      // Check if networks overlap
      const minPrefix = Math.min(prefix1, prefix2);
      const network1Prefix = binary1.substring(0, minPrefix);
      const network2Prefix = binary2.substring(0, minPrefix);

      if (network1Prefix === network2Prefix) {
        // Networks overlap
        const existing1 = conflicts.get(network1.network) || [];
        const existing2 = conflicts.get(network2.network) || [];

        conflicts.set(network1.network, [...existing1, network2.network]);
        conflicts.set(network2.network, [...existing2, network1.network]);
      }
    }
  }

  return conflicts;
}

export function isIPInRange(ip: string, range: CIDRRange): boolean {
  const ipBinary = ipToBinary(ip);
  const networkBinary = ipToBinary(range.network);
  const prefix = parseInt(range.subnetMask.split('/')[1]);

  const ipNetwork = ipBinary.substring(0, prefix);
  const rangeNetwork = networkBinary.substring(0, prefix);

  return ipNetwork === rangeNetwork;
}

export function findOverlappingNetworks(network: CIDRRange, existingNetworks: CIDRRange[]): CIDRRange[] {
  return existingNetworks.filter(existing => {
    const networkBinary = ipToBinary(network.network);
    const existingBinary = ipToBinary(existing.network);
    const networkPrefix = parseInt(network.subnetMask.split('/')[1]);
    const existingPrefix = parseInt(existing.subnetMask.split('/')[1]);

    const minPrefix = Math.min(networkPrefix, existingPrefix);
    const network1Prefix = networkBinary.substring(0, minPrefix);
    const network2Prefix = existingBinary.substring(0, minPrefix);

    return network1Prefix === network2Prefix;
  });
}