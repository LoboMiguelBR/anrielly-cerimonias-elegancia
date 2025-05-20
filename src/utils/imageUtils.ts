
/**
 * Utility functions for handling and normalizing image URLs
 */

/**
 * Normalizes a Supabase storage URL to fix duplicate path segments
 * @param url The URL to normalize
 * @returns The normalized URL or empty string if url is null/undefined
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  // Return early for null/undefined URLs
  if (!url) {
    console.log('[normalizeImageUrl] Received empty URL');
    return '';
  }

  console.log('[normalizeImageUrl] Original URL:', url);
  
  try {
    // Fix common issue with duplicate path segments
    // e.g., /v1/object/public/v1/object/public/ -> /v1/object/public/
    const fixedPathUrl = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
    
    // Try to parse as URL to validate (will throw if invalid)
    // This is just for validation, we'll return the string
    new URL(fixedPathUrl);
    
    console.log('[normalizeImageUrl] Normalized URL:', fixedPathUrl);
    return fixedPathUrl;
  } catch (error) {
    // If URL is invalid but contains v1/object/public path, still try to fix it
    if (url.includes('/v1/object/public/')) {
      const fixedUrl = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
      console.log('[normalizeImageUrl] URL parsing failed, but path fixed:', fixedUrl);
      return fixedUrl;
    }
    
    // For completely invalid URLs, log and return original
    console.error('[normalizeImageUrl] Invalid URL format:', url, error);
    return url;
  }
};
