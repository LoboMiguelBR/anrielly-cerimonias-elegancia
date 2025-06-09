
/**
 * Combina HTML content com CSS para renderização completa
 */
export const combineTemplateWithStyles = (htmlContent: string, cssContent?: string): string => {
  // CSS básico padrão para contratos com melhorias para assinaturas
  const defaultCss = `
    .contract-basic {
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    .contract-basic h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: bold;
      border-bottom: 2px solid #d4af37;
      padding-bottom: 10px;
    }
    .contract-basic h2 {
      color: #d4af37;
      text-align: center;
      font-size: 16px;
      font-style: italic;
      margin-bottom: 20px;
    }
    .contract-basic h3 {
      color: #2c3e50;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .contract-parties, .contract-details, .contract-terms {
      margin-bottom: 25px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
      border-left: 4px solid #d4af37;
    }
    
    /* === ESTILOS PARA ASSINATURAS === */
    .contract-signatures {
      margin-bottom: 25px;
      padding: 20px;
      background-color: #f0f9ff;
      border-radius: 8px;
      border: 2px solid #3b82f6;
    }
    .signatures-row {
      display: flex;
      justify-content: space-between;
      gap: 30px;
      margin-top: 20px;
    }
    .signature-box {
      flex: 1;
      text-align: center;
      padding: 15px;
      background-color: white;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    .signature-box h4 {
      margin-bottom: 15px;
      color: #2c3e50;
      font-size: 14px;
    }
    .signature-box img {
      display: block;
      margin: 10px auto;
      max-width: 200px;
      max-height: 80px;
      border: 1px solid #ddd;
      padding: 5px;
      background-color: #fafafa;
    }
    
    /* === ESTILOS PARA AUDITORIA === */
    .contract-audit {
      margin-bottom: 25px;
      padding: 20px;
      background-color: #fef3c7;
      border-radius: 8px;
      border: 2px solid #f59e0b;
    }
    .contract-audit h3 {
      color: #92400e;
      margin-top: 0;
    }
    .contract-audit p {
      margin: 8px 0;
      font-size: 13px;
    }
    .legal-validity {
      margin-top: 20px;
      padding: 15px;
      background-color: #fee2e2;
      border-radius: 5px;
      border-left: 4px solid #dc2626;
    }
    .legal-validity h4 {
      color: #dc2626;
      margin-top: 0;
      font-size: 14px;
    }
    .legal-validity ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .legal-validity li {
      margin: 5px 0;
      font-size: 12px;
    }
    
    .contract-content {
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .contract-content * {
      max-width: 100%;
    }
    
    /* === RESPONSIVIDADE === */
    @media (max-width: 768px) {
      .contract-basic {
        padding: 15px;
      }
      .contract-basic h1 {
        font-size: 20px;
      }
      .contract-parties, .contract-details, .contract-terms, .contract-signatures, .contract-audit {
        padding: 10px;
      }
      .signatures-row {
        flex-direction: column;
        gap: 20px;
      }
      .signature-box img {
        max-width: 150px;
        max-height: 60px;
      }
    }
    
    /* === IMPRESSÃO === */
    @media print {
      .contract-basic {
        max-width: none;
        margin: 0;
        padding: 20px;
      }
      .contract-signatures, .contract-audit {
        break-inside: avoid;
      }
    }
  `;

  // Usar CSS fornecido ou CSS padrão
  const finalCss = cssContent || defaultCss;

  // Criar CSS com escopo isolado
  const scopedCss = `
    <style scoped>
      ${finalCss}
    </style>
  `;

  // Se já existe uma tag <style>, substituir
  if (htmlContent.includes('<style>')) {
    return htmlContent.replace(
      /<style[^>]*>[\s\S]*?<\/style>/gi,
      scopedCss
    );
  }

  // Adicionar CSS e wrapper no conteúdo
  return `${scopedCss}<div class="contract-content">${htmlContent}</div>`;
};
