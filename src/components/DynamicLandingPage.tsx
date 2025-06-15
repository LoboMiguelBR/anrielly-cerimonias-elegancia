
import Index from '@/pages/Index';

/**
 * Como a feature de landing pages dinâmicas foi removida,
 * este componente apenas renderiza a home como fallback.
 */
const DynamicLandingPage = () => {
  return <Index />;
};

export default DynamicLandingPage;
