
import { contractCrudApi } from './api/contractCrud';
import { contractStatusApi } from './api/contractStatus';
import { contractTemplatesApi } from './api/contractTemplates';
import { contractSigningApi } from './api/contractSigning';

export const contractApi = {
  ...contractCrudApi,
  ...contractStatusApi,
  ...contractTemplatesApi,
  ...contractSigningApi
};
