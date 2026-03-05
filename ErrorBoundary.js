import React from 'react';

/**
 * ErrorBoundary: A safety net that catches JavaScript errors in its child components.
 * It prevents the entire app from crashing (White Screen of Death) and provides a fallback UI.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        // hasError tracks if a crash occurred; error keeps the specific message if needed.
        this.state = { hasError: false, error: null };
    }

    // Requirement: Update state so the next render shows the fallback UI.
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    // Requirement: Used for side effects like logging the error to an external service.
    componentDidCatch(error, errorInfo) {
        console.error("Critical UI Error:", error, errorInfo);
        // In production, you would send 'error' and 'errorInfo' to Sentry/LogRocket here.
    }

    // Allows the user to try and recover without a full browser refresh.
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Requirement 3.f: Minimalist & Theme-aware Fallback UI
            return (
                <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div className="card" style={{ borderTop: '4px solid var(--error-red)' }}>
                        <h2 style={{ color: 'var(--text-color)' }}>⚠️ Workspace Interrupted</h2>
                        <p style={{ opacity: 0.7, marginBottom: '25px' }}>
                            An unexpected error occurred while rendering this page.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={this.handleReset}>
                                Try Again
                            </button>
                            <button className="btn btn-outline" onClick={() => window.location.reload()}>
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // If no error, just render the children normally.
        return this.props.children;
    }
}

export default ErrorBoundary;