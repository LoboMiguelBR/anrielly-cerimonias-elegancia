
import React, { useState } from "react";
import { CMSHomeSection } from "@/hooks/useCMSHomeSections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import CMSImageUpload from "./CMSImageUpload";

interface CMSVisualSectionEditorProps {
  section: CMSHomeSection;
  onSave: (updates: Partial<CMSHomeSection>) => void;
  onCancel: () => void;
}
const CMSVisualSectionEditor: React.FC<CMSVisualSectionEditorProps> = ({
  section,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState({
    title: section.title,
    subtitle: section.subtitle || "",
    content_html: section.content_html || "",
    bg_color: section.bg_color || "#ffffff",
    cta_label: section.cta_label || "",
    cta_link: section.cta_link || "",
    background_image: section.background_image || "",
    active: section.active,
  });
  // Editor compacto, só os principais campos
  return (
    <form
      className="flex flex-col gap-3 bg-white rounded-lg border shadow p-4"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="flex gap-2 items-center">
        <Input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Título"
          className="font-semibold"
        />
        <Switch
          checked={form.active}
          onCheckedChange={active => setForm({ ...form, active })}
        />
      </div>
      <Input
        value={form.subtitle}
        onChange={e => setForm({ ...form, subtitle: e.target.value })}
        placeholder="Subtítulo"
      />
      <Textarea
        value={form.content_html}
        onChange={e => setForm({ ...form, content_html: e.target.value })}
        placeholder="Conteúdo HTML"
        rows={3}
      />
      <div className="flex gap-2">
        <Input
          type="color"
          value={form.bg_color}
          onChange={e => setForm({ ...form, bg_color: e.target.value })}
          className="w-14 h-9 p-0"
          title="Cor de fundo"
        />
        <CMSImageUpload
          value={form.background_image}
          onChange={url => setForm({ ...form, background_image: url || "" })}
          label={undefined}
          helperText="Imagem fundo (opcional)"
        />
      </div>
      <div className="flex gap-2">
        <Input
          value={form.cta_label}
          onChange={e => setForm({ ...form, cta_label: e.target.value })}
          placeholder="Texto do botão"
        />
        <Input
          value={form.cta_link}
          onChange={e => setForm({ ...form, cta_link: e.target.value })}
          placeholder="Link do botão"
        />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button type="submit" className="min-w-20">Salvar</Button>
        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};
export default CMSVisualSectionEditor;

