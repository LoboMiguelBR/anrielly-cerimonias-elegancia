import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';

// Substituir o componente existente pela versão funcional
import PagesManagerEnhanced from './PagesManagerEnhanced';

const PagesManager = () => {
  return <PagesManagerEnhanced />;
};

export default PagesManager;
