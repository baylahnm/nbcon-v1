/**
 * Error Monitoring & Reporting Utility
 * Tracks and reports critical errors (especially 406/RLS issues)
 */

interface ErrorLog {
  timestamp: Date;
  code: string;
  message: string;
  context: string;
  userId?: string;
  userEmail?: string;
  stackTrace?: string;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private readonly maxErrors = 50; // Keep last 50 errors in memory

  /**
   * Log an error with context
   */
  logError(error: any, context: string, userId?: string, userEmail?: string): void {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      code: error?.code || error?.status || 'UNKNOWN',
      message: error?.message || String(error),
      context,
      userId,
      userEmail,
      stackTrace: error?.stack
    };

    this.errors.push(errorLog);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console with formatting
    console.error(
      `[ERROR_MONITOR] ${context}`,
      `\n  Code: ${errorLog.code}`,
      `\n  Message: ${errorLog.message}`,
      userId ? `\n  User: ${userId}` : '',
      userEmail ? `\n  Email: ${userEmail}` : ''
    );

    // Check if this is a critical 406 error
    if (this.is406Error(error)) {
      this.handle406Error(errorLog);
    }
  }

  /**
   * Check if error is a 406/RLS policy error
   */
  is406Error(error: any): boolean {
    return (
      error?.code === 'PGRST116' ||
      error?.code === '406' ||
      error?.status === 406 ||
      error?.message?.includes('406') ||
      error?.message?.toLowerCase().includes('row-level security')
    );
  }

  /**
   * Handle critical 406 errors
   */
  private handle406Error(errorLog: ErrorLog): void {
    console.error(
      `[CRITICAL] 406/RLS Error Detected!`,
      `\n  🚨 Missing RLS INSERT policy on profiles table`,
      `\n  📋 Context: ${errorLog.context}`,
      `\n  ⚡ Action Required: Apply supabase/fixes/011-complete-production-fix.sql`,
      `\n  📖 Documentation: docs/10-CRITICAL_FIXES_SUMMARY.md`
    );

    // In production, this would send to monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error('RLS 406 Error'), {
        level: 'error',
        tags: {
          error_code: '406',
          error_type: 'RLS_POLICY_MISSING'
        },
        extra: errorLog
      });
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  /**
   * Get 406 errors only
   */
  get406Errors(): ErrorLog[] {
    return this.errors.filter(e => 
      e.code === 'PGRST116' || 
      e.code === '406' || 
      e.message.includes('406')
    );
  }

  /**
   * Export errors as JSON for support tickets
   */
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get summary statistics
   */
  getStats(): {
    total: number;
    errors406: number;
    lastError?: ErrorLog;
    commonErrors: Record<string, number>;
  } {
    const commonErrors: Record<string, number> = {};
    
    this.errors.forEach(error => {
      const key = error.code || 'UNKNOWN';
      commonErrors[key] = (commonErrors[key] || 0) + 1;
    });

    return {
      total: this.errors.length,
      errors406: this.get406Errors().length,
      lastError: this.errors[this.errors.length - 1],
      commonErrors
    };
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

/**
 * React hook for error monitoring
 */
export function useErrorMonitor() {
  return {
    logError: errorMonitor.logError.bind(errorMonitor),
    is406Error: errorMonitor.is406Error.bind(errorMonitor),
    getErrors: errorMonitor.getErrors.bind(errorMonitor),
    get406Errors: errorMonitor.get406Errors.bind(errorMonitor),
    getStats: errorMonitor.getStats.bind(errorMonitor),
    exportErrors: errorMonitor.exportErrors.bind(errorMonitor)
  };
}

/**
 * Wrapper function to retry async operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onRetry?: (attempt: number, error: any) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error; // Last attempt, re-throw
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt, error);
      }

      // Wait before retrying (exponential backoff)
      await sleep(retryDelay * attempt);
    }
  }

  throw new Error('Operation failed after all retries');
}

