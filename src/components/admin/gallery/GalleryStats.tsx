
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Upload } from 'lucide-react';

interface GalleryStatsProps {
  totalImages: number;
  recentImages: number;
}

const GalleryStats = ({ totalImages, recentImages }: GalleryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Total de Imagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalImages}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Adicionadas Esta Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">{recentImages}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold text-green-600">
            {totalImages > 0 ? 'Galeria Ativa' : 'Galeria Vazia'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryStats;
