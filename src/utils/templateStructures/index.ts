
import { TemplateStructures } from './types';
import { religiousEventsTemplates } from './religiousEvents';
import { relationshipEventsTemplates } from './relationshipEvents';
import { familyEventsTemplates } from './familyEvents';
import { corporateEventsTemplates } from './corporateEvents';

export * from './types';

export const templateStructures: TemplateStructures = {
  ...religiousEventsTemplates,
  ...relationshipEventsTemplates,
  ...familyEventsTemplates,
  ...corporateEventsTemplates
};
