
/**
 * Combina HTML content com CSS para renderização completa
 */
export const combineTemplateWithStyles = (htmlContent: string, cssContent?: string): string => {
  if (!cssContent) {
    return htmlContent;
  }

  // Criar CSS com escopo isolado
  const scopedCss = `
    <style scoped>
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
      ${cssContent}
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
