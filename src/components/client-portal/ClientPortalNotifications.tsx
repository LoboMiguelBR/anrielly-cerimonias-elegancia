import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ClientNotification } from '@/hooks/client-portal/useClientPortalData';
import { useClientPortalData } from '@/hooks/client-portal/useClientPortalData';
import { useClientPortalAuth } from '@/hooks/client-portal/useClientPortalAuth';

interface ClientPortalNotificationsProps {
  notifications: ClientNotification[];
  loading: boolean;
}

export const ClientPortalNotifications = ({ notifications, loading }: ClientPortalNotificationsProps) => {
  const { session } = useClientPortalAuth();
  const { markNotificationAsRead } = useClientPortalData(session?.client?.id);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? '50' : '100';
    
    switch (type) {
      case 'success':
        return `border-l-green-500/${opacity} bg-green-50/50`;
      case 'warning':
        return `border-l-yellow-500/${opacity} bg-yellow-50/50`;
      case 'reminder':
        return `border-l-blue-500/${opacity} bg-blue-50/50`;
      default:
        return `border-l-blue-500/${opacity} bg-blue-50/50`;
    }
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} min atrás`;
    } else if (diffInMinutes < 60 * 24) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleActionClick = (actionUrl: string) => {
    if (actionUrl.startsWith('http')) {
      window.open(actionUrl, '_blank');
    } else {
      // Para URLs internas do portal
      console.log('Navigate to:', actionUrl);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4 p-4 border-l-4 border-muted bg-muted/20 rounded-r-lg">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Mantenha-se atualizado com as novidades do seu projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma notificação ainda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                {unreadNotifications.length} não lidas de {notifications.length} total
              </CardDescription>
            </div>
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive">
                {unreadNotifications.length} novas
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Notificações não lidas */}
            {unreadNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Não lidas</h3>
                {unreadNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`border-l-4 p-4 rounded-r-lg ${getNotificationColor(notification.type, notification.is_read)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatNotificationTime(notification.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Marcar como lida
                          </Button>
                          
                          {notification.action_url && (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleActionClick(notification.action_url!)}
                            >
                              Ver detalhes
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notificações lidas */}
            {readNotifications.length > 0 && (
              <div className="space-y-3">
                {unreadNotifications.length > 0 && (
                  <h3 className="font-semibold text-sm text-muted-foreground pt-4 border-t">
                    Lidas recentemente
                  </h3>
                )}
                
                {readNotifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id}
                    className={`border-l-4 p-4 rounded-r-lg opacity-60 ${getNotificationColor(notification.type, notification.is_read)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatNotificationTime(notification.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        {notification.action_url && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleActionClick(notification.action_url!)}
                            className="mt-2 h-8"
                          >
                            Ver detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {readNotifications.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground py-2">
                    + {readNotifications.length - 5} notificações antigas
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};