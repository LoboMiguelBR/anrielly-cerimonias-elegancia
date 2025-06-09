
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  html: string;
}

interface CMSVisualTemplatesProps {
  onSelectTemplate: (html: string) => void;
}

const CMSVisualTemplates: React.FC<CMSVisualTemplatesProps> = ({ onSelectTemplate }) => {
  const templates: TemplateOption[] = [
    {
      id: 'hero-image',
      name: 'Hero com Imagem de Fundo',
      description: 'Seção hero com imagem de fundo e texto sobreposto',
      preview: '🖼️ Hero + Imagem',
      html: `<div class="relative min-h-screen flex items-center justify-center text-white" style="background-image: url('{{background_image}}'); background-size: cover; background-position: center;">
  <div class="absolute inset-0 bg-black bg-opacity-40"></div>
  <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
    <h1 class="text-5xl md:text-7xl font-serif mb-6">{{title}}</h1>
    <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">{{subtitle}}</p>
    <a href="{{cta_link}}" class="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
      {{cta_label}}
    </a>
  </div>
</div>`
    },
    {
      id: 'about-image-text',
      name: 'Sobre Nós com Imagem',
      description: 'Seção dividida com imagem à esquerda e texto à direita',
      preview: '🖼️ Imagem + Texto',
      html: `<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="order-2 md:order-1">
        <img src="{{image_url}}" alt="{{image_alt}}" class="w-full h-96 object-cover rounded-lg shadow-lg">
      </div>
      <div class="order-1 md:order-2">
        <h2 class="text-4xl font-serif text-primary mb-6">{{title}}</h2>
        <p class="text-lg text-gray-600 leading-relaxed mb-6">{{subtitle}}</p>
        <div class="prose prose-lg">
          {{content_text}}
        </div>
        <a href="{{cta_link}}" class="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
          {{cta_label}}
        </a>
      </div>
    </div>
  </div>
</section>`
    },
    {
      id: 'gallery-grid',
      name: 'Galeria em Grid',
      description: 'Grid de imagens com efeito hover',
      preview: '🖼️ Grid Galeria',
      html: `<section class="py-20 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-serif text-primary mb-4">{{title}}</h2>
      <p class="text-xl text-gray-600">{{subtitle}}</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_1}}" alt="{{alt_1}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_2}}" alt="{{alt_2}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_3}}" alt="{{alt_3}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_4}}" alt="{{alt_4}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_5}}" alt="{{alt_5}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_6}}" alt="{{alt_6}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_7}}" alt="{{alt_7}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <div class="aspect-square overflow-hidden rounded-lg group">
        <img src="{{image_8}}" alt="{{alt_8}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
    </div>
    <div class="text-center mt-8">
      <a href="{{cta_link}}" class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
        {{cta_label}}
      </a>
    </div>
  </div>
</section>`
    },
    {
      id: 'services-cards-images',
      name: 'Serviços com Imagens',
      description: 'Cards de serviços com imagens de fundo',
      preview: '🖼️ Cards Serviços',
      html: `<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-serif text-primary mb-4">{{title}}</h2>
      <p class="text-xl text-gray-600">{{subtitle}}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="group cursor-pointer">
        <div class="relative h-64 overflow-hidden rounded-lg mb-4">
          <img src="{{service_image_1}}" alt="{{service_alt_1}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-xl font-semibold">{{service_title_1}}</h3>
          </div>
        </div>
        <p class="text-gray-600">{{service_description_1}}</p>
      </div>
      <div class="group cursor-pointer">
        <div class="relative h-64 overflow-hidden rounded-lg mb-4">
          <img src="{{service_image_2}}" alt="{{service_alt_2}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-xl font-semibold">{{service_title_2}}</h3>
          </div>
        </div>
        <p class="text-gray-600">{{service_description_2}}</p>
      </div>
      <div class="group cursor-pointer">
        <div class="relative h-64 overflow-hidden rounded-lg mb-4">
          <img src="{{service_image_3}}" alt="{{service_alt_3}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-xl font-semibold">{{service_title_3}}</h3>
          </div>
        </div>
        <p class="text-gray-600">{{service_description_3}}</p>
      </div>
    </div>
    <div class="text-center mt-8">
      <a href="{{cta_link}}" class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
        {{cta_label}}
      </a>
    </div>
  </div>
</section>`
    },
    {
      id: 'testimonial-image',
      name: 'Depoimento com Foto',
      description: 'Depoimento destacado com foto do cliente',
      preview: '🖼️ Depoimento + Foto',
      html: `<section class="py-20 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-serif text-primary mb-12">{{title}}</h2>
      <div class="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div class="mb-8">
          <img src="{{client_photo}}" alt="{{client_name}}" class="w-20 h-20 rounded-full mx-auto mb-4 object-cover">
          <h3 class="text-xl font-semibold text-gray-900">{{client_name}}</h3>
          <p class="text-gray-600">{{client_role}}</p>
        </div>
        <blockquote class="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
          "{{testimonial_text}}"
        </blockquote>
        <div class="flex justify-center">
          <div class="flex text-yellow-400">
            <span class="text-2xl">★★★★★</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
    },
    {
      id: 'cta-background',
      name: 'CTA com Fundo',
      description: 'Call-to-Action com imagem de fundo',
      preview: '🖼️ CTA + Fundo',
      html: `<section class="py-20 relative" style="background-image: url('{{background_image}}'); background-size: cover; background-position: center;">
  <div class="absolute inset-0 bg-black bg-opacity-50"></div>
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-3xl mx-auto text-center text-white">
      <h2 class="text-4xl md:text-5xl font-serif mb-6">{{title}}</h2>
      <p class="text-xl md:text-2xl mb-8">{{subtitle}}</p>
      <a href="{{cta_link}}" class="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
        {{cta_label}}
      </a>
    </div>
  </div>
</section>`
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Templates Visuais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">{template.preview}</span>
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <Button 
                size="sm" 
                onClick={() => onSelectTemplate(template.html)}
                className="w-full"
              >
                Usar Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CMSVisualTemplates;
