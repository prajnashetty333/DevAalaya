import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Viewer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[500px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-red-500/30">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-white font-bold text-xl mb-2">Unable to Load 3D Model</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            There was an error rendering the 3D content. This might be due to a large file size or hardware limitations.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
          >
            Try Refreshing
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
