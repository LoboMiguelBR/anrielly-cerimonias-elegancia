
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SEOSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais de SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-title">Título do Site</Label>
            <Input 
              id="site-title" 
              placeholder="Anrielly Gomes - Cerimonialista"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-description">Descrição do Site</Label>
            <Textarea 
              id="site-description" 
              placeholder="Transforme seus momentos especiais em memórias inesquecíveis..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-keywords">Palavras-chave</Label>
            <Input 
              id="site-keywords" 
              placeholder="cerimonialista, casamento, eventos, organização"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook-url">Facebook</Label>
            <Input 
              id="facebook-url" 
              placeholder="https://facebook.com/anriellygomes"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram-url">Instagram</Label>
            <Input 
              id="instagram-url" 
              placeholder="https://instagram.com/anriellygomes"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp-number">WhatsApp</Label>
            <Input 
              id="whatsapp-number" 
              placeholder="(11) 99999-9999"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Salvar Configurações de SEO</Button>
      </div>
    </div>
  );
};

export default SEOSettings;
