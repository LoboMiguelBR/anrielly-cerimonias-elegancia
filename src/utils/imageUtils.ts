
/**
 * Utility functions for handling and normalizing image URLs
 */

/**
 * Normalizes a URL to fix duplicate path segments, handles both absolute URLs and relative paths
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
    // Fix common issue with duplicate path segments regardless of URL type
    // e.g., /v1/object/public/v1/object/public/ -> /v1/object/public/
    const fixedPathUrl = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
    
    // Check if it's a relative path (starts with /)
    if (url.startsWith('/')) {
      console.log('[normalizeImageUrl] Handling relative path:', fixedPathUrl);
      return fixedPathUrl;
    }
    
    // For absolute URLs, try to parse to validate
    new URL(fixedPathUrl);
    console.log('[normalizeImageUrl] Normalized absolute URL:', fixedPathUrl);
    return fixedPathUrl;
  } catch (error) {
    // If URL parsing failed but it's not a relative path, log error and return original
    console.error('[normalizeImageUrl] Invalid URL format:', url, error);
    
    // If URL contains '/v1/object/public/' path segment, still try to fix duplicates
    if (url.includes('/v1/object/public/')) {
      const fixedUrl = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
      console.log('[normalizeImageUrl] URL parsing failed, but path fixed:', fixedUrl);
      return fixedUrl;
    }
    
    // Return the original URL if we can't process it
    return url;
  }
};
