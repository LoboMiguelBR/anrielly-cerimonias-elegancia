
// Core service
export { sendEmailNotification } from './emailService';

// Contact emails
export { sendContactNotification } from './contactEmails';

// Testimonial emails
export { 
  sendNewTestimonialNotification, 
  sendTestimonialApprovedNotification 
} from './testimonialEmails';

// Questionnaire emails
export {
  sendQuestionarioCompletedNotification,
  sendQuestionarioConfirmationNotification,
  sendQuestionarioWelcomeEmail,
  sendQuestionarioCompletionEmail
} from './questionarioEmails';

// Contract emails
export {
  sendContractForSignature,
  sendContractSignedConfirmation
} from './contractEmails';
