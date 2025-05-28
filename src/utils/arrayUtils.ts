
/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 * @param array Array a ser embaralhado
 * @returns Novo array embaralhado
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Criar uma cópia para não modificar o original
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Verifica se dois arrays têm a mesma ordem
 * @param arr1 Primeiro array
 * @param arr2 Segundo array
 * @returns true se os arrays têm a mesma ordem
 */
export function arraysHaveSameOrder<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  
  return arr1.every((item, index) => {
    const item1Id = typeof item === 'object' && item !== null && 'id' in item ? (item as any).id : item;
    const item2Id = typeof arr2[index] === 'object' && arr2[index] !== null && 'id' in arr2[index] ? (arr2[index] as any).id : arr2[index];
    return item1Id === item2Id;
  });
}
