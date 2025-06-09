
/**
 * Utility functions for QR code generation
 */
import QRCode from 'qrcode';

/**
 * Generates a QR code using the native QRCode library
 * @param url The URL to encode in the QR code
 * @param options Optional configuration options for the QR code
 * @returns A Promise that resolves to a data URL representation of the QR code
 */
export async function generateQRCode(url: string, options = {}): Promise<string> {
  try {
    // Default options for QR code generation
    const defaultOptions = {
      errorCorrectionLevel: 'H', // High - allows for 30% damage without loss
      type: 'svg',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: 200,
      ...options
    };
    
    // Generate QR code as data URL
    return await QRCode.toDataURL(url, defaultOptions);
  } catch (error) {
    console.error('Error generating QR code:', error);
    
    // Fallback to external API if local generation fails
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&format=svg`;
  }
}

/**
 * Generates a QR code with custom colors
 * @param url The URL to encode
 * @param darkColor HEX color for the dark modules (default: #000000)
 * @param lightColor HEX color for the light modules (default: #ffffff)
 * @returns A Promise that resolves to a data URL
 */
export async function generateColoredQRCode(
  url: string,
  darkColor = '#000000',
  lightColor = '#ffffff'
): Promise<string> {
  return generateQRCode(url, {
    color: {
      dark: darkColor,
      light: lightColor
    }
  });
}

/**
 * Converts an SVG string to a data URL that can be used in images
 * @param svgContent SVG content as a string
 * @returns Data URL representation of the SVG
 */
export function svgToDataUrl(svgContent: string): string {
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSvg}`;
}

/**
 * Creates a QR code with a logo in the center
 * @param url The URL to encode
 * @param logoUrl URL of the logo to place in the center
 * @returns A Promise that resolves to a data URL
 */
export async function generateQRCodeWithLogo(url: string, logoUrl: string): Promise<string> {
  // For now, we're returning a simple QR code
  // In a future implementation, we'll add logo overlay functionality
  return generateQRCode(url);
}
