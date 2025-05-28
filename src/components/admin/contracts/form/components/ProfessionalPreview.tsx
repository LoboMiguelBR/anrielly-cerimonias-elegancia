
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, User } from 'lucide-react';

interface ProfessionalPreviewProps {
  professional: {
    id: string;
    name: string;
    email: string;
    phone: string;
    category: string;
  } | null;
}

const ProfessionalPreview: React.FC<ProfessionalPreviewProps> = ({ professional }) => {
  if (!professional) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-900">{professional.name}</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {professional.category}
          </Badge>
        </div>
        <div className="flex flex-col gap-1 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>{professional.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span>{professional.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalPreview;
