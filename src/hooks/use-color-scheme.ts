import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

let colorSchemeOverride: 'light' | 'dark' | null = null;
const listeners = new Set<() => void>();

export function setColorSchemeOverride(value: 'light' | 'dark' | null) {
  colorSchemeOverride = value;
  listeners.forEach((cb) => cb());
}

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const [scheme, setScheme] = useState<'light' | 'dark'>(
    (colorSchemeOverride || systemColorScheme || 'light') as 'light' | 'dark'
  );

  useEffect(() => {
    const update = () => {
      setScheme((colorSchemeOverride || systemColorScheme || 'light') as 'light' | 'dark');
    };

    listeners.add(update);
    // Also respond to system theme changes
    update();

    return () => {
      listeners.delete(update);
    };
  }, [systemColorScheme]);

  return scheme;
}
