
import React from 'react';
import EventCalendarManager from '../events/EventCalendarManager';

const CalendarioEventosTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Calendário de Eventos</h2>
        <p className="text-gray-600">Gerencie sua agenda e timeline dos eventos</p>
      </div>
      
      <EventCalendarManager />
    </div>
  );
};

export default CalendarioEventosTab;
