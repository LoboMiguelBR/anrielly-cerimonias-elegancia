
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  componentName?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class SafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`SafeErrorBoundary (${this.props.componentName || 'Unknown'}) caught an error:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              Erro no {this.props.componentName || 'componente'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Ocorreu um erro ao carregar este componente. Tente atualizar.
            </p>
            
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default SafeErrorBoundary;
