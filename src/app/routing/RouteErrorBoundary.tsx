import React from "react";

type State = { hasError: boolean; error: unknown };

class InternalErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // You can log to a monitoring service here
    console.error("Route error boundary caught:", error);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <pre className="text-sm opacity-70 mb-4 whitespace-pre-wrap">{String((this.state.error as any)?.message ?? this.state.error)}</pre>
          <button className="px-4 py-2 rounded bg-black text-white" onClick={this.handleReset}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <InternalErrorBoundary>{children}</InternalErrorBoundary>
);
