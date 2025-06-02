
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ThemeCustomizer = () => {
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
                  value="#8A2BE2" 
                  className="w-16 h-10"
                />
                <Input value="#8A2BE2" className="flex-1" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input 
                  id="secondary-color" 
                  type="color" 
                  value="#F2AE30" 
                  className="w-16 h-10"
                />
                <Input value="#F2AE30" className="flex-1" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accent-color">Cor de Destaque</Label>
              <div className="flex gap-2">
                <Input 
                  id="accent-color" 
                  type="color" 
                  value="#E57373" 
                  className="w-16 h-10"
                />
                <Input value="#E57373" className="flex-1" />
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
              <select 
                id="title-font" 
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Playfair Display">Playfair Display</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Merriweather">Merriweather</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body-font">Fonte do Texto</Label>
              <select 
                id="body-font" 
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Inter">Inter</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>Salvar Personalizações</Button>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
