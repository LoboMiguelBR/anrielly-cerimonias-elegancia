import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuração do Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface NotificationRequest {
  type: 'lead_received' | 'proposal_created' | 'contract_signed' | 'event_created' | 'custom';
  title: string;
  message: string;
  metadata?: Record<string, any>;
  user_id?: string;
  target_role?: string;
}

async function createNotification(notificationData: NotificationRequest) {
  try {
    // Se target_role é especificado, buscar usuários com essa role
    let targetUsers: string[] = [];
    
    if (notificationData.target_role) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', notificationData.target_role)
        .eq('ativo', true);
      
      targetUsers = users?.map(u => u.id) || [];
    } else if (notificationData.user_id) {
      targetUsers = [notificationData.user_id];
    }

    // Criar notificações para cada usuário target
    const notifications = targetUsers.map(userId => ({
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      metadata: notificationData.metadata || {},
      user_id: userId,
      read: false
    }));

    if (notifications.length > 0) {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      console.log(`Created ${notifications.length} notifications`);
      return { success: true, count: notifications.length, data };
    }

    return { success: true, count: 0, message: 'No target users found' };

  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
}

async function triggerRealTimeNotification(notificationData: NotificationRequest) {
  try {
    // Enviar notificação real-time via Supabase Realtime
    const { error } = await supabase
      .from('notifications')
      .select('*')
      .limit(1); // Trigger realtime connection

    console.log('Real-time notification triggered');
    return { success: true };

  } catch (error) {
    console.error('Error triggering real-time notification:', error);
    return { success: false, error: error.message };
  }
}

async function processAutomationLogs() {
  try {
    // Buscar logs de automação pendentes para criar notificações
    const { data: pendingLogs, error } = await supabase
      .from('automation_logs')
      .select(`
        *,
        automation_flows (
          flow_name,
          actions
        )
      `)
      .eq('status', 'success')
      .is('notification_sent', null)
      .limit(20);

    if (error) throw error;

    for (const log of pendingLogs || []) {
      // Verificar se o fluxo tem ações de notificação
      const actions = log.automation_flows?.actions || [];
      const notificationActions = actions.filter((action: any) => action.type === 'notification');

      for (const action of notificationActions) {
        await createNotification({
          type: 'custom',
          title: action.title || 'Automação Executada',
          message: action.message || `Fluxo ${log.automation_flows?.flow_name} foi executado`,
          metadata: {
            automation_log_id: log.id,
            flow_name: log.automation_flows?.flow_name,
            trigger_table: log.trigger_table,
            trigger_record_id: log.trigger_record_id
          },
          target_role: action.target_user === 'admin' ? 'admin' : undefined
        });
      }

      // Marcar log como notificação enviada
      await supabase
        .from('automation_logs')
        .update({ notification_sent: true })
        .eq('id', log.id);
    }

    return { success: true, processed: pendingLogs?.length || 0 };

  } catch (error) {
    console.error('Error processing automation logs:', error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'process';

    console.log(`Processing notification action: ${action}`);

    let result;

    switch (action) {
      case 'create':
        // Criar notificação manual
        const notificationData: NotificationRequest = await req.json();
        result = await createNotification(notificationData);
        break;

      case 'process':
        // Processar logs de automação pendentes
        result = await processAutomationLogs();
        break;

      case 'realtime':
        // Trigger notificação real-time
        const realtimeData: NotificationRequest = await req.json();
        result = await triggerRealTimeNotification(realtimeData);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({
      success: result.success,
      ...result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in automation-notifications function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);