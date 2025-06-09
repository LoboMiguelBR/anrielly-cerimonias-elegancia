
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Menu } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class SidebarErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('SidebarErrorBoundary: Erro capturado na sidebar:', error);
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SidebarErrorBoundary: Detalhes do erro na sidebar:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    console.log('SidebarErrorBoundary: Tentando resetar sidebar...');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    console.log('SidebarErrorBoundary: Recarregando página...');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Fallback customizado se fornecido
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Fallback padrão para sidebar
      return (
        <aside className="hidden lg:block w-80 bg-white shadow-sm border-r h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Erro na Sidebar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  A sidebar não pôde ser carregada. Tente uma das opções abaixo:
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs font-medium text-red-800 mb-1">Debug Info:</p>
                    <pre className="text-xs text-red-700 overflow-auto max-h-20">
                      {this.state.error.message}
                    </pre>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={this.handleRetry} 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Tentar Novamente
                  </Button>
                  
                  <Button 
                    onClick={this.handleReload} 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Menu className="w-3 h-3" />
                    Recarregar Página
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      );
    }

    return this.props.children;
  }
}

export default SidebarErrorBoundary;
