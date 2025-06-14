
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppIntegrationSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MessageCircle className="inline-block mr-2 text-green-500" />
          Integração WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">WhatsApp Business</p>
              <p className="text-sm text-green-600">Conectado</p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Mensagens hoje</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">95%</p>
              <p className="text-sm text-gray-600">Taxa de resposta</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppIntegrationSection;
