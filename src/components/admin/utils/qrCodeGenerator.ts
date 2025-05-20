
/**
 * Função para gerar um QR code utilizando a API externa
 * Essa função poderia ser movida para uma Edge Function no futuro
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    const requestBody = {
      frame_name: "no-frame",
      qr_code_text: url,
      image_format: "SVG",
      qr_code_logo: "scan-me-square"
    };

    const response = await fetch(
      "https://api.qr-code-generator.com/v1/create?access-token=OdvJsv1EoWnKJNjiyn0GkThD6JHBMBdnEf1elv6hBklsIJKIqnLkvY1d91y_eDGo",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na API de QR Code: ${response.statusText}`);
    }

    // Para SVG, podemos retornar diretamente o conteúdo como texto
    const qrCodeSvg = await response.text();
    return qrCodeSvg;
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    throw error;
  }
}

/**
 * Função utilitária para converter um SVG em formato de data URL
 * que pode ser usado em componentes de imagem
 */
export function svgToDataUrl(svgContent: string): string {
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSvg}`;
}
