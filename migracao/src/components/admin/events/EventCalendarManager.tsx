
import React, { useState } from 'react';
import CalendarioEventos from './CalendarioEventos';
import TimelineEvento from './TimelineEvento';

const EventCalendarManager: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleBackToCalendar = () => {
    setSelectedEventId(null);
  };

  if (selectedEventId) {
    return (
      <TimelineEvento 
        eventId={selectedEventId} 
        onBack={handleBackToCalendar}
      />
    );
  }

  return (
    <CalendarioEventos onEventSelect={handleEventSelect} />
  );
};

export default EventCalendarManager;
