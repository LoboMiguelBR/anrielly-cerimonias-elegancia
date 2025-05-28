
import React from 'react';
import ContactForm from './ContactForm';

const ContactSection: React.FC = () => {
  return (
    <div className="animate-on-scroll opacity-0 transition-all duration-1000 ease-out transform translate-y-10">
      <ContactForm />
    </div>
  );
};

export default ContactSection;
