
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">🎨 Personalizar História IA - Configuração Completa</DialogTitle>
          <p className="text-sm text-gray-600">
            Configure todos os aspectos para gerar uma história única e detalhada
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna da Esquerda */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tipo_cerimonia">Tipo de Cerimônia</Label>
              <SugestoesInput
                value={formData.tipo_cerimonia || ''}
                onChange={(value) => updateField('tipo_cerimonia', value)}
                sugestoes={['Tradicional', 'Religiosa', 'Elopement', 'Simbólica', 'Civil', 'Ao ar livre', 'Na praia', 'No campo']}
                placeholder="Ex: Cerimônia ao ar livre no campo..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tom_conversa">Tom da Narrativa</Label>
              <SugestoesInput
                value={formData.tom_conversa || ''}
                onChange={(value) => updateField('tom_conversa', value)}
                sugestoes={['Romântico', 'Poético', 'Engraçado', 'Cerimonial', 'Íntimo', 'Solene', 'Descontraído', 'Emocionante']}
                placeholder="Como deve ser o tom da narrativa..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Emoções a Destacar</Label>
              <CheckboxGroup
                values={['Amor', 'Emoção', 'Leveza', 'Superação', 'Intimidade', 'Alegria', 'Nostalgia', 'Cumplicidade', 'Gratidão', 'Esperança']}
                selected={formData.tags_emocao || []}
                onChange={(selected) => updateField('tags_emocao', selected)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linguagem_celebrante">Estilo do Celebrante</Label>
              <SugestoesInput
                value={formData.linguagem_celebrante || ''}
                onChange={(value) => updateField('linguagem_celebrante', value)}
                sugestoes={['Celebrante Profissional', 'Amigo Próximo', 'Religioso', 'Moderno', 'Tradicional', 'Jovem', 'Experiente']}
                placeholder="Como o celebrante deve se expressar..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contexto_cultural">Contexto Cultural/Regional</Label>
              <SugestoesInput
                value={formData.contexto_cultural || ''}
                onChange={(value) => updateField('contexto_cultural', value)}
                sugestoes={['Urbano', 'Interior', 'Nordestino', 'Sulista', 'Intercultural', 'Tradicional brasileiro', 'Contemporâneo', 'Internacional']}
                placeholder="Contexto cultural da cerimônia..."
                rows={2}
              />
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="momento_especial">Momentos Especiais a Destacar</Label>
              <Textarea
                value={formData.momento_especial || ''}
                onChange={(e) => updateField('momento_especial', e.target.value)}
                placeholder="Descreva momentos específicos que devem ser enfatizados na história (primeiro encontro, pedido de casamento, superação de desafios, etc.)"
                rows={4}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes_adicionais">Instruções Especiais para a IA</Label>
              <Textarea
                value={formData.observacoes_adicionais || ''}
                onChange={(e) => updateField('observacoes_adicionais', e.target.value)}
                placeholder="Instruções específicas: 'Gere uma história longa e detalhada', 'Inclua anedotas divertidas', 'Foque na jornada emocional', 'Destaque a família', etc."
                rows={4}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="incluir_votos"
                  checked={formData.incluir_votos || false}
                  onCheckedChange={(checked) => updateField('incluir_votos', checked)}
                />
                <Label htmlFor="incluir_votos" className="text-sm">
                  📝 Incluir votos personalizados baseados nas respostas
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="incluir_aliancas"
                  checked={formData.incluir_aliancas || false}
                  onCheckedChange={(checked) => updateField('incluir_aliancas', checked)}
                />
                <Label htmlFor="incluir_aliancas" className="text-sm">
                  💍 Incluir descrição simbólica da troca de alianças
                </Label>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">💡 Dicas para uma história melhor:</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Combine múltiplas opções nos campos de sugestões</li>
                <li>• Seja específico nos momentos especiais</li>
                <li>• Use as instruções especiais para orientar o estilo</li>
                <li>• Quanto mais detalhes, mais personalizada será a história</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? 'Salvando...' : '✨ Salvar e Gerar História Detalhada'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPersonalizacao;
