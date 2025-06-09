
import ContractsMain from '../contracts/ContractsMain';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const ContractsTab = () => {
  const { isMobile } = useMobileLayout();

  return (
    <div className={`min-h-screen ${isMobile ? 'p-2' : ''}`}>
      <ContractsMain />
    </div>
  );
};

export default ContractsTab;
