
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CMSRealtimeIndicator = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    // Monitor realtime connection status
    const channel = supabase
      .channel('cms_realtime_monitor')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_pages'
      }, () => {
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_sections'
      }, () => {
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
      })
      .subscribe((status) => {
        console.log('Realtime status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge 
        variant={isConnected ? "default" : "secondary"}
        className={`flex items-center gap-1 ${
          isConnected 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200'
        }`}
      >
        {isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        Realtime {isConnected ? 'On' : 'Off'}
      </Badge>
      
      {updateCount > 0 && (
        <Badge variant="outline" className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          {updateCount} updates
        </Badge>
      )}
      
      {lastUpdate && (
        <span className="text-gray-500">
          Última: {lastUpdate.toLocaleTimeString('pt-BR')}
        </span>
      )}
    </div>
  );
};

export default CMSRealtimeIndicator;
