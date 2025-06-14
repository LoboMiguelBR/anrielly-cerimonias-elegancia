
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, Type, Image, Mail } from 'lucide-react';

interface CMSTemplateSelectorProps {
  onSelectTemplate: (template: any) => void;
}

const CMSTemplateSelector = ({ onSelectTemplate }: CMSTemplateSelectorProps) => {
  const templates = [
    {
      id: 'hero',
      name: 'Seção Hero',
      icon: Layout,
      description: 'Seção principal com título e call-to-action',
      html: `<section class="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-4xl md:text-6xl font-bold mb-6 text-gray-800">{{title}}</h1>
    <p class="text-xl md:text-2xl mb-8 text-gray-600">{{subtitle}}</p>
    <a href="{{cta_link}}" class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
      {{cta_label}}
    </a>
  </div>
</section>`,
      bg_color: '#f8fafc'
    },
    {
      id: 'about',
      name: 'Sobre Nós',
      icon: Type,
      description: 'Seção informativa com texto e imagem',
      html: `<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 class="text-3xl font-bold mb-4 text-gray-800">{{title}}</h2>
        <p class="text-lg text-gray-600 mb-6">{{subtitle}}</p>
        <a href="{{cta_link}}" class="text-purple-600 hover:text-purple-700 font-semibold">
          {{cta_label}} →
        </a>
      </div>
      <div class="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
        <span class="text-gray-500">Imagem</span>
      </div>
    </div>
  </div>
</section>`,
      bg_color: '#ffffff'
    },
    {
      id: 'services',
      name: 'Serviços',
      icon: Image,
      description: 'Grade de serviços ou produtos',
      html: `<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">{{title}}</h2>
      <p class="text-lg text-gray-600">{{subtitle}}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-2">Serviço 1</h3>
        <p class="text-gray-600">Descrição do serviço oferecido</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-2">Serviço 2</h3>
        <p class="text-gray-600">Descrição do serviço oferecido</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-2">Serviço 3</h3>
        <p class="text-gray-600">Descrição do serviço oferecido</p>
      </div>
    </div>
  </div>
</section>`,
      bg_color: '#f9fafb'
    },
    {
      id: 'contact',
      name: 'Contato',
      icon: Mail,
      description: 'Seção de contato e call-to-action',
      html: `<section class="py-16 bg-purple-600 text-white">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-3xl font-bold mb-4">{{title}}</h2>
    <p class="text-xl mb-8">{{subtitle}}</p>
    <a href="{{cta_link}}" class="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
      {{cta_label}}
    </a>
  </div>
</section>`,
      bg_color: '#7c3aed'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Escolha um template</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconComponent className="w-5 h-5" />
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onSelectTemplate({
                    title: template.name,
                    content_html: template.html,
                    bg_color: template.bg_color,
                    subtitle: '',
                    cta_label: 'Saiba mais',
                    cta_link: '#',
                    active: true
                  })}
                >
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CMSTemplateSelector;
