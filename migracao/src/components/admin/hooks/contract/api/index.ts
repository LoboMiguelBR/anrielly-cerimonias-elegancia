
// Export all API modules for easy access
export { contractCrudApi } from './contractCrud';
export { contractStatusApi } from './contractStatus';
export { contractTemplatesApi } from './contractTemplates';
export { contractEmailTemplatesApi } from './contractEmailTemplates';
export { contractSigningApi } from './contractSigning';
export { contractVersioningApi } from './contractVersioning';
export { contractSlugApi } from './contractSlug';

// Export individual CRUD operations for more granular imports
export { contractCreateApi } from './contractCrud/contractCreate';
export { contractReadApi } from './contractCrud/contractRead';
export { contractUpdateApi } from './contractCrud/contractUpdate';
export { contractDeleteApi } from './contractCrud/contractDelete';
