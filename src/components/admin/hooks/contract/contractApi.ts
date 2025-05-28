
// Legacy API - kept for backward compatibility
// This file re-exports the new modular API functions
// Gradually migrate imports to use the specific modules directly

import { contractCrudApi } from './api/contractCrud/index';
import { contractStatusApi } from './api/contractStatus';
import { contractTemplatesApi } from './api/contractTemplates';
import { contractEmailTemplatesApi } from './api/contractEmailTemplates';
import { contractSigningApi } from './api/contractSigning';

export const contractApi = {
  // Contract CRUD operations
  getContracts: contractCrudApi.getContracts,
  getContractById: contractCrudApi.getContractById,
  createContract: contractCrudApi.createContract,
  updateContract: contractCrudApi.updateContract,
  deleteContract: contractCrudApi.deleteContract,
  
  // Contract status operations
  updateContractStatus: contractStatusApi.updateContractStatus,
  
  // Template operations - keeping legacy method names for compatibility
  getContractTemplates: contractTemplatesApi.getContractTemplates,
  createContractTemplate: contractTemplatesApi.createContractTemplate,
  updateContractTemplate: contractTemplatesApi.updateContractTemplate,
  deleteContractTemplate: contractTemplatesApi.deleteContractTemplate,
  getDefaultTemplate: contractTemplatesApi.getDefaultTemplate,
  
  // Email template operations
  getContractEmailTemplates: contractEmailTemplatesApi.getContractEmailTemplates,
  getContractEmailTemplateById: async (id: string) => {
    const templates = await contractEmailTemplatesApi.getContractEmailTemplates();
    return templates.find(t => t.id === id) || null;
  },
  createContractEmailTemplate: contractEmailTemplatesApi.createContractEmailTemplate,
  updateContractEmailTemplate: contractEmailTemplatesApi.updateContractEmailTemplate,
  deleteContractEmailTemplate: contractEmailTemplatesApi.deleteContractEmailTemplate,
  getDefaultEmailTemplate: contractEmailTemplatesApi.getDefaultTemplateByType,
  
  // Contract signing operations
  getContractByToken: contractSigningApi.getContractByToken,
  signContract: contractSigningApi.signContract
};
