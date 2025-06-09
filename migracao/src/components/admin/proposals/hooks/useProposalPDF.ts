
import { useState } from 'react';
import { pdf, Document } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData } from '../../hooks/proposal/types';
import { ProposalTemplateData } from '../templates/shared/types';
import { CoverPage } from '../../pdf/pages/CoverPage';
import { MainContentPage } from '../../pdf/pages/MainContentPage';
import { ServicesAndPricingPage } from '../../pdf/pages/ServicesAndPricingPage';
import { TestimonialsAndSignaturePage } from '../../pdf/pages/TestimonialsAndSignaturePage';
import { savePdfUrl } from '../../hooks/proposal/proposalApi';
import React from 'react';

export const useProposalPDF = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Default template inline
  const defaultTemplate: ProposalTemplateData = {
    id: 'default',
    name: 'Template Padrão',
    colors: {
      primary: '#8A2BE2',
      secondary: '#F2AE30',
      accent: '#E57373',
      text: '#333333',
      background: '#FFFFFF'
    },
    fonts: {
      title: 'Playfair Display, serif',
      body: 'Inter, sans-serif'
    },
    logo: "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png",
    showQrCode: true,
    showTestimonials: true,
    showDifferentials: true,
    showAboutSection: true
  };

  const generateAndSavePDF = async (
    proposal: ProposalData,
    template: ProposalTemplateData
  ): Promise<string | null> => {
    setIsGeneratingPDF(true);
    
    try {
      console.log('Generating PDF for proposal:', proposal.id);
      
      const safeTemplate = template || defaultTemplate;
      
      // Create Document element directly with all pages
      const pdfDocument = React.createElement(Document, {}, [
        React.createElement(CoverPage, { 
          key: 'cover',
          proposal, 
          template: safeTemplate 
        }),
        React.createElement(MainContentPage, { 
          key: 'main',
          proposal, 
          template: safeTemplate 
        }),
        React.createElement(ServicesAndPricingPage, { 
          key: 'services',
          proposal, 
          template: safeTemplate 
        }),
        React.createElement(TestimonialsAndSignaturePage, { 
          key: 'testimonials',
          proposal, 
          template: safeTemplate 
        })
      ]);
      
      const blob = await pdf(pdfDocument).toBlob();
      
      // Create file name
      const fileName = `proposta_${proposal.id}_${Date.now()}.pdf`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('proposals')
        .upload(fileName, blob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('proposals')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('PDF uploaded successfully:', publicUrl);

      // Save PDF URL to proposal record
      if (proposal.id) {
        await savePdfUrl(proposal.id, publicUrl);
      }

      setPdfUrl(publicUrl);
      toast.success('PDF gerado com sucesso!');
      return publicUrl;
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(`Erro ao gerar PDF: ${error.message}`);
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = (url: string, proposalId: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `proposta_${proposalId}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Erro ao fazer download do PDF');
    }
  };

  const sendProposalByEmail = async (
    proposal: ProposalData,
    pdfUrl: string
  ): Promise<boolean> => {
    setIsSendingEmail(true);
    
    try {
      console.log('Sending proposal by email:', proposal.id, 'to', proposal.client_email);
      
      const response = await supabase.functions.invoke('send-proposal', {
        body: {
          proposalId: proposal.id,
          to: proposal.client_email,
          clientName: proposal.client_name,
          pdfUrl: pdfUrl,
          subject: `Proposta de Serviço - ${proposal.event_type}`,
          message: `Olá ${proposal.client_name}, segue em anexo a proposta de serviços fotográficos conforme solicitado.`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success(`Proposta enviada para ${proposal.client_email}!`);
      return true;
      
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(`Erro ao enviar email: ${error.message}`);
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    isGeneratingPDF,
    isSendingEmail,
    pdfUrl,
    setPdfUrl,
    generateAndSavePDF,
    downloadPDF,
    sendProposalByEmail
  };
};
