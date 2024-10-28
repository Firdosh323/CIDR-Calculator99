import React, { useState } from 'react';
import { CIDRRange } from '../types/network';
import { Info } from 'lucide-react';

interface IPRangeVisualizerProps {
  range: CIDRRange;
}

export default function IPRangeVisualizer({ range }: IPRangeVisualizerProps) {
  const [hoveredBit, setHoveredBit] = useState<number | null>(null);
  const segments = range.binary.match(/.{8}/g) || [];
  
  const getColorForOctet = (index: number) => {
    switch(index) {
      case 0: return { bg: 'bg-purple-100', text: 'text-purple-700', hover: 'hover:bg-purple-200' };
      case 1: return { bg: 'bg-red-100', text: 'text-red-700', hover: 'hover:bg-red-200' };
      case 2: return { bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-200' };
      case 3: return { bg: 'bg-yellow-100', text: 'text-yellow-700', hover: 'hover:bg-yellow-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', hover: 'hover:bg-gray-200' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Binary Visualization</h4>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1" />
          Hover over bits for details
        </div>
      </div>

      <div className="space-y-8">
        {segments.map((segment, idx) => {
          const colors = getColorForOctet(idx);
          const decimalValue = parseInt(segment, 2);
          
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-mono ${colors.text}`}>
                  Octet {idx + 1}: {decimalValue}
                </span>
                <span className={`font-mono ${colors.text}`}>
                  {segment}
                </span>
              </div>
              
              <div className="grid grid-cols-8 gap-1">
                {segment.split('').map((bit, bitIdx) => {
                  const globalBitPosition = idx * 8 + bitIdx;
                  const isNetworkBit = globalBitPosition < range.binary.length;
                  
                  return (
                    <div
                      key={bitIdx}
                      className={`
                        relative h-12 rounded-md transition-all duration-200
                        ${bit === '1' ? colors.bg : 'bg-gray-50 border border-gray-200'}
                        ${colors.hover} cursor-pointer
                      `}
                      onMouseEnter={() => setHoveredBit(globalBitPosition)}
                      onMouseLeave={() => setHoveredBit(null)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-lg">
                        {bit}
                      </div>
                      
                      {hoveredBit === globalBitPosition && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                          <div className={`${colors.bg} text-sm rounded-lg shadow-lg p-2 whitespace-nowrap`}>
                            <div>Position: {globalBitPosition + 1}</div>
                            <div>Value: {Math.pow(2, 7 - bitIdx)}</div>
                            <div>{isNetworkBit ? 'Network Bit' : 'Host Bit'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Legend</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">0 (Off)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm text-gray-600">1 (On)</span>
          </div>
        </div>
      </div>
    </div>
  );
}