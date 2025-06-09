
// Main API exports for contract CRUD operations
export { contractCreateApi } from './contractCreate';
export { contractReadApi } from './contractRead';
export { contractUpdateApi } from './contractUpdate';
export { contractDeleteApi } from './contractDelete';

// Legacy combined API for backward compatibility
import { contractCreateApi } from './contractCreate';
import { contractReadApi } from './contractRead';
import { contractUpdateApi } from './contractUpdate';
import { contractDeleteApi } from './contractDelete';

export const contractCrudApi = {
  // Read operations
  getContracts: contractReadApi.getContracts,
  getContractById: contractReadApi.getContractById,
  
  // Create operations
  createContract: contractCreateApi.createContract,
  
  // Update operations
  updateContract: contractUpdateApi.updateContract,
  
  // Delete operations
  deleteContract: contractDeleteApi.deleteContract
};
