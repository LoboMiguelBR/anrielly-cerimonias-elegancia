
import { primaryMenuItems } from './primaryMenuItems';
import { crmVendasItems } from './crmVendasItems';
import { operacionalItems } from './operacionalItems';
import { conteudoItems } from './conteudoItems';
import { sistemaItems } from './sistemaItems';
import { MenuItem } from './menuTypes';

export const getAllMenuItems = (): MenuItem[] => {
  try {
    const allItems = [
      ...primaryMenuItems,
      ...crmVendasItems,
      ...operacionalItems,
      ...conteudoItems,
      ...sistemaItems,
    ];
    console.log('menuConfig: Total de itens carregados:', allItems.length);
    return allItems;
  } catch (error) {
    console.error('menuConfig: Erro ao obter todos os itens do menu:', error);
    return [];
  }
};

export const getMenuSections = () => {
  try {
    return [
      {
        title: "Principal",
        items: primaryMenuItems
      },
      {
        title: "CRM & Vendas",
        items: crmVendasItems
      },
      {
        title: "Operacional",
        items: operacionalItems
      },
      {
        title: "Conteúdo",
        items: conteudoItems
      },
      {
        title: "Sistema",
        items: sistemaItems
      }
    ];
  } catch (error) {
    console.error('menuConfig: Erro ao obter seções do menu:', error);
    return [];
  }
};
