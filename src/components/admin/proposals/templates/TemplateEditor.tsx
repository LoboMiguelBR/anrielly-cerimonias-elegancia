import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalTemplateData } from './shared/types';
import { saveTemplate, updateTemplate } from './shared/templateService';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface TemplateEditorProps {
  template: ProposalTemplateData;
  onSaved: () => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template, 
  onSaved,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Create a form with the template data
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      name: template.name,
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      textColor: template.colors.text,
      backgroundColor: template.colors.background,
      showQrCode: template.showQrCode,
      showTestimonials: template.showTestimonials,
      showDifferentials: template.showDifferentials,
      showAboutSection: template.showAboutSection,
    }
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const templateData: Omit<ProposalTemplateData, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        colors: {
          primary: data.primaryColor,
          secondary: data.secondaryColor,
          accent: data.accentColor,
          text: data.textColor,
          background: data.backgroundColor,
        },
        fonts: template.fonts, // Keep existing fonts for now
        showQrCode: data.showQrCode,
        showTestimonials: data.showTestimonials,
        showDifferentials: data.showDifferentials,
        showAboutSection: data.showAboutSection,
        logo: template.logo, // Keep existing logo
      };
      
      let success = false;
      
      // If it has an ID and it's not the default template, update it
      if (template.id && template.id !== 'default') {
        success = await updateTemplate(template.id, templateData);
      } else {
        // Otherwise create a new template
        const newId = await saveTemplate(templateData);
        success = !!newId;
      }
      
      if (success) {
        onSaved();
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Falha ao salvar template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">Geral</TabsTrigger>
          <TabsTrigger value="colors" className="flex-1">Cores</TabsTrigger>
          <TabsTrigger value="sections" className="flex-1">Seções</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Nome do Template</Label>
            <Input 
              id="name" 
              placeholder="Ex: Template Padrão" 
              {...register("name", { required: true })}
            />
            {errors.name && <p className="text-sm text-red-500">Nome é obrigatório</p>}
          </div>
          
          {/* Preview section would go here in the future */}
          <div className="p-6 border rounded-md bg-gray-50">
            <p className="text-center text-gray-500">Visualização do template (em breve)</p>
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="primaryColor" 
                  type="color"
                  className="w-12 h-8 p-1" 
                  {...register("primaryColor")}
                />
                <Input 
                  type="text"
                  className="flex-grow"
                  value={watch("primaryColor")} 
                  onChange={(e) => setValue("primaryColor", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="secondaryColor" 
                  type="color" 
                  className="w-12 h-8 p-1" 
                  {...register("secondaryColor")}
                />
                <Input 
                  type="text"
                  className="flex-grow"
                  value={watch("secondaryColor")} 
                  onChange={(e) => setValue("secondaryColor", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accentColor">Cor de Destaque</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="accentColor" 
                  type="color" 
                  className="w-12 h-8 p-1" 
                  {...register("accentColor")}
                />
                <Input 
                  type="text"
                  className="flex-grow"
                  value={watch("accentColor")} 
                  onChange={(e) => setValue("accentColor", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Cor do Texto</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="textColor" 
                  type="color" 
                  className="w-12 h-8 p-1" 
                  {...register("textColor")}
                />
                <Input 
                  type="text"
                  className="flex-grow"
                  value={watch("textColor")} 
                  onChange={(e) => setValue("textColor", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="backgroundColor" 
                  type="color" 
                  className="w-12 h-8 p-1" 
                  {...register("backgroundColor")}
                />
                <Input 
                  type="text"
                  className="flex-grow"
                  value={watch("backgroundColor")} 
                  onChange={(e) => setValue("backgroundColor", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 mt-4 border rounded-md">
            <p className="text-sm text-gray-500 mb-2">Visualização de cores</p>
            <div 
              className="p-6 rounded-md shadow-sm" 
              style={{ backgroundColor: watch("backgroundColor") || '#ffffff' }}
            >
              <h3 
                style={{ 
                  color: watch("primaryColor") || '#000000',
                  fontFamily: template.fonts.heading
                }}
                className="text-xl font-semibold mb-2"
              >
                Exemplo de Título
              </h3>
              <p 
                style={{ 
                  color: watch("textColor") || '#333333',
                  fontFamily: template.fonts.body
                }}
                className="mb-4"
              >
                Este é um exemplo de texto de parágrafo para visualizar as cores e fontes do template.
              </p>
              <div 
                style={{ backgroundColor: watch("accentColor") || '#e0e0e0' }}
                className="p-2 rounded-md mb-4"
              >
                <p 
                  style={{ 
                    color: '#ffffff',
                    fontFamily: template.fonts.body
                  }}
                >
                  Exemplo de bloco de destaque
                </p>
              </div>
              <button
                style={{
                  backgroundColor: watch("secondaryColor") || '#cccccc',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontFamily: template.fonts.body
                }}
              >
                Botão de Exemplo
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sections" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showQrCode" className="cursor-pointer">
                Exibir QR Code
              </Label>
              <Switch 
                id="showQrCode" 
                checked={watch("showQrCode")}
                onCheckedChange={(checked) => setValue("showQrCode", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showTestimonials" className="cursor-pointer">
                Exibir Depoimentos
              </Label>
              <Switch 
                id="showTestimonials" 
                checked={watch("showTestimonials")}
                onCheckedChange={(checked) => setValue("showTestimonials", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showDifferentials" className="cursor-pointer">
                Exibir Diferenciais
              </Label>
              <Switch 
                id="showDifferentials" 
                checked={watch("showDifferentials")}
                onCheckedChange={(checked) => setValue("showDifferentials", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showAboutSection" className="cursor-pointer">
                Exibir Seção Sobre
              </Label>
              <Switch 
                id="showAboutSection" 
                checked={watch("showAboutSection")}
                onCheckedChange={(checked) => setValue("showAboutSection", checked)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {template.id && template.id !== 'default' ? 'Atualizar Template' : 'Criar Template'}
        </Button>
      </div>
    </form>
  );
};
