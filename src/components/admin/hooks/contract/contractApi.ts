
import { contractCrudApi } from './api/contractCrud';
import { contractStatusApi } from './api/contractStatus';
import { contractTemplatesApi } from './api/contractTemplates';
import { contractEmailTemplatesApi } from './api/contractEmailTemplates';
import { contractSigningApi } from './api/contractSigning';

// Export individual APIs
export * from './api/contractCrud';
export * from './api/contractStatus';
export * from './api/contractTemplates';
export * from './api/contractEmailTemplates';
export * from './api/contractSigning';

// Export combined API object
export const contractApi = {
  // Contract CRUD operations
  ...contractCrudApi,
  
  // Contract status operations
  ...contractStatusApi,
  
  // Contract templates operations
  ...contractTemplatesApi,
  
  // Contract email templates operations
  ...contractEmailTemplatesApi,
  
  // Contract signing operations
  ...contractSigningApi
};
