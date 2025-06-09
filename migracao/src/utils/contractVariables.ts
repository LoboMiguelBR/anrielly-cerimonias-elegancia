
export const getAvailableVariables = () => {
  return [
    // Dados do Cliente
    '{NOME_CLIENTE}',
    '{EMAIL_CLIENTE}',
    '{TELEFONE_CLIENTE}',
    '{ENDERECO_CLIENTE}',
    '{PROFISSAO_CLIENTE}',
    '{ESTADO_CIVIL}',
    
    // Dados do Evento
    '{TIPO_EVENTO}',
    '{DATA_EVENTO}',
    '{HORARIO_EVENTO}',
    '{LOCAL_EVENTO}',
    
    // Dados Financeiros
    '{VALOR_TOTAL}',
    '{ENTRADA}',
    '{DATA_ENTRADA}',
    '{VALOR_RESTANTE}',
    '{DATA_PAGAMENTO_RESTANTE}',
    
    // Versionamento
    '{VERSAO}',
    '{DATA_VERSAO}',
    '{OBSERVACOES}',
    
    // === NOVAS VARIÁVEIS DE AUDITORIA E ASSINATURA ===
    
    // Dados de Auditoria (CRÍTICOS PARA VALIDADE JURÍDICA)
    '{IP}',
    '{DATA_ASSINATURA}',
    '{HORA_ASSINATURA}',
    '{DISPOSITIVO}',
    '{HASH_DOCUMENTO}',
    
    // Assinaturas (IMAGENS)
    '{ASSINATURA_CLIENTE}',
    '{ASSINATURA_CONTRATADA}'
  ];
};

// Variáveis organizadas por categoria para o editor
export const getVariablesByCategory = () => {
  return {
    'Cliente': [
      '{NOME_CLIENTE}',
      '{EMAIL_CLIENTE}',
      '{TELEFONE_CLIENTE}',
      '{ENDERECO_CLIENTE}',
      '{PROFISSAO_CLIENTE}',
      '{ESTADO_CIVIL}'
    ],
    'Evento': [
      '{TIPO_EVENTO}',
      '{DATA_EVENTO}',
      '{HORARIO_EVENTO}',
      '{LOCAL_EVENTO}'
    ],
    'Financeiro': [
      '{VALOR_TOTAL}',
      '{ENTRADA}',
      '{DATA_ENTRADA}',
      '{VALOR_RESTANTE}',
      '{DATA_PAGAMENTO_RESTANTE}'
    ],
    'Documento': [
      '{VERSAO}',
      '{DATA_VERSAO}',
      '{OBSERVACOES}'
    ],
    'Auditoria': [
      '{IP}',
      '{DATA_ASSINATURA}',
      '{HORA_ASSINATURA}',
      '{DISPOSITIVO}',
      '{HASH_DOCUMENTO}'
    ],
    'Assinaturas': [
      '{ASSINATURA_CLIENTE}',
      '{ASSINATURA_CONTRATADA}'
    ]
  };
};
