import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

let colorSchemeOverride: 'light' | 'dark' | null = null;
const listeners = new Set<() => void>();

export function setColorSchemeOverride(value: 'light' | 'dark' | null) {
  colorSchemeOverride = value;
  listeners.forEach((cb) => cb());
}


export function useColorScheme(): 'light' |'dark' {
  return 'light';
}
