import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack?.substring(0, 500) || 'No stack trace'
    });
  }

  handleRefresh = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page to continue.</p>
            <button
              onClick={this.handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;