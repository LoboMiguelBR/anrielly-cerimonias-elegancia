
import React from 'react';
import { Clock, CheckCircle, FileText } from 'lucide-react';

interface QuoteStatusBadgeProps {
  status: string;
}

const statusColors = {
  aguardando: "bg-gray-100 text-gray-800",
  enviado: "bg-blue-100 text-blue-800",
  proposta: "bg-green-100 text-green-800"
};

const statusIcons = {
  aguardando: <Clock className="w-4 h-4 mr-1" />,
  enviado: <CheckCircle className="w-4 h-4 mr-1" />,
  proposta: <FileText className="w-4 h-4 mr-1" />
};

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  const icon = statusIcons[status as keyof typeof statusIcons];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status}
    </span>
  );
};

export default QuoteStatusBadge;
