
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from 'lucide-react';
import HistoriasCasaisManager from './components/HistoriasCasaisManager';

const HistoriasCasaisTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Histórias dos Casais</h2>
          <p className="text-gray-600">Gerencie histórias geradas automaticamente a partir dos questionários</p>
        </div>
      </div>
      
      <HistoriasCasaisManager />
    </div>
  );
};

export default HistoriasCasaisTab;
