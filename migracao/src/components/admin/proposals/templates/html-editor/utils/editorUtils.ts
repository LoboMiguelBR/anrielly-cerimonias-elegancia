
import { VariableInsertionResult } from '../types';

/**
 * Insert variable or content at cursor position
 */
export const insertVariableAtCursor = (
  content: string,
  cursorPos: number,
  prefix: string, 
  suffix: string,
  insertContent: string
): VariableInsertionResult => {
  const beforeCursor = content.substring(0, cursorPos);
  const afterCursor = content.substring(cursorPos);
  const updatedContent = beforeCursor + prefix + insertContent + suffix + afterCursor;
  const newCursorPos = cursorPos + prefix.length + insertContent.length + suffix.length;
  
  return {
    updatedContent,
    cursorPosition: newCursorPos
  };
};
