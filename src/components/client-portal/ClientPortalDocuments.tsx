import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar, File, Image, FileImage } from 'lucide-react';
import { ClientDocument } from '@/hooks/client-portal/useClientPortalData';
import { toast } from 'sonner';

interface ClientPortalDocumentsProps {
  documents: ClientDocument[];
  loading: boolean;
}

export const ClientPortalDocuments = ({ documents, loading }: ClientPortalDocumentsProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    }
    if (fileType.includes('pdf')) {
      return <File className="h-5 w-5 text-red-500" />;
    }
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contract':
        return 'Contrato';
      case 'proposal':
        return 'Proposta';
      case 'questionnaire':
        return 'Questionário';
      case 'photo':
        return 'Foto';
      case 'other':
        return 'Outro';
      default:
        return 'Geral';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract':
        return 'bg-red-500/10 text-red-500';
      case 'proposal':
        return 'bg-blue-500/10 text-blue-500';
      case 'questionnaire':
        return 'bg-green-500/10 text-green-500';
      case 'photo':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDownload = async (doc: ClientDocument) => {
    try {
      // Criar um link temporário para download
      const link = window.document.createElement('a');
      link.href = doc.file_url;
      link.download = doc.title;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erro ao baixar o arquivo');
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Tamanho desconhecido';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>Seus documentos e arquivos do projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum documento disponível ainda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, ClientDocument[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedDocuments).map(([category, docs]) => (
        <Card key={category}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{getCategoryLabel(category)}</span>
                  <Badge variant="outline">{docs.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {docs.length} {docs.length === 1 ? 'documento' : 'documentos'} nesta categoria
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(document.file_type)}
                          <Badge className={getCategoryColor(category)}>
                            {getCategoryLabel(category)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold line-clamp-2">{document.title}</h3>
                        {document.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {document.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(document.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        {document.file_size && (
                          <div>Tamanho: {formatFileSize(document.file_size)}</div>
                        )}
                        
                        {document.download_count > 0 && (
                          <div>Downloads: {document.download_count}</div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(document)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                        
                        {document.file_type.includes('image') && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(document.file_url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};