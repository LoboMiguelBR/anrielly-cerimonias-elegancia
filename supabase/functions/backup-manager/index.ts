import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BackupRequest {
  backup_config_id?: string;
  backup_type?: 'full' | 'data_only' | 'schema_only';
  tables?: string[];
}

async function createBackup(backupConfig: any, tables?: string[]) {
  const backupLogId = crypto.randomUUID();
  
  try {
    // Registrar início do backup
    const { error: logError } = await supabase
      .from('backup_logs')
      .insert({
        id: backupLogId,
        backup_config_id: backupConfig.id,
        status: 'running',
        started_at: new Date().toISOString()
      });

    if (logError) throw logError;

    console.log(`Starting backup: ${backupConfig.name}`);

    // Definir tabelas para backup
    const tablesToBackup = tables || [
      'profiles', 'quote_requests', 'proposals', 'contracts', 
      'clientes', 'events', 'testimonials', 'cms_home_sections',
      'questionarios_noivos', 'services', 'notifications',
      'automation_logs', 'webhook_configs', 'external_integrations'
    ];

    const backupData: Record<string, any[]> = {};
    let totalSize = 0;

    // Fazer backup de cada tabela
    for (const table of tablesToBackup) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (!error && data) {
          backupData[table] = data;
          totalSize += JSON.stringify(data).length;
          console.log(`Backed up ${table}: ${data.length} records`);
        }
      } catch (tableError) {
        console.warn(`Error backing up table ${table}:`, tableError);
        // Continuar com outras tabelas
      }
    }

    // Preparar dados do backup
    const backupContent = {
      version: '1.0',
      created_at: new Date().toISOString(),
      backup_type: backupConfig.backup_type,
      tables: backupData,
      metadata: {
        total_tables: Object.keys(backupData).length,
        total_records: Object.values(backupData).reduce((sum, records) => sum + records.length, 0)
      }
    };

    // Salvar no storage do Supabase
    const fileName = `backup-${backupConfig.name}-${new Date().toISOString().split('T')[0]}.json`;
    const { error: uploadError } = await supabase.storage
      .from('backups')
      .upload(fileName, JSON.stringify(backupContent, null, 2), {
        contentType: 'application/json'
      });

    if (uploadError && !uploadError.message.includes('already exists')) {
      throw uploadError;
    }

    // Atualizar log de backup como concluído
    await supabase
      .from('backup_logs')
      .update({
        status: 'completed',
        backup_size: totalSize,
        file_path: fileName,
        completed_at: new Date().toISOString()
      })
      .eq('id', backupLogId);

    // Atualizar configuração do backup
    await supabase
      .from('backup_configs')
      .update({
        last_backup: new Date().toISOString(),
        backup_status: 'completed'
      })
      .eq('id', backupConfig.id);

    console.log(`Backup completed: ${fileName} (${totalSize} bytes)`);
    
    return {
      success: true,
      backup_log_id: backupLogId,
      file_path: fileName,
      size: totalSize,
      tables_backed_up: Object.keys(backupData).length
    };

  } catch (error: any) {
    console.error('Backup error:', error);

    // Atualizar log com erro
    await supabase
      .from('backup_logs')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', backupLogId);

    await supabase
      .from('backup_configs')
      .update({
        backup_status: 'failed'
      })
      .eq('id', backupConfig.id);

    throw error;
  }
}

async function processScheduledBackups() {
  try {
    // Buscar backups agendados ativos
    const { data: backupConfigs, error } = await supabase
      .from('backup_configs')
      .select('*')
      .eq('is_active', true)
      .not('backup_status', 'eq', 'running');

    if (error) throw error;

    const results = [];
    
    for (const config of backupConfigs || []) {
      // Verificar se deve executar backup baseado no cron schedule
      // Para simplicidade, vamos executar backups diários por enquanto
      const lastBackup = config.last_backup ? new Date(config.last_backup) : null;
      const now = new Date();
      const daysSinceLastBackup = lastBackup ? 
        Math.floor((now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24)) : 999;

      if (daysSinceLastBackup >= 1) { // Backup diário
        console.log(`Running scheduled backup: ${config.name}`);
        
        try {
          const result = await createBackup(config);
          results.push({ config_id: config.id, ...result });
        } catch (error: any) {
          results.push({ 
            config_id: config.id, 
            success: false, 
            error: error.message 
          });
        }
      }
    }

    return { success: true, processed: results.length, results };

  } catch (error: any) {
    console.error('Error processing scheduled backups:', error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'schedule';

    console.log(`Processing backup action: ${action}`);

    let result;

    switch (action) {
      case 'create':
        // Criar backup manual
        const backupRequest: BackupRequest = await req.json();
        
        if (backupRequest.backup_config_id) {
          const { data: config, error } = await supabase
            .from('backup_configs')
            .select('*')
            .eq('id', backupRequest.backup_config_id)
            .single();

          if (error) throw new Error('Backup config not found');
          result = await createBackup(config, backupRequest.tables);
        } else {
          throw new Error('Backup config ID required');
        }
        break;

      case 'schedule':
        // Processar backups agendados
        result = await processScheduledBackups();
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
    console.error('Error in backup-manager function:', error);
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