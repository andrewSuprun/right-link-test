import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const capitalizeWords = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());
