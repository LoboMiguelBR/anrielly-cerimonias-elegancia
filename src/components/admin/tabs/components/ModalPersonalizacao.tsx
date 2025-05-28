
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { usePersonalizacaoIA, PersonalizacaoIA } from '@/hooks/usePersonalizacaoIA';
import SugestoesInput from './SugestoesInput';
import CheckboxGroup from './CheckboxGroup';

interface ModalPersonalizacaoProps {
  isOpen: boolean;
  onClose: () => void;
  linkPublico: string;
  onPersonalizacaoSalva: () => void;
}

const ModalPersonalizacao = ({ isOpen, onClose, linkPublico, onPersonalizacaoSalva }: ModalPersonalizacaoProps) => {
  const { isLoading, buscarPersonalizacao, salvarPersonalizacao } = usePersonalizacaoIA();
  
  const [formData, setFormData] = useState<PersonalizacaoIA>({
    link_publico: linkPublico,
    tipo_cerimonia: '',
    tom_conversa: '',
    tags_emocao: [],
    momento_especial: '',
    incluir_votos: false,
    incluir_aliancas: false,
    linguagem_celebrante: '',
    contexto_cultural: '',
    observacoes_adicionais: ''
  });

  useEffect(() => {
    if (isOpen && linkPublico) {
      carregarPersonalizacao();
    }
  }, [isOpen, linkPublico]);

  const carregarPersonalizacao = async () => {
    const personalizacao = await buscarPersonalizacao(linkPublico);
    if (personalizacao) {
      setFormData(personalizacao);
    }
  };

  const handleSalvar = async () => {
    const sucesso = await salvarPersonalizacao(formData);
    if (sucesso) {
      onPersonalizacaoSalva();
      onClose();
    }
  };

  const updateField = (field: keyof PersonalizacaoIA, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🎨 Personalizar História IA</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tipo_cerimonia">Tipo de Cerimônia</Label>
            <SugestoesInput
              value={formData.tipo_cerimonia || ''}
              onChange={(value) => updateField('tipo_cerimonia', value)}
              sugestoes={['Tradicional', 'Religiosa', 'Elopement', 'Simbólica']}
              placeholder="Ex: Cerimônia ao ar livre..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tom_conversa">Tom da Conversa</Label>
            <SugestoesInput
              value={formData.tom_conversa || ''}
              onChange={(value) => updateField('tom_conversa', value)}
              sugestoes={['Romântico', 'Poético', 'Engraçado', 'Cerimonial']}
              placeholder="Como deve ser o tom da narrativa..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags de Emoção</Label>
            <CheckboxGroup
              values={['Amor', 'Emoção', 'Leveza', 'Superação', 'Intimidade', 'Alegria', 'Nostalgia']}
              selected={formData.tags_emocao || []}
              onChange={(selected) => updateField('tags_emocao', selected)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="momento_especial">Momento Especial a Destacar</Label>
            <Textarea
              value={formData.momento_especial || ''}
              onChange={(e) => updateField('momento_especial', e.target.value)}
              placeholder="Algum momento específico que deve ser enfatizado na história..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linguagem_celebrante">Linguagem do Celebrante</Label>
            <SugestoesInput
              value={formData.linguagem_celebrante || ''}
              onChange={(value) => updateField('linguagem_celebrante', value)}
              sugestoes={['Celebrante Profissional', 'Amigo Próximo', 'Religioso', 'Moderno']}
              placeholder="Como o celebrante deve se expressar..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contexto_cultural">Contexto Cultural</Label>
            <SugestoesInput
              value={formData.contexto_cultural || ''}
              onChange={(value) => updateField('contexto_cultural', value)}
              sugestoes={['Urbano', 'Interior', 'Nordeste', 'Sul', 'Intercultural']}
              placeholder="Contexto cultural da cerimônia..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="incluir_votos"
                checked={formData.incluir_votos || false}
                onCheckedChange={(checked) => updateField('incluir_votos', checked)}
              />
              <Label htmlFor="incluir_votos">Incluir votos personalizados</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="incluir_aliancas"
                checked={formData.incluir_aliancas || false}
                onCheckedChange={(checked) => updateField('incluir_aliancas', checked)}
              />
              <Label htmlFor="incluir_aliancas">Incluir troca de alianças</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes_adicionais">Observações Adicionais</Label>
            <Textarea
              value={formData.observacoes_adicionais || ''}
              onChange={(e) => updateField('observacoes_adicionais', e.target.value)}
              placeholder="Outras informações importantes para a personalização..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar e Gerar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPersonalizacao;
