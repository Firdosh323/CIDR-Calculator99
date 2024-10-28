import { describe, it, expect } from 'vitest';
import { ipToBinary, binaryToIp, calculateCIDRRange, isValidIP, isValidCIDR } from '../ipCalculator';

describe('IP Calculator Utils', () => {
  describe('ipToBinary', () => {
    it('converts IP to binary correctly', () => {
      expect(ipToBinary('192.168.1.1')).toBe('11000000101010000000000100000001');
    });
  });

  describe('binaryToIp', () => {
    it('converts binary to IP correctly', () => {
      expect(binaryToIp('11000000101010000000000100000001')).toBe('192.168.1.1');
    });
  });

  describe('calculateCIDRRange', () => {
    it('calculates CIDR range correctly for /24', () => {
      const result = calculateCIDRRange('192.168.1.0', 24);
      expect(result.network).toBe('192.168.1.0');
      expect(result.broadcast).toBe('192.168.1.255');
      expect(result.totalHosts).toBe(254);
    });
  });

  describe('isValidIP', () => {
    it('validates correct IP addresses', () => {
      expect(isValidIP('192.168.1.1')).toBe(true);
      expect(isValidIP('256.1.2.3')).toBe(false);
      expect(isValidIP('1.2.3.4.5')).toBe(false);
    });
  });

  describe('isValidCIDR', () => {
    it('validates CIDR prefixes', () => {
      expect(isValidCIDR(24)).toBe(true);
      expect(isValidCIDR(33)).toBe(false);
      expect(isValidCIDR(-1)).toBe(false);
    });
  });
});