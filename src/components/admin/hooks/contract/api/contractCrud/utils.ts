
/**
 * Utility functions for contract CRUD operations
 */

const sanitizeDateTimeFields = (data: any) => {
  const sanitized = { ...data };
  
  // Convert empty strings to null for date/time fields
  if (sanitized.event_date === '') sanitized.event_date = null;
  if (sanitized.event_time === '') sanitized.event_time = null;
  if (sanitized.down_payment_date === '') sanitized.down_payment_date = null;
  if (sanitized.remaining_payment_date === '') sanitized.remaining_payment_date = null;
  
  return sanitized;
};

export { sanitizeDateTimeFields };
