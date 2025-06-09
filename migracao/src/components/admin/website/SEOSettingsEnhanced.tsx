
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSettings } from '@/hooks/useAppSettings';

const SEOSettingsEnhanced = () => {
  const { getSetting, updateSetting } = useAppSettings();
  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    site_keywords: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_number: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar configurações existentes
    setFormData({
      site_title: getSetting('seo', 'site_title') || '',
      site_description: getSetting('seo', 'site_description') || '',
      site_keywords: getSetting('seo', 'site_keywords') || '',
      facebook_url: getSetting('social', 'facebook_url') || '',
      instagram_url: getSetting('social', 'instagram_url') || '',
      whatsapp_number: getSetting('social', 'whatsapp_number') || ''
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Salvar configurações de SEO
      await updateSetting('seo', 'site_title', formData.site_title);
      await updateSetting('seo', 'site_description', formData.site_description);
      await updateSetting('seo', 'site_keywords', formData.site_keywords);
      
      // Salvar configurações de redes sociais
      await updateSetting('social', 'facebook_url', formData.facebook_url);
      await updateSetting('social', 'instagram_url', formData.instagram_url);
      await updateSetting('social', 'whatsapp_number', formData.whatsapp_number);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              value={formData.site_title}
              onChange={(e) => handleChange('site_title', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-description">Descrição do Site</Label>
            <Textarea 
              id="site-description" 
              placeholder="Transforme seus momentos especiais em memórias inesquecíveis..."
              rows={3}
              value={formData.site_description}
              onChange={(e) => handleChange('site_description', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-keywords">Palavras-chave</Label>
            <Input 
              id="site-keywords" 
              placeholder="cerimonialista, casamento, eventos, organização"
              value={formData.site_keywords}
              onChange={(e) => handleChange('site_keywords', e.target.value)}
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
              value={formData.facebook_url}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram-url">Instagram</Label>
            <Input 
              id="instagram-url" 
              placeholder="https://instagram.com/anriellygomes"
              value={formData.instagram_url}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp-number">WhatsApp</Label>
            <Input 
              id="whatsapp-number" 
              placeholder="(11) 99999-9999"
              value={formData.whatsapp_number}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações de SEO'}
        </Button>
      </div>
    </div>
  );
};

export default SEOSettingsEnhanced;
