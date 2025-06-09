
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Send, Camera, MessageSquare, FileText, Download } from 'lucide-react';

interface QuickActionsProps {
  onCreateProposal?: () => void;
  onSendReminder?: () => void;
  onAddGalleryPhoto?: () => void;
}

const QuickActions = ({ onCreateProposal, onSendReminder, onAddGalleryPhoto }: QuickActionsProps) => {
  const actions = [
    {
      label: "Nova Proposta",
      icon: Plus,
      onClick: onCreateProposal,
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      label: "Enviar Lembrete",
      icon: Send,
      onClick: onSendReminder,
      color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    },
    {
      label: "Adicionar Foto",
      icon: Camera,
      onClick: onAddGalleryPhoto,
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      label: "Relatório Mensal",
      icon: Download,
      onClick: () => console.log('Exportar relatório'),
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
    }
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={action.onClick}
                className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color} transition-all duration-200`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
