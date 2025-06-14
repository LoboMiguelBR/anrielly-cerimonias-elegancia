
/**
 * Renomeada para Website & CMS na navegação.
 */
import React, { useState } from 'react';
import CMSHomeManager from '../cms-home/CMSHomeManager';
import CMSVisualBuilder from '../cms-home/CMSVisualBuilder';
import { Button } from '@/components/ui/button';

const CMSHomeTab = () => {
  const [mode, setMode] = useState<"classic" | "visual">("classic");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Home - CMS</h2>
        <Button
          variant="outline"
          onClick={() => setMode(mode === "classic" ? "visual" : "classic")}
        >
          {mode === "classic" ? "Abrir Builder Visual" : "Voltar para Lista"}
        </Button>
      </div>

      {mode === "classic" ? (
        <CMSHomeManager />
      ) : (
        <CMSVisualBuilder />
      )}
    </div>
  );
};

export default CMSHomeTab;
