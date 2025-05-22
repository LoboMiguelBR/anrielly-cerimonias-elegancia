
import { HtmlTemplateData } from '../html-editor/types';

export interface ProposalTemplateData {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  logo: string;
  isHtmlTemplate?: boolean;
  htmlTemplate?: HtmlTemplateData;
}

export interface ProposalThemeContext {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}
