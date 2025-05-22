
/**
 * Utility functions for QR code generation
 */

/**
 * Generates a QR code using a stable external API
 * @param url The URL to encode in the QR code
 * @returns A data URL representation of the QR code
 */
export function generateQRCode(url: string): string {
  // Ensure the URL is properly encoded
  const encodedUrl = encodeURIComponent(url);
  
  // Use QR Server API (reliable external service)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&format=svg`;
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
