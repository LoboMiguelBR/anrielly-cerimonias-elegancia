import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWebsiteTheme } from '@/hooks/useWebsiteTheme';

const ThemeCustomizerEnhanced = () => {
  const { theme, isLoading, updateTheme } = useWebsiteTheme();
  const [formData, setFormData] = useState({
    primary_color: '#8A2BE2',
    secondary_color: '#F2AE30',
    accent_color: '#E57373',
    title_font: 'Playfair Display',
    body_font: 'Inter'
  });

  useEffect(() => {
    if (theme) {
      setFormData({
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        accent_color: theme.accent_color,
        title_font: theme.title_font,
        body_font: theme.body_font
      });
    }
  }, [theme]);

  const handleSave = async () => {
    await updateTheme(formData);
  };

  const handleColorChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFontChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando configurações de tema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cores */}
        <Card>
          <CardHeader>
            <CardTitle>Cores do Tema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <div className="flex gap-2">
                <Input 
                  id="primary-color" 
                  type="color" 
                  value={formData.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="w-16 h-10"
                />
                <Input 
                  value={formData.primary_color} 
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input 
                  id="secondary-color" 
                  type="color" 
                  value={formData.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="w-16 h-10"
                />
                <Input 
                  value={formData.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accent-color">Cor de Destaque</Label>
              <div className="flex gap-2">
                <Input 
                  id="accent-color" 
                  type="color" 
                  value={formData.accent_color}
                  onChange={(e) => handleColorChange('accent_color', e.target.value)}
                  className="w-16 h-10"
                />
                <Input 
                  value={formData.accent_color}
                  onChange={(e) => handleColorChange('accent_color', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipografia */}
        <Card>
          <CardHeader>
            <CardTitle>Tipografia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title-font">Fonte dos Títulos</Label>
              <Select 
                value={formData.title_font}
                onValueChange={(value) => handleFontChange('title_font', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body-font">Fonte do Texto</Label>
              <Select 
                value={formData.body_font}
                onValueChange={(value) => handleFontChange('body_font', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview das fontes */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div 
                className="text-lg font-bold mb-2"
                style={{ fontFamily: formData.title_font, color: formData.primary_color }}
              >
                Título de Exemplo
              </div>
              <div 
                className="text-sm"
                style={{ fontFamily: formData.body_font, color: formData.secondary_color }}
              >
                Este é um exemplo de texto usando a fonte do corpo selecionada.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Personalizações</Button>
      </div>
    </div>
  );
};

export default ThemeCustomizerEnhanced;
