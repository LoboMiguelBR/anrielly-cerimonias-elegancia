import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CMSStatusDashboard from './CMSStatusDashboard';
import CMSInitializerEnhanced from './CMSInitializerEnhanced';
import PagesManagerEnhanced from './PagesManagerEnhanced';
import SectionsManagerEnhanced from './SectionsManagerEnhanced';
import SEOSettingsEnhanced from './SEOSettingsEnhanced';
import ThemeCustomizerEnhanced from './ThemeCustomizerEnhanced';
import ServicesManager from '../services/ServicesManager';

const WebsiteManager = () => {
  return <WebsiteManagerEnhanced />;
};

export default WebsiteManager;
