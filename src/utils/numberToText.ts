
// Utilitário para converter números para texto (valor por extenso)
export const numberToText = (value: number): string => {
  if (value === 0) return 'zero reais';
  
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const convertGroup = (num: number): string => {
    if (num === 0) return '';
    
    let result = '';
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const u = num % 10;
    
    if (h > 0) {
      if (num === 100) {
        result += 'cem';
      } else {
        result += hundreds[h];
      }
    }
    
    if (t > 1) {
      if (result) result += ' e ';
      result += tens[t];
      if (u > 0) {
        result += ' e ' + units[u];
      }
    } else if (t === 1) {
      if (result) result += ' e ';
      result += teens[u];
    } else if (u > 0) {
      if (result) result += ' e ';
      result += units[u];
    }
    
    return result;
  };

  // Separar reais e centavos
  const reais = Math.floor(value);
  const centavos = Math.round((value - reais) * 100);
  
  let result = '';
  
  // Converter reais
  if (reais === 0) {
    result = 'zero reais';
  } else if (reais === 1) {
    result = 'um real';
  } else if (reais < 1000) {
    result = convertGroup(reais) + ' reais';
  } else if (reais < 1000000) {
    const thousands = Math.floor(reais / 1000);
    const remainder = reais % 1000;
    
    if (thousands === 1) {
      result = 'mil';
    } else {
      result = convertGroup(thousands) + ' mil';
    }
    
    if (remainder > 0) {
      result += ' e ' + convertGroup(remainder);
    }
    
    result += ' reais';
  } else {
    // Para valores maiores, simplificar
    result = reais.toLocaleString('pt-BR') + ' reais';
  }
  
  // Adicionar centavos se houver
  if (centavos > 0) {
    if (centavos === 1) {
      result += ' e um centavo';
    } else {
      result += ' e ' + convertGroup(centavos) + ' centavos';
    }
  }
  
  return result;
};
