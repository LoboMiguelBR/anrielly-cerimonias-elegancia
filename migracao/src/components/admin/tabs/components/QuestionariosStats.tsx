
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface QuestionariosStatsProps {
  stats?: {
    total: number;
    preenchidos: number;
    rascunhos: number;
    concluidos: number;
  };
}

const QuestionariosStats = ({ stats }: QuestionariosStatsProps) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Preenchidos</CardTitle>
          <Badge variant="default">{stats.preenchidos}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.preenchidos}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
          <Badge variant="secondary">{stats.rascunhos}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.rascunhos}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          <Badge variant="outline">{stats.concluidos}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.concluidos}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionariosStats;
