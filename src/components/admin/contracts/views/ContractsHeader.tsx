
interface ContractsHeaderProps {
  // No props needed for static header
}

const ContractsHeader = ({}: ContractsHeaderProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-blue-200">
      <h2 className="text-2xl font-playfair font-semibold mb-2">Gestão de Contratos</h2>
      <p className="text-gray-500">
        Crie, gerencie e envie contratos digitais para seus clientes com assinatura eletrônica.
      </p>
    </div>
  );
};

export default ContractsHeader;
