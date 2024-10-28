export const ipToBinary = (ip: string): string => {
  return ip
    .split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
    .join('');
};

export const binaryToIp = (binary: string): string => {
  return binary
    .match(/.{8}/g)!
    .map(byte => parseInt(byte, 2))
    .join('.');
};

export const calculateCIDRRange = (ip: string, prefix: number) => {
  const binary = ipToBinary(ip);
  const totalBits = 32;
  const hostBits = totalBits - prefix;
  const totalHosts = Math.pow(2, hostBits) - 2;

  // Network address (first address)
  const networkBinary = binary.substring(0, prefix).padEnd(32, '0');
  const network = binaryToIp(networkBinary);

  // Broadcast address (last address)
  const broadcastBinary = binary.substring(0, prefix).padEnd(32, '1');
  const broadcast = binaryToIp(broadcastBinary);

  // First usable host
  const firstHostBinary = networkBinary.substring(0, 31) + '1';
  const firstHost = binaryToIp(firstHostBinary);

  // Last usable host
  const lastHostBinary = broadcastBinary.substring(0, 31) + '0';
  const lastHost = binaryToIp(lastHostBinary);

  // Subnet mask
  const subnetMaskBinary = '1'.repeat(prefix).padEnd(32, '0');
  const subnetMask = binaryToIp(subnetMaskBinary);

  // Wildcard mask
  const wildcardMaskBinary = '0'.repeat(prefix).padEnd(32, '1');
  const wildcardMask = binaryToIp(wildcardMaskBinary);

  return {
    network,
    broadcast,
    firstHost,
    lastHost,
    totalHosts: totalHosts > 0 ? totalHosts : 0,
    subnetMask,
    wildcardMask,
    binary: networkBinary
  };
};

export const isValidIP = (ip: string): boolean => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
};

export const isValidCIDR = (prefix: number): boolean => {
  return prefix >= 0 && prefix <= 32;
};