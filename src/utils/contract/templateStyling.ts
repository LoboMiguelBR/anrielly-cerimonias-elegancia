
/**
 * Combina HTML content com CSS para renderização completa
 */
export const combineTemplateWithStyles = (htmlContent: string, cssContent?: string): string => {
  // CSS básico padrão para contratos
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
    @media (max-width: 768px) {
      .contract-basic {
        padding: 15px;
      }
      .contract-basic h1 {
        font-size: 20px;
      }
      .contract-parties, .contract-details, .contract-terms {
        padding: 10px;
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
