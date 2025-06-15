
import React from "react";
import EventTasks from "./EventTasks";
import FinanceiroEvento from "./FinanceiroEvento";

const TimelineEvento = ({ eventId, onBack }: { eventId: string, onBack?: () => void }) => {
  return (
    <div className="space-y-4">
      <EventTasks eventId={eventId} />
      <FinanceiroEvento eventId={eventId} />
    </div>
  );
};

export default TimelineEvento;

