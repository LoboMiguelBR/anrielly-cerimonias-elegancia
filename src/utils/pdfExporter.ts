
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export const generateFinancialReport = (transactions: any[], startDate: string, endDate: string) => {
  const pdf = new jsPDF();
  
  // Cabeçalho
  pdf.setFontSize(20);
  pdf.text('Relatório Financeiro', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Período: ${startDate} a ${endDate}`, 20, 45);
  
  // Resumo
  const entradas = transactions.filter(t => t.type === 'entrada');
  const saidas = transactions.filter(t => t.type === 'saida');
  
  const totalEntradas = entradas.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalSaidas = saidas.reduce((sum, t) => sum + Number(t.amount), 0);
  const saldoLiquido = totalEntradas - totalSaidas;
  
  pdf.text(`Total de Entradas: R$ ${totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 65);
  pdf.text(`Total de Saídas: R$ ${totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 80);
  pdf.text(`Saldo Líquido: R$ ${saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 95);
  
  // Detalhes das transações
  let yPosition = 120;
  pdf.setFontSize(14);
  pdf.text('Detalhes das Transações', 20, yPosition);
  
  yPosition += 20;
  pdf.setFontSize(10);
  
  transactions.forEach((transaction, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 30;
    }
    
    const typeText = transaction.type === 'entrada' ? 'Entrada' : 'Saída';
    const amountText = `R$ ${Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    pdf.text(`${index + 1}. ${transaction.description}`, 20, yPosition);
    pdf.text(`${typeText} - ${transaction.category}`, 20, yPosition + 5);
    pdf.text(`${amountText} - ${new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}`, 20, yPosition + 10);
    
    yPosition += 20;
  });
  
  return pdf;
};
