/**
 * Option type implementation inspired by JavaFX's Optional
 * Provides a functional approach to handling nullable values
 */

export abstract class Option<T> {
  /**
   * Creates an Option containing a value
   */
  static of<T>(value: T): Option<T> {
    return value != null ? new Some(value) : new None();
  }

  /**
   * Creates an Option containing a value, or None if null/undefined
   */
  static ofNullable<T>(value: T | null | undefined): Option<T> {
    return value != null ? new Some(value) : new None();
  }

  /**
   * Creates an empty Option
   */
  static empty<T>(): Option<T> {
    return new None();
  }

  /**
   * Creates an Option from a function that might throw
   */
  static try<T>(fn: () => T): Option<T> {
    try {
      return Option.of(fn());
    } catch {
      return Option.empty();
    }
  }

  /**
   * Creates an Option from a Promise
   */
  static async fromPromise<T>(promise: Promise<T>): Promise<Option<T>> {
    try {
      const value = await promise;
      return Option.of(value);
    } catch {
      return Option.empty();
    }
  }

  /**
   * Returns true if this Option contains a value
   */
  abstract isPresent(): boolean;

  /**
   * Returns true if this Option is empty
   */
  abstract isEmpty(): boolean;

  /**
   * Returns the value if present, otherwise throws an error
   */
  abstract get(): T;

  /**
   * Returns the value if present, otherwise returns the default value
   */
  abstract orElse(defaultValue: T): T;

  /**
   * Returns the value if present, otherwise returns the result of the supplier
   */
  abstract orElseGet(supplier: () => T): T;

  /**
   * Returns this Option if it contains a value, otherwise returns the other Option
   */
  abstract or(other: Option<T>): Option<T>;

  /**
   * Throws an error if this Option is empty
   */
  abstract orElseThrow(error?: Error): T;

  /**
   * Applies a function to the value if present
   */
  abstract map<U>(fn: (value: T) => U): Option<U>;

  /**
   * Applies a function that returns an Option to the value if present
   */
  abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Filters the value if present
   */
  abstract filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * Executes an action if the value is present
   */
  abstract ifPresent(action: (value: T) => void): void;

  /**
   * Executes an action if the value is present, otherwise executes the empty action
   */
  abstract ifPresentOrElse(
    action: (value: T) => void,
    emptyAction: () => void
  ): void;

  /**
   * Converts to array
   */
  abstract toArray(): T[];

  /**
   * Converts to string representation
   */
  abstract toString(): string;
}

class Some<T> extends Option<T> {
  constructor(private readonly value: T) {
    super();
  }

  isPresent(): boolean {
    return true;
  }

  isEmpty(): boolean {
    return false;
  }

  get(): T {
    return this.value;
  }

  orElse(_defaultValue: T): T {
    return this.value;
  }

  orElseGet(_supplier: () => T): T {
    return this.value;
  }

  or(_other: Option<T>): Option<T> {
    return this;
  }

  orElseThrow(_error?: Error): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return Option.of(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.value) ? this : Option.empty();
  }

  ifPresent(action: (value: T) => void): void {
    action(this.value);
  }

  ifPresentOrElse(action: (value: T) => void, _emptyAction: () => void): void {
    action(this.value);
  }

  toArray(): T[] {
    return [this.value];
  }

  toString(): string {
    return `Some(${this.value})`;
  }
}

class None<T> extends Option<T> {
  isPresent(): boolean {
    return false;
  }

  isEmpty(): boolean {
    return true;
  }

  get(): T {
    throw new Error('No value present');
  }

  orElse(defaultValue: T): T {
    return defaultValue;
  }

  orElseGet(supplier: () => T): T {
    return supplier();
  }

  or(other: Option<T>): Option<T> {
    return other;
  }

  orElseThrow(error?: Error): T {
    throw error || new Error('No value present');
  }

  map<U>(_fn: (value: T) => U): Option<U> {
    return Option.empty();
  }

  flatMap<U>(_fn: (value: T) => Option<U>): Option<U> {
    return Option.empty();
  }

  filter(_predicate: (value: T) => boolean): Option<T> {
    return this;
  }

  ifPresent(_action: (value: T) => void): void {
    // Do nothing
  }

  ifPresentOrElse(_action: (value: T) => void, emptyAction: () => void): void {
    emptyAction();
  }

  toArray(): T[] {
    return [];
  }

  toString(): string {
    return 'None';
  }
}

// Type guards
export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.isPresent();
}

export function isNone<T>(option: Option<T>): option is None<T> {
  return option.isEmpty();
}

// Utility functions
export function mapNullable<T, U>(
  value: T | null | undefined,
  mapper: (value: T) => U
): U | null {
  return value != null ? mapper(value) : null;
}

export function filterMap<T, U>(
  array: T[],
  mapper: (value: T) => Option<U>
): U[] {
  return array
    .map(mapper)
    .filter(isSome)
    .map(option => option.get());
}

export function findFirst<T>(
  array: T[],
  predicate: (value: T) => boolean
): Option<T> {
  const found = array.find(predicate);
  return Option.ofNullable(found);
}

export function sequence<T>(options: Option<T>[]): Option<T[]> {
  const values: T[] = [];
  for (const option of options) {
    if (option.isEmpty()) {
      return Option.empty();
    }
    values.push(option.get());
  }
  return Option.of(values);
}
