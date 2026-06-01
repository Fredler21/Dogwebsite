'use client';
import { Component, type ReactNode } from 'react';

interface State { err?: Error; }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = {};
  static getDerivedStateFromError(err: Error): State { return { err }; }
  componentDidCatch(err: Error, info: { componentStack?: string }) {
    // Forward to logging service of choice; never echo stack to user.
    console.error('[boundary]', err.message, info.componentStack);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="mx-auto max-w-md px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-slate-600">We have logged the issue. Please refresh or try again shortly.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
