/**
 * Examples of using Option type in our codebase
 * These show how to refactor existing code to use functional programming patterns
 */

import { Option } from './Option';

// Example 1: Safe property access
export function getNestedProperty<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): Option<T[K]> {
  return Option.ofNullable(obj).map(o => o[key]);
}

// Example 2: Safe array operations
export function safeArrayFirst<T>(array: T[] | null | undefined): Option<T> {
  return Option.ofNullable(array)
    .filter(arr => arr.length > 0)
    .map(arr => arr[0]);
}

// Example 3: Safe API response handling
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export function safeApiResponse<T>(response: ApiResponse<T>): Option<T> {
  return Option.ofNullable(response)
    .filter(r => r.status >= 200 && r.status < 300)
    .flatMap(r => Option.ofNullable(r.data));
}

// Example 4: Form validation with Option
export interface FormField {
  value: string;
  error?: string;
}

export function validateEmail(email: string): Option<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Option.of(email)
    .filter(e => e.trim().length > 0)
    .filter(e => emailRegex.test(e))
    .map(e => e.trim().toLowerCase());
}

export function validateRequired(value: string): Option<string> {
  return Option.of(value)
    .filter(v => v.trim().length > 0)
    .map(v => v.trim());
}

// Example 5: Database operations with Option
export interface User {
  id: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export function getUserDisplayName(user: User | null | undefined): Option<string> {
  return Option.ofNullable(user)
    .flatMap(u => Option.ofNullable(u.profile))
    .map(profile => `${profile.firstName} ${profile.lastName}`)
    .or(
      Option.ofNullable(user)
        .flatMap(u => Option.ofNullable(u.email))
    )
    .or(Option.of('Unknown User'));
}

// Example 6: Safe parsing operations
export function safeParseInt(value: string | null | undefined): Option<number> {
  return Option.ofNullable(value)
    .filter(v => !isNaN(Number(v)))
    .map(v => parseInt(v, 10))
    .filter(n => !isNaN(n));
}

export function safeParseFloat(value: string | null | undefined): Option<number> {
  return Option.ofNullable(value)
    .filter(v => !isNaN(Number(v)))
    .map(v => parseFloat(v))
    .filter(n => !isNaN(n));
}

// Example 7: Chaining operations
export function processUserInput(input: string | null | undefined): Option<{
  processed: string;
  length: number;
  words: number;
}> {
  return Option.ofNullable(input)
    .map(i => i.trim())
    .filter(i => i.length > 0)
    .map(i => ({
      processed: i,
      length: i.length,
      words: i.split(/\s+/).length
    }));
}

// Example 8: Error handling with Option
export function safeAsyncOperation<T>(
  operation: () => Promise<T>
): Promise<Option<T>> {
  return Option.fromPromise(operation());
}

// Example 9: Configuration with defaults
export interface AppConfig {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

export function getConfigValue<K extends keyof AppConfig>(
  config: AppConfig | null | undefined,
  key: K,
  defaultValue: NonNullable<AppConfig[K]>
): NonNullable<AppConfig[K]> {
  return Option.ofNullable(config)
    .flatMap(c => Option.ofNullable(c[key]))
    .orElse(defaultValue);
}

// Example 10: File operations
export function getFileExtension(filename: string | null | undefined): Option<string> {
  return Option.ofNullable(filename)
    .filter(f => f.includes('.'))
    .map(f => f.split('.').pop()?.toLowerCase())
    .filter(ext => ext && ext.length > 0);
}
