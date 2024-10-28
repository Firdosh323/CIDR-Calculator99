import React, { createContext, useContext, useState } from 'react';

interface NetworkSettings {
  displayFormat: 'decimal' | 'binary' | 'both';
  showBinaryVisualizer: boolean;
}

interface NetworkSettingsContextType {
  settings: NetworkSettings;
  updateSettings: (newSettings: Partial<NetworkSettings>) => void;
}

const defaultSettings: NetworkSettings = {
  displayFormat: 'decimal',
  showBinaryVisualizer: true,
};

const NetworkSettingsContext = createContext<NetworkSettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function NetworkSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NetworkSettings>(() => {
    const saved = localStorage.getItem('networkSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<NetworkSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('networkSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <NetworkSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </NetworkSettingsContext.Provider>
  );
}

export const useNetworkSettings = () => useContext(NetworkSettingsContext);