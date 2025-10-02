# Option Pattern Implementation Guide

## Overview

This project now includes a modern `Option` type implementation inspired by JavaFX's `Optional` class. The Option pattern provides a functional approach to handling nullable values, making code more robust and expressive.

## Why Use Option?

### Problems with Traditional Null Handling

```typescript
// ❌ Traditional approach - prone to null reference errors
function getUserName(user: User | null): string {
  if (user && user.profile && user.profile.firstName) {
    return user.profile.firstName;
  }
  return 'Unknown';
}

// ❌ Complex nested checks
function getTaskAssignee(task: Task | null): string {
  if (task && task.assignee && task.assignee.profile) {
    const profile = task.assignee.profile;
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
  }
  return 'Unassigned';
}
```

### Benefits of Option Pattern

```typescript
// ✅ Clean, functional approach
function getUserName(user: User | null): string {
  return Option.ofNullable(user)
    .flatMap(u => Option.ofNullable(u.profile))
    .map(profile => profile.firstName)
    .orElse('Unknown');
}

// ✅ Chainable operations
function getTaskAssignee(task: Task | null): string {
  return Option.ofNullable(task)
    .flatMap(t => Option.ofNullable(t.assignee))
    .flatMap(a => Option.ofNullable(a.profile))
    .map(profile => `${profile.firstName} ${profile.lastName}`)
    .orElse('Unassigned');
}
```

## Core API

### Creating Options

```typescript
import { Option } from '@/lib/Option';

// Create from a value (null/undefined becomes None)
const someValue = Option.of('hello');        // Some('hello')
const nullValue = Option.of(null);           // None

// Create from nullable value
const maybeValue = Option.ofNullable(user?.name);  // Some(name) or None

// Create empty option
const empty = Option.empty<string>();        // None

// Create from function that might throw
const safeValue = Option.try(() => JSON.parse(jsonString));

// Create from Promise
const asyncValue = await Option.fromPromise(fetchUserData());
```

### Working with Options

```typescript
const userOption = Option.ofNullable(user);

// Check if value exists
if (userOption.isPresent()) {
  console.log('User exists');
}

// Get value or default
const name = userOption.orElse('Anonymous');

// Get value or compute default
const displayName = userOption
  .map(u => u.name)
  .orElseGet(() => 'User' + Math.random());

// Transform values
const upperName = userOption
  .map(u => u.name)
  .map(name => name.toUpperCase());

// Chain operations
const initials = userOption
  .flatMap(u => Option.ofNullable(u.profile))
  .map(profile => `${profile.firstName[0]}${profile.lastName[0]}`)
  .orElse('??');

// Execute side effects
userOption.ifPresent(user => {
  console.log(`Welcome ${user.name}!`);
});

userOption.ifPresentOrElse(
  user => console.log(`Welcome ${user.name}!`),
  () => console.log('Please log in')
);
```

## Practical Examples

### 1. Form Validation

```typescript
// Before
function validateForm(data: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email required');
  }
  
  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// After
function validateForm(data: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  Option.ofNullable(data.email)
    .filter(email => email.includes('@'))
    .ifPresentOrElse(
      () => {}, // Valid email
      () => errors.push('Valid email required')
    );
  
  Option.ofNullable(data.password)
    .filter(pwd => pwd.length >= 8)
    .ifPresentOrElse(
      () => {}, // Valid password
      () => errors.push('Password must be at least 8 characters')
    );
  
  return { isValid: errors.length === 0, errors };
}
```

### 2. API Response Handling

```typescript
// Before
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data.user || null;
    }
    return null;
  } catch {
    return null;
  }
}

// After
async function fetchUser(id: string): Promise<Option<User>> {
  return Option.fromPromise(
    fetch(`/api/users/${id}`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => data.user)
  );
}

// Usage
const userOption = await fetchUser('123');
userOption.ifPresent(user => {
  console.log(`Found user: ${user.name}`);
});
```

### 3. Configuration with Defaults

```typescript
interface AppConfig {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

function getConfigValue<K extends keyof AppConfig>(
  config: AppConfig | null,
  key: K,
  defaultValue: NonNullable<AppConfig[K]>
): NonNullable<AppConfig[K]> {
  return Option.ofNullable(config)
    .flatMap(c => Option.ofNullable(c[key]))
    .orElse(defaultValue);
}

// Usage
const apiUrl = getConfigValue(config, 'apiUrl', 'https://api.default.com');
const timeout = getConfigValue(config, 'timeout', 5000);
```

### 4. Safe Array Operations

```typescript
function findUserById(users: User[], id: string): Option<User> {
  return Option.ofNullable(users.find(user => user.id === id));
}

function getFirstActiveUser(users: User[]): Option<User> {
  return Option.ofNullable(users)
    .flatMap(users => Option.ofNullable(users.find(user => user.active)))
    .filter(user => user.status === 'active');
}

// Chain multiple operations
const userEmail = findUserById(users, '123')
  .flatMap(user => Option.ofNullable(user.profile))
  .map(profile => profile.email)
  .orElse('no-email@example.com');
```

## Integration with Existing Code

### Gradual Migration Strategy

1. **Start with new code**: Use Option in new features
2. **Refactor critical paths**: Focus on error-prone areas first
3. **Replace null checks**: Convert existing null checks to Option
4. **Add Option utilities**: Create helper functions for common patterns

### Common Patterns

```typescript
// Safe property access
function getNestedProperty<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): Option<T[K]> {
  return Option.ofNullable(obj).map(o => o[key]);
}

// Safe parsing
function safeParseInt(value: string | null | undefined): Option<number> {
  return Option.ofNullable(value)
    .filter(v => !isNaN(Number(v)))
    .map(v => parseInt(v, 10))
    .filter(n => !isNaN(n));
}

// Conditional execution
function executeIfValid<T>(
  value: T | null | undefined,
  validator: (v: T) => boolean,
  action: (v: T) => void
): void {
  Option.ofNullable(value)
    .filter(validator)
    .ifPresent(action);
}
```

## Best Practices

### 1. Use Option for Nullable Values
```typescript
// ✅ Good
function getUserName(user: User | null): string {
  return Option.ofNullable(user)
    .map(u => u.name)
    .orElse('Anonymous');
}

// ❌ Avoid mixing with null checks
function getUserName(user: User | null): string {
  if (user) {
    return Option.of(user.name).orElse('Anonymous');
  }
  return 'Anonymous';
}
```

### 2. Chain Operations
```typescript
// ✅ Good - chain operations
const result = Option.ofNullable(data)
  .map(d => d.value)
  .filter(v => v > 0)
  .map(v => v * 2)
  .orElse(0);

// ❌ Avoid - multiple Option creations
const dataOption = Option.ofNullable(data);
const valueOption = dataOption.map(d => d.value);
const filteredOption = valueOption.filter(v => v > 0);
const result = filteredOption.map(v => v * 2).orElse(0);
```

### 3. Use Appropriate Methods
```typescript
// ✅ Use orElse for simple defaults
const name = userOption.map(u => u.name).orElse('Anonymous');

// ✅ Use orElseGet for expensive computations
const name = userOption.map(u => u.name).orElseGet(() => generateDefaultName());

// ✅ Use orElseThrow for required values
const name = userOption.map(u => u.name).orElseThrow(new Error('User name required'));
```

### 4. Handle Side Effects Properly
```typescript
// ✅ Use ifPresent for side effects
userOption.ifPresent(user => {
  console.log(`User logged in: ${user.name}`);
  trackUserLogin(user.id);
});

// ✅ Use ifPresentOrElse for conditional side effects
userOption.ifPresentOrElse(
  user => showWelcomeMessage(user.name),
  () => showLoginPrompt()
);
```

## Performance Considerations

- Option operations are lightweight and don't create unnecessary objects
- Use `orElse` for simple defaults, `orElseGet` for expensive computations
- Consider using `filter` before `map` to avoid unnecessary transformations
- Option chains are evaluated lazily where possible

## Type Safety

The Option type provides full TypeScript support with:
- Generic type parameters for type safety
- Type guards (`isSome`, `isNone`)
- Proper type inference in chains
- Compile-time null safety

This implementation brings modern functional programming patterns to our codebase, making it more robust and maintainable while providing excellent TypeScript support.
