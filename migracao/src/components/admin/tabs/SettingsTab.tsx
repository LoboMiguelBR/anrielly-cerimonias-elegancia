
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Bell, Cog, Palette, Users } from 'lucide-react';
import CompanySettings from '../settings/CompanySettings';
import EmailSettings from '../settings/EmailSettings';
import NotificationSettings from '../settings/NotificationSettings';
import SystemSettings from '../settings/SystemSettings';
import { useAppSettings } from '@/hooks/useAppSettings';

const SettingsTab = () => {
  const { settings, isLoading, updateSetting, getSetting, getSettingsByCategory } = useAppSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
        <p className="text-gray-600">Gerencie as configurações gerais da plataforma</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettings 
            settings={getSettingsByCategory('company')}
            onUpdate={updateSetting}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
